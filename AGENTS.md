# AGENTS.md

Язык общения: Русский, комментарии в коде на русском языке.

## Stack (verified)

- **Vue 3** + **Vite 5** (build tool, dev server on port 8080)
- **Vuetify 4** (MD3, `vuetify/locale/ru`, `vuetify/blueprints`), **not** Vuetify 2
- **Dual state**: Vuex 4 (`src/store/`) + Pinia (`src/shared/stores/`, `src/entities/*/`)
- **Vuelidate 2**, Day.js (ru locale), Axios, Socket.io-client, docxtemplater + pizzip
- **Sass** for styles
- **No test framework** — no test scripts, no test runner configured

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server (vite, hot-reload, port 8080) |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | ESLint on `src/` (`.js,.vue`) |
| `npm run preview` | Vite preview of built `dist/` |

No typecheck, no codegen, no migration scripts.

## Architecture

Hybrid of **old modules/** (being phased out) and **FSD-ish** structure:

```
src/
  shared/       — ui/, services/, stores/, hooks/, utils/, constants/
  entities/     — 21 domain entities (order, driver, truck, carrier, …)
  features/     — order, docsRegistry, paymentInvoice, worker
  widgets/      — 5 widgets (docsRegistry, transportWaybillsInOrder, …)
  pages/        — page components per domain
  modules/      — legacy: auth/, order/, accounting/, profile/, common/
  store/        — Vuex root (Auth, Profile, Order, Accounting modules)
  api/          — Axios instance with token refresh interceptor
  socket.js     — Socket.io client (autoConnect: false)
```

Entry: `src/main.js` — mounts `createApp` with router, Vuex, Vuetify, Pinia.

Path alias: `@` → `src/`.

## Dual state management

New code should prefer **Pinia** stores (`defineStore`).
Legacy code uses **Vuex**. Both coexist — `src/store/index.js` exports Vuex, Pinia stores live in `entities/*/` or `shared/stores/`.
Example: `App.vue` reads Vuex for `appLoading`, also calls `useAppStore()` (Pinia).

## Dev proxy (vite.config.js)

| Prefix | Target | Purpose |
|--------|--------|---------|
| `/api` | `localhost:3040` | API requests |
| `/socket.io` | `localhost:3040` (ws: true) | WebSocket |
| `/templates` | `localhost:3040` | Docx templates |
| `/static` | `localhost:3040` | Static files |

## Environment

`.env` has both legacy `VUE_APP_*` and current `VITE_*` vars — all point to `localhost:3040`.
Production Docker builds inject prod URLs at build time.

## Docker / Deploy

- `Dockerfile` — production (s4log.ru), built on PR merge to `main`
- `Dockerfile.alfa` — staging (carrier.logicore.ru), built on PR merge to `alfa`
- CI: GitHub Actions, self-hosted runner, Docker Hub push

## Code style (ESLint + Prettier)

- `no-console` / `no-debugger` — allowed (`off`)
- `no-unused-vars` — error, but `_` prefix ignored
- No semicolons, single quotes, trailing commas (es5)
- Vue: `vue/html-self-closing` (always), `vue/require-default-prop: off`, `vue/valid-v-slot: off`
- Prettier: `printWidth: 100`, `tabWidth: 2`, `vueIndentScriptAndStyle: false`

## Git commits

Conventional commits: `feat(scope):`, `refactor(scope):`, `fix(scope):`.
Never add `Co-Authored-By` trailers.

## Migration state

Project migrated from Vue 2 + Vue CLI to Vue 3 + Vite + Vuetify 4.
`CLAUDE.md` is **outdated** (still documents the old Vue 2 / Vue CLI setup).
Not all pages/components migrated yet — check `migration.todo` for current status.
