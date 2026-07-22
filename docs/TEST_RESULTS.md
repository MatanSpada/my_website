# Test results

CAVE-005 validation passed on 2026-07-23:

- `npm ci` — passed
- `npm run build` — passed
- `npm test` — 10/10 passed
- focused exterior-to-door Playwright route — passed after extending the deterministic door-animation wait for constrained headless frames
- `npm audit --json` — 0 vulnerabilities
- Chrome Playwright validation confirms exterior spawn, closed/open main-door flow, corridor traversal, reset, one loop/six listeners, and no page/console/external-request errors. Hall labels and containment remain CAVE-006 polish/follow-up items.
