# Test results

CAVE-002 delivery validation passed on 2026-07-22:

- `npm ci` — passed
- `npm run build` — passed
- `npm test` — 10/10 passed
- `npm run test:e2e` — 3/3 passed
- `npm audit --json` — 0 vulnerabilities
- Chrome/Playwright review confirms the locked default; forward/backward/lateral/normalized diagonal movement; controlled stop; correct mouse direction and pitch clamp; wall collision and travel; narrow passage; idle breathing; movement-only bob; stable 0.9 m physical center with a 1.58 m camera height and reset; one loop/six listeners; comparison URLs; invalid fallback; no page errors — passed.
