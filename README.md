# Portfolio

A full stack engineer portfolio built with **Next.js 16**, **Tailwind CSS v4**, and **Payload CMS 3** (embedded in the Next.js App Router). Content is managed through the Payload admin and stored in **SQLite**.

## Stack

- Next.js 16 (App Router) with Payload 3 mounted at `/admin` (admin UI) and `/api`
- Tailwind CSS v4 (dark-first theme)
- SQLite via `@payloadcms/db-sqlite`
- TypeScript

## Content model

**Collections**

- `Projects` - portfolio pieces (summary, rich-text description, featured image, gallery, tech stack, repo/live URLs, `featured` flag, manual order). Draft/publish enabled.
- `Posts` - blog posts (excerpt, cover image, rich-text content, tags). Draft/publish enabled.
- `Media` - uploads with `thumbnail` / `card` / `og` image sizes.
- `Users` - admin login.
- `ContactMessages` - contact-form submissions (created server-side only; readable in the admin under "Inbox").

**Globals**

- `About / Bio` - name, headline, avatar, bio, skills, work history, social links, resume.
- `Site Settings` - site name, tagline, contact email, default OG image.

## Public pages

`/` (home) · `/projects` + `/projects/[slug]` · `/about` · `/blog` + `/blog/[slug]` · `/contact`

## Local development

```bash
cp .env.example .env      # then set PAYLOAD_SECRET (openssl rand -hex 32)
pnpm install
pnpm dev                  # http://localhost:3000
```

Open `http://localhost:3000/admin` and follow the prompt to create your first admin user.

### Seed demo content (optional)

```bash
pnpm seed
```

Populates the About/Site Settings globals and a few sample projects and posts. Safe to re-run (idempotent).

### Useful scripts

- `pnpm dev` - start the dev server
- `pnpm build` / `pnpm start` - production build and serve
- `pnpm generate:types` - regenerate `src/payload-types.ts` after editing collections/globals
- `pnpm seed` - load demo content

## Self-hosting

The app builds to a standalone Next.js server (`output: 'standalone'`). Because SQLite is a single file and media are stored on disk, both must live on a persistent volume.

### Docker

```bash
# Ensure PAYLOAD_SECRET and NEXT_PUBLIC_SERVER_URL are set (e.g. in a .env file)
docker compose up --build -d
```

`docker-compose.yml` builds the image and mounts named volumes:

- `db` at `/data` - holds `portfolio.db` (`DATABASE_URL=file:/data/portfolio.db`)
- `media` at `/app/media` - holds uploaded files

Put the container behind a reverse proxy (Caddy/Nginx/Traefik) for TLS, and set `NEXT_PUBLIC_SERVER_URL` to the public URL.

### Environment variables

| Variable                 | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `DATABASE_URL`           | SQLite connection string, e.g. `file:./portfolio.db` |
| `PAYLOAD_SECRET`         | Secret for signing Payload tokens                  |
| `NEXT_PUBLIC_SERVER_URL` | Public base URL (absolute OG/canonical URLs)       |

## Notes

- `synchronize`/auto schema push is used in dev. For production, review Payload's [migrations](https://payloadcms.com/docs/database/migrations) before deploying schema changes.
- Uploaded media are stored on the local filesystem; back up the `media` directory (or volume) along with the database file.
- The seed (`src/seed/index.ts`) ships placeholder demo content only. Real content lives in the database (gitignored) and is managed via the admin.

## License

[MIT](LICENSE). You're welcome to reuse the code.
