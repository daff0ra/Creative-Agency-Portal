# Creative Agency Portal client

## Local development

From this directory, run `npm install` once and then `npm run dev`. In development, the client uses `http://localhost:5000` by default. `client/.env.local` may set `VITE_API_URL=http://localhost:5000` explicitly; restart Vite after changing it.

## Production build

The production default API is `https://creative-agency-portal.onrender.com`. To use another API, set `VITE_API_URL` in the frontend host's build environment before running `npm run build`. Vite embeds this value into the generated static files, so changing it requires a new build/deploy.

The API must allow the frontend's exact origin through its `CLIENT_ORIGINS` environment variable and keep credentials enabled for CORS. Set it to a comma-separated list, for example `https://app.karsa.space,http://localhost:5173`, to allow both the deployed app and local development. Refresh-token cookies require HTTPS in production. Configure the frontend host to serve `index.html` for unknown paths so React Router routes work after a refresh.

Run `npm run build` to produce the deployable static site in `dist/`.

For the complete local backend/database setup and common 404/connection checks, see the root `README.md`.
