# Home-lab infra

The complete production stack: the **portfolio**, **Nginx**, **n8n**
(automation), **cal.com** (bookings), and **Umami** (analytics). Everything runs
from this directory and is deployable as one Portainer Git stack.

```bash
cp .env.example .env    # fill in secrets (see below)
docker compose up -d
```

## Nginx reverse proxy and TLS

Nginx is the only service exposing public HTTP/HTTPS ports. It proxies the main
domain to the separately deployed portfolio and uses subdomains for Portainer,
n8n, cal.com, and Umami.

1. Point the following DNS records to the VPS: `@`, `www`, `portainer`,
   `automation`, `book`, and `analytics`.
2. Create stable secret directories on the VPS, outside Portainer's Git clone,
   then put the Namecheap certificate chain at
   `/opt/stacks/nginx/certs/fullchain.pem` and its matching private key at
   `/opt/stacks/nginx/certs/private.key`. The certificate must cover every
   configured hostname (normally using a wildcard certificate).

   ```bash
   sudo mkdir -p /opt/stacks/nginx/{certs,auth}
   ```
3. Generate the extra Portainer login:

   ```bash
   docker run --rm --entrypoint htpasswd httpd:2-alpine -Bbn mohamed 'CHOOSE-A-PASSWORD' | sudo tee /opt/stacks/nginx/auth/.htpasswd >/dev/null
   sudo chmod 600 /opt/stacks/nginx/auth/.htpasswd /opt/stacks/nginx/certs/private.key
   ```

4. Set `DOMAIN` and the public URLs in `.env`, then start the stack:

   ```bash
   docker compose config
   docker compose up -d
   ```

The portfolio is built from the repository root and stays private on the
Compose network. Portainer is installed outside this stack and must publish
`9443`; Nginx reaches it through Docker's host gateway. The portfolio, n8n,
cal.com, Umami, and both PostgreSQL databases are not published on the host.

Portainer is protected by Nginx Basic Auth in addition to its own login. n8n
is deliberately not protected globally because public webhooks must reach it;
Umami is also public because the portfolio must load its tracking script and
send analytics events.

## n8n — contact form automation

When someone submits the contact form, the portfolio saves the message to its
database and POSTs it to an n8n webhook. The workflow then emails you a
notification and sends the visitor an auto-reply, both via Resend.

```
contact form ──▶ Next.js server action ──▶ POST /webhook/contact (n8n)
                                             ├── Resend: notify owner
                                             └── Resend: auto-reply sender
```

### Setup

1. **Secrets in `.env`:**
   - `N8N_ENCRYPTION_KEY` — `openssl rand -hex 24` (keep stable)
   - `RESEND_API_KEY` — from https://resend.com
   - `CONTACT_FROM_EMAIL` — a `Name <addr>` on a **Resend-verified domain**
   - `CONTACT_NOTIFY_TO` — where notifications go (your inbox)

2. **Start n8n:** `docker compose up -d n8n`

3. **Load the workflow** (`n8n/workflows/contact.json`). Either:
   - Import it in the UI (http://localhost:5678 → Workflows → Import from File), then toggle it **Active**, or
   - Import via CLI: `docker exec <container> n8n import:workflow --input=/workflows/contact.json` and activate it in the UI (activation needs the owner account set up first).

   The workflow reads `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and
   `CONTACT_NOTIFY_TO` from the container environment via `$env`, so no
   credential setup is needed inside n8n.

4. **Point the portfolio at the webhook.** In the portfolio's `.env`:
   ```
   N8N_CONTACT_WEBHOOK_URL=http://localhost:5678/webhook/contact
   ```
   (behind a proxy, use your n8n domain). Leaving it unset disables the
   automation — submissions still save to the DB.

### Notes

- The email nodes use `onError: continueRegularOutput`, so a Resend failure
  never blocks the other email or the workflow.
- The server action calls the webhook best-effort with a 5s timeout; if n8n is
  down the submission still succeeds and is stored.

## n8n — booking confirmation automation

When someone books a call, cal.com fires a `BOOKING_CREATED` webhook to n8n,
which emails the attendee their meeting link (and notifies you), via Resend.

```
cal.com booking ──▶ BOOKING_CREATED webhook ──▶ n8n /webhook/booking
                                                 ├── Resend: email attendee the meeting link
                                                 └── Resend: notify owner
```

Workflow: `n8n/workflows/booking.json`. A Code node normalizes the cal.com
payload and picks the meeting link in this order:
`metadata.videoCallUrl` → `videoCallData.url` → `location` (if a URL) →
`${CAL_WEBAPP_URL}/booking/{uid}` (fallback to the booking details page).

### Setup

1. Load `booking.json` into n8n and activate it (same as the contact workflow).
2. Register the webhook in **cal.com → Settings → Developer → Webhooks → New**:
   - Subscriber URL: `http://n8n:5678/webhook/booking` (Docker service name;
     use your n8n domain in prod)
   - Event: **Booking created**
3. Uses the same `RESEND_API_KEY` / `CONTACT_FROM_EMAIL` / `CONTACT_NOTIFY_TO`
   env, plus `CAL_WEBAPP_URL` for the fallback link.

For a real join link in the email, enable a video location on the event type
(Cal Video, Google Meet, etc.) so cal.com populates `videoCallUrl`.

## cal.com — self-hosted scheduling

Runs as `calcom` + a dedicated Postgres (`cal-db`). The portfolio embeds the
booking page on `/book` via `@calcom/embed-react`.

### Setup

1. **Secrets in `.env`:**
   - `NEXTAUTH_SECRET` — `openssl rand -base64 32`
   - `CALENDSO_ENCRYPTION_KEY` — `openssl rand -base64 24` (**never change** after first run — it encrypts stored calendar credentials)
   - `CAL_POSTGRES_PASSWORD` — Postgres password
   - `NEXT_PUBLIC_WEBAPP_URL` — public URL of the instance (e.g. `https://cal.yourdomain.com`)
   - `CAL_ALLOWED_HOSTNAMES` — origins allowed to embed (your portfolio host)
   - Optional `CAL_EMAIL_*` — SMTP so cal.com sends booking confirmations (Resend's SMTP bridge works)

2. **Start it:** `docker compose up -d cal-db calcom`
   First boot runs Prisma migrations automatically (give it a minute). The
   Postgres data is on the `cal_db` volume so it survives restarts.

3. **Create your account** at `NEXT_PUBLIC_WEBAPP_URL`, set up an event type
   (e.g. `30min`). Your booking link is `username/30min`.

4. **Wire the embed** in the portfolio's `.env`:
   ```
   NEXT_PUBLIC_CAL_LINK=username/30min
   NEXT_PUBLIC_CAL_ORIGIN=https://cal.yourdomain.com
   ```
   Rebuild/restart the portfolio. `/book` will show the live widget (styled with
   the site's aqua brand color); until then it shows a "scheduler offline"
   placeholder.

### Production

Put both n8n and cal.com behind your reverse proxy (Caddy/Traefik/Nginx) with
TLS, and set the public URLs (`N8N_WEBHOOK_URL`, `NEXT_PUBLIC_WEBAPP_URL`)
accordingly. cal.com must be served over HTTPS for calendar integrations and
embeds to work correctly.

## Umami — privacy-friendly analytics

Cookieless, self-hosted analytics (`umami` + its own Postgres `umami-db`). No
cookie-consent banner needed.

### Setup

1. Secrets in `.env`: `UMAMI_POSTGRES_PASSWORD`, `UMAMI_APP_SECRET` (`openssl rand -hex 32`).
2. `docker compose up -d umami-db umami` (first boot runs migrations).
3. Log in at http://localhost:3003 (default **admin / umami** — change the
   password immediately under Settings → Profile).
4. **Websites → Add**, enter the site name + domain. Copy the generated
   **website ID**.
5. Wire the tracker in the portfolio's `.env`:
   ```
   NEXT_PUBLIC_UMAMI_SRC=http://localhost:3003/script.js
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=<website id>
   ```
   Restart the portfolio. Leaving these unset loads no script at all.

### What's tracked

- **Pageviews** automatically (path, referrer, device, OS, browser, country).
- **Conversion events** via `data-umami-event` attributes already on the CTAs:
  `hero-projects`, `hero-contact`, `contact-book`, `contact-submit`.

In production, serve Umami over HTTPS behind your proxy and point
`NEXT_PUBLIC_UMAMI_SRC` at that host.

### Ports (local)

| Service   | URL                     |
| --------- | ----------------------- |
| portfolio | http://localhost:3000   |
| cal.com   | http://localhost:3002   |
| umami     | http://localhost:3003   |
| n8n       | http://localhost:5678   |
