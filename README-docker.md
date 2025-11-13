# Running only the Application (backend) in Docker

This document shows how to build and run just the backend application container while using an existing MySQL container on the `camp-net` network.

Prerequisites
- Docker and docker-compose installed
- An existing MySQL container reachable as `mysql` on Docker network `camp-net` (per your setup)
- `backend/.env` populated with DB variables (DB_HOST=mysql etc.)

Files created
- `backend/Dockerfile` - production Docker image for the Node app
- `backend/.dockerignore` - excludes local files from the image
- `docker-compose.app.yml` - compose file to run the app attached to external network `camp-net`

Build the image

```powershell
# From repository root
docker-compose -f docker-compose.app.yml build
```

Run the app (attached to existing camp-net network with MySQL accessible)

```powershell
# Start container in detached mode
docker-compose -f docker-compose.app.yml up -d

# Check logs
docker-compose -f docker-compose.app.yml logs -f
```

If the `camp-net` network is missing, create it before `up`:

```powershell
docker network create camp-net
```

Notes
- The compose file uses `env_file: ./backend/.env`. Ensure `backend/.env` contains DB credentials (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME).
- The container exposes port `5000` and runs `npm start` (server.js). Adjust the exposed port if your server listens on another port.
- If you prefer to run with local code changes during development, consider using a bind mount and `npm run dev`.
