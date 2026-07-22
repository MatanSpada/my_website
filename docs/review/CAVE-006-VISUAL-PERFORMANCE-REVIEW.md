# CAVE-006 visual and performance review

The exterior now layers asymmetric mountain masses with irregular low-poly rock scatter, restrained moss/grass accents, a cooler overcast fill, and a narrow warm entrance guide. The main door remains the focal silhouette; its state machine, collision envelope, and route placement are unchanged.

The corridor retains its proven flat collision shell while presentation is built from visual-only offset rock shelves, ceiling variation, edge ridges, and three scoped guidance pools. The specialization hall adds buttresses, a central dais, varied rock silhouettes, framed oak leaves, iron reinforcement, and inset bronze-backed DynamicTexture plaques. Labels remain exactly `RUNTIME THREAT DETECTION`, `LINUX KERNEL & eBPF`, `EMBEDDED & IoT SYSTEMS`, `OTA & DEVICE FLEETS`, and `SENSOR DATA PIPELINES`; all five doors remain CLOSED, collidable, and non-interactive.

Performance profiling used Playwright Chromium with SwiftShader. Before scoping local lights, the engine counter sampled about 5,040 cumulative draw calls in the full journey; after each local light is restricted to its intended corridor/hall mesh set, per-frame telemetry measured 82 draw calls in the corridor and 56 in the hall. Headless frame summaries remained approximately 46–50 ms, consistent with the prior automation-bound measurements rather than a growing scene leak. All review zones reported 124 meshes, 29 bodies, one game loop, and six listeners; reset preserves those counts. The main-door hidden seal mesh is now disposed on reset/release, closing the observed lifecycle leak.

Representative real-route captures: `cave-006-exterior.png`, `cave-006-entrance.png`, `cave-006-corridor.png`, `cave-006-hall-entry.png`, `cave-006-specialization-hall.png`, `cave-006-door-detail.png`, and `cave-006-wide-hall.png`.

Known limitation: the procedural materials and headless-WebGL lighting are intentionally restrained; authored texture production, native-GPU profiling, and any new game content are outside this milestone. CAVE-007 is the next task.
