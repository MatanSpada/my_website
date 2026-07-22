# CAVE-002 game-feel lock

## Selection

`locked` is the normal URL default. Review URLs remain available at `/?review=movement&profile=grounded`, `responsive`, `cinematic`, and `locked`; missing or invalid profile values safely select `locked`.

| Value | Locked value | Reason |
| --- | ---: | --- |
| max speed | 4.5 | A moderate walking pace: above grounded's 4.2 without responsive's rush. |
| acceleration / deceleration | 15 / 13 | Starts noticeably sooner than grounded (10 / 7), then stops predictably without responsive's abrupt 32 / 34 arcade snap. |
| FOV | 1.07 | Slightly broader than grounded 1.05, retaining a stable human-scale view. |
| mouse sensitivity / response | .002 / 18 | Precise direct aiming with restrained smoothing; removes the grounded profile's visible turn lag without responsive's 48-rate immediacy. |
| eye height | 1.58 | Preserves a standing human viewpoint above the physical capsule. |
| bob amplitude / frequency / response | .017 / 9.4 / 14 | Subtle speed-derived gait signal, below grounded's .022, and returns cleanly when motion is blocked. |
| breathing amplitude / frequency | .007 / 1.35 | Present at idle but intentionally almost imperceptible. |

## Tuning passes

Every pass used the same Chrome scenarios: idle, forward start/release, backward, lateral, normalized diagonal, fast 90-degree turn, slow tracking, wall impact/travel, narrow passage, repeat stop/start, and reset.

1. Grounded baseline (4.2 / 10 / 7) established the desired weight but exposed delayed starts and long stops. The browser comparison also revealed that the inferred Havok capsule shape could settle the camera from y=.9 toward y=.32 near collision.
2. A faster candidate (4.7 / 18 / 16, .0022 / 24 look) established the upper useful bound: direct, but too close to responsive during stop/start and fast tracking.
3. The selected `locked` values (4.5 / 15 / 13, .002 / 18 look) preserve grounded body weight while providing a quicker first response and controlled, non-drifting stop. Bob and breathing were reduced to .017 and .007 respectively.

The capsule is explicitly defined with local endpoints -.58 and +.58 and radius .32. It spawns/resets at y=.9, its intended center for the flat-floor chamber. The controller sets the unused vertical velocity to zero each frame, so gravity cannot introduce a vertical settle into a deliberately planar prototype. The camera follows that physical body at its 1.58 m eye offset; bob and breathing are camera-only effects.

## Telemetry comparison

At the common short forward sample, responsive reaches the greatest planar speed, locked is deliberately intermediate, and grounded remains slower; after release, responsive stops first, locked follows, and grounded carries longest. This exact ordering is asserted in Playwright. FOV order is responsive (1.13), locked (1.07), grounded (1.05), cinematic (.94). The locked profile retains one game loop, six input/canvas listeners, nine physics bodies, a stable reset, and no browser errors.

## Known limitations

This remains the intentionally minimal CAVE-001/CAVE-002 chamber: no cave, exterior, door, sound, mobile controls, analytics, or backend has been started. The flat chamber explicitly constrains vertical motion and treats the player as grounded; this should be replaced with contact-based grounding before any uneven terrain is introduced.
