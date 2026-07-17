# Production architecture

The portfolio runs on a single OVH VPS. Nginx is the public entry point for
the application subdomains, while Portainer manages the Git-backed Docker
Compose deployment. Each application owns its persistent data store.

```mermaid
flowchart TB
    users["Visitors"]
    edge["Namecheap DNS<br/>SSL proxy for main domain"]
    nginx["Nginx reverse proxy<br/>Let's Encrypt for service subdomains"]

    users --> edge --> nginx

    subgraph vps["OVH VPS"]
        direction LR

        subgraph portfolio["Portfolio"]
            direction TB
            web["Next.js 16<br/>Payload CMS"]
            sqlite[("SQLite")]
            media[("Media volume")]
            web --> sqlite
            web --> media
        end

        subgraph scheduling["Scheduling"]
            direction TB
            cal["Cal.com"]
            caldb[("PostgreSQL")]
            google["Google Calendar<br/>Google Meet"]
            cal --> caldb
            cal --> google
        end

        subgraph automation["Automation"]
            direction TB
            n8n["n8n"]
            n8ndata[("n8n volume")]
            resend["Resend"]
            n8n --> n8ndata
            n8n --> resend
        end

        subgraph analytics["Analytics"]
            direction TB
            umami["Umami"]
            umamidb[("PostgreSQL")]
            umami --> umamidb
        end

        subgraph operations["Operations"]
            direction TB
            github["GitHub repository"]
            portainer["Portainer"]
            docker["Docker Compose"]
            github --> portainer --> docker
        end
    end

    nginx --> web
    nginx --> cal
    nginx --> n8n
    nginx --> umami
    nginx --> portainer
```

## Event flows

- The portfolio sends contact submissions to n8n over the internal Docker
  network.
- Cal.com sends `BOOKING_CREATED` events to the public n8n webhook.
- Cal.com creates calendar events and Google Meet links through Google OAuth.
- Cal.com sends native booking emails through Resend SMTP.
- n8n sends workflow emails through the Resend API.
- Browser clients load Umami's tracking script and submit analytics events
  through the analytics subdomain.

## Public routes

| Host | Destination |
| --- | --- |
| `melhachimi.com` | Next.js and Payload CMS |
| `portainer.melhachimi.com` | Portainer on the Docker host |
| `automation.melhachimi.com` | n8n |
| `book.melhachimi.com` | Cal.com |
| `analytics.melhachimi.com` | Umami |
