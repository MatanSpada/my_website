# Test results

Delivery validation passed on 2026-07-22:

- `npm ci` — passed
- `npm run build` — passed
- `npm test` — 9/9 passed
- `npm run test:e2e` — 2/2 passed
- `npm audit --json` — 0 vulnerabilities
- Chrome/Playwright review confirms correct right, left, up, and down mouse look; pitch clamping; camera-relative movement; profile URL selection; invalid-profile fallback; distinct acceleration, stopping, FOV, camera response, and head-bob telemetry; collision, reset, breathing, and head bob — passed
