# Test results

CAVE-006 validation passed on 2026-07-23:

- `npm ci` — passed
- `npm run build` — passed
- `npm test` — 10/10 passed
- Playwright Chromium: 5/5 scenarios passed, including the exterior-to-open-door-to-hall journey and a review-route lifecycle/performance check.
- `npm audit --json` — 0 vulnerabilities
- Playwright Chromium validation confirms exterior spawn, closed/open main-door flow, corridor traversal, all five exact labels, CLOSED specialization-door registry, non-interactive Enter behavior, reset, one loop/six listeners, and no page/console/external-request errors. Headless frame summaries remain capped near 46–50 ms by SwiftShader automation; scene per-frame draw-call telemetry is 82 in the corridor and 56 in the hall after light scoping. Native Chrome review remains available at port 5175.
