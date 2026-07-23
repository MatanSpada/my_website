# Test results

CAVE-008 validation passed on 2026-07-23:

- `npm ci` — passed
- `npm run build` — passed
- `npm test` — 10/10 passed
- `npm run test:e2e` — 8/8 Playwright Chromium scenarios passed. This includes the real exterior-to-hall journey and Linux/eBPF prompt, opening, room entry, three exhibits, return, and reset.
- `npm audit --json` — 0 vulnerabilities
- Playwright Chromium validation confirms the entry overlay, Pointer Lock loss/re-entry, no pre-entry movement, exterior spawn, closed/open main-door flow, corridor traversal, all five exact labels, Linux/eBPF room entry/return, non-interactive behavior for the other four doors, repeated reset, one loop/six listeners, and no page/console/external-request errors. The Linux/eBPF reset baseline is 141 meshes, 37 physics bodies, one game loop, six listeners, and zero active door animations. Headless frame summaries remain capped near 46–50 ms by SwiftShader automation; scene per-frame draw-call telemetry is 82 in the corridor and 56 in the hall after light scoping. Native Chrome review remains available at port 5175.
