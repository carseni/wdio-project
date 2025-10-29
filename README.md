# WDIO Project — API tests (Spec + BDD)

This repository contains WebdriverIO-based API tests for a RealWorld-style backend.
It includes both Mocha-style spec tests and Cucumber BDD features (step-definitions) that exercise authentication, articles, comments and tags.

The tests target the API at: `http://localhost:3001/api` (make sure your API is running locally before running the suite).

## What you'll find here

- `features/` — Cucumber feature files and step-definitions (BDD tests)
- `test/` — spec-style API tests
- `features/step-definitions/common` — shared test context and centralized steps
- `helpers/` — helper modules (auth helper, etc.)
- `wdio.conf.bdd.cjs` — WDIO config for BDD runs
- `wdio.conf.api.cjs` — WDIO config for API/spec runs
- `reports/` — Allure report output (generated)

## Prerequisites

- Node.js (>= 18 recommended)
- npm
- A running backend API on `http://localhost:3001`

## Install dependencies

```powershell
npm ci
# or
npm install
```

## Useful NPM scripts

These are defined in `package.json`:

- `npm run test:spec` — run spec-style API tests (`wdio.conf.api.cjs`)
- `npm run test:bdd` — run the Cucumber BDD suite (`wdio.conf.bdd.cjs`)
- `npm run test:all` — run both spec and BDD suites sequentially
- `npm run report:allure` — generate and open Allure report from `reports/allure-results`

Run the full BDD suite:

```powershell
npm run test:bdd
```

Run a single feature (very handy when debugging):

```powershell
npx wdio run ./wdio.conf.bdd.cjs --spec ./features/api/comments.feature --logLevel debug
```

## Allure reporting

After a run you can generate and open the Allure report:

```powershell
npm run report:allure
```

Allure reads results from `reports/allure-results` and generates `reports/allure-report`.

## Test architecture notes

- `features/step-definitions/common/context.js` exports a small shared test context and helpers (`setResponse`, `getResponse`, `setValue`, `getValue`) so step modules can share state reliably.
- `features/step-definitions/common/status.steps.js` centralizes HTTP status assertions.
- `features/step-definitions/common/auth.steps.js` provides a single `Given` for authenticated user flows (prevents ambiguous step definitions across modules).

## Recent fixes & rationale

During stabilization work the following issues were found and addressed:

- GET `/articles/:slug/comments` requires authentication to return comments. Tests now include the `Authorization` header when fetching comments.
- Article creation used by comment scenarios moved to per-scenario setup (`Before`) to ensure isolation and avoid leftover comments impacting subsequent scenarios.
- Centralized status assertion and shared `context.js` helper to avoid duplicated logic and brittle cross-file state.

These changes fixed a failing comments feature where a POST returned a comment but a later unauthenticated GET returned an empty list.

## Debugging tips

- Run a single feature with `--spec` and `--logLevel debug` to get detailed trace. Example:

```powershell
npx wdio run ./wdio.conf.bdd.cjs --spec ./features/api/comments.feature --logLevel debug
```

- `debug-comments.js` is a small helper script in the repo used during local debugging to reproduce the comment create/get flow outside WDIO:

```powershell
node debug-comments.js
```

Remove it if you don't want it in the repo.

## CI suggestions

- Use `npm ci` in CI for reproducible installs.
- Run `npm run test:all` in a CI job and publish the Allure results as an artifact.
- Consider limiting WDIO worker count in CI to reduce contention with the system under test.

## Contributing

- For test changes, create a branch and open a PR. Include a short description of the failure you fixed and why.
- Prefer small, focused commits for test and config changes.

## License

ISC (set in `package.json`).

---

If you want, I can commit this README update and push it to `main` (or create a branch + PR). I can also remove `debug-comments.js` in a follow-up commit if you'd like it cleaned up.
This allows all test suites to reuse the same authenticated session without re-login.
