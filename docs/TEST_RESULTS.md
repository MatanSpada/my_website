# Test results

CAVE-007 freeze validation passed on 2026-07-23:

- `npm ci` — passed
- `npm run build` — passed
- `npm test` — 10/10 passed
- Playwright Chromium: 7/7 scenarios passed, including entry gating, Pointer Lock recovery, exterior-to-hall journey, exact five-door registry, repeated open/reset cycles, and review-route lifecycle telemetry.
- `npm audit --json` — 0 vulnerabilities
- Playwright Chromium validation confirms the entry overlay, Pointer Lock loss/re-entry, no pre-entry movement, exterior spawn, closed/open main-door flow, corridor traversal, all five exact labels, CLOSED specialization-door registry, non-interactive Enter behavior, repeated reset, one loop/six listeners, and no page/console/external-request errors. Closed/reset world baseline is 124 meshes and 29 physics bodies; expected open-door release temporarily removes its closed seal/leaf bodies. Headless frame summaries remain capped near 46–50 ms by SwiftShader automation; scene per-frame draw-call telemetry is 82 in the corridor and 56 in the hall after light scoping. Native Chrome review remains available at port 5175.
