# CAVE-007 first playable freeze

The frozen journey is: exterior spawn, Pointer Lock entry, approach the main door, receive the proximity/facing prompt, press Enter, cross the opened threshold, traverse the corridor, inspect the specialization hall, and reset to the original exterior state.

Controls are deliberately minimal: click to enter, WASD/arrow keys to move, mouse to look, and Enter for the eligible main-door interaction. The locked movement values are speed `4.5`, acceleration `15`, deceleration `13`, FOV `1.07`, sensitivity `.002`, look response `18`, eye height `1.58`, head bob `.017 / 9.4 / 14`, and breathing `.007 / 1.35`.

The world zones are exterior, corridor, and specialization hall. `MainDoor` retains its centralized `CLOSED → OPENING → OPEN` state machine and closed seal/leaf collision transition. The five specialization registry entries remain CLOSED, collidable, and non-interactive: `RUNTIME THREAT DETECTION`, `LINUX KERNEL & eBPF`, `EMBEDDED & IoT SYSTEMS`, `OTA & DEVICE FLEETS`, and `SENSOR DATA PIPELINES`.

The entry overlay now explains the small control set and disappears immediately on Pointer Lock. Movement cannot begin before entry; lock loss clears input, stops the motor, restores the entry overlay, and supports a clean re-entry. Unsupported review values fail back to normal play; supported review diagnostics remain read-only.

Playwright Chromium completed 7/7 scenarios. Closed/reset baseline telemetry is 124 meshes, 29 physics bodies, one game loop, six listeners, and no active door animation; repeated open/reset cycles preserve those counts. Headless SwiftShader summaries remain about 46–50 ms, while the scoped-light scene reports 82 corridor and 56 hall per-frame draw calls. No page errors or external runtime requests occurred.

Final captures: `cave-007-entry.png`, `cave-007-exterior.png`, `cave-007-main-door.png`, `cave-007-corridor.png`, `cave-007-hall.png`, `cave-007-specialization-doors.png`, and `cave-007-reset.png`.

Known out-of-scope features: specialization-room content, sound, mobile support, backend services, and new gameplay systems. Next task: CAVE-008 — Design and Build the First Specialization Portfolio Room.
