# Sales Management frontend

React with JavaScript/JSX, Vite, Material UI, Emotion, and locally bundled Roboto fonts.

## Local development

Use Node.js 20.19+ or 22.12+ (a compatible current LTS is recommended), npm, and Git.

```sh
cd frontend
npm ci
cp .env.example .env
npm run dev
```

Visit http://localhost:5173. The port is strict so a conflict is reported instead of silently choosing another port. `npm install` is also supported; commit the resulting package-lock.json whenever dependencies change. No credentials belong in `VITE_` variables: Vite embeds them in public browser code.

## Commands

- `npm run dev`: development server with hot module replacement (HMR).
- `npm run lint`: check JavaScript/JSX using Oxlint.
- `npm run build`: create production assets in `dist/`.
- `npm run preview`: inspect a local build; this is not the production server.

## Folder responsibilities

- `src/main.jsx`: React root, ThemeProvider, CssBaseline, local fonts.
- `src/app/App.jsx`: setup screen.
- `src/theme/theme.js`: shared palette, typography, component defaults, shape.
- `src/index.css`: minimal global CSS; prefer the theme and MUI sx.
- `src/components/`: future reusable UI components.
- `src/pages/`: future business pages.
- `src/services/`: future API client code.
- `src/hooks/`: future shared React hooks.
- `src/assets/`: future static imports.

The empty directories use .gitkeep; no business functionality is scaffolded.

## Stage 1 proxy

Vite forwards `/api` to `http://localhost:3000` only during development. Start the existing backend locally on port 3000 with its database configuration, then request `/api/projects` through port 5173. The Stage 1 setup commit does not fetch API data. The final Stage 2 page adds only a manual connection-test button; it sends no request until clicked. `VITE_API_BASE_URL=/api` documents the relative API base for future API clients.

## Verification

Open the setup screen; edit App.jsx to see HMR without refreshing. Change the primary color in theme.js to verify the shared theme, then restore it. Run lint and build. Generated `dist/`, node_modules/, and local .env files are ignored by Git. No router, authentication, state library, or business pages are included.

## Production integration (Stage 2)

Run `docker compose up -d --build --wait` from the repository root and visit http://localhost:8080. The Dockerfile lints the application source and builds using Node 22, then serves dist with Nginx. The final image contains no frontend Node server. Nginx proxies relative /api requests to backend:3000 while preserving the original path, and serves index.html for future frontend routes.

The final setup page includes components/ConnectivityCheck.jsx, a small manual GET /api/projects diagnostic. It reports loading, errors, status and a JSON response. It has no business-page behavior and sends no automatic requests.

The integrated stack intentionally does not publish backend port 3000. To use the Vite development proxy with Compose, follow the temporary loopback override in the root README. Remove that override for the production-style setup. Production browser code uses relative URLs; never use backend:3000 in browser code.
