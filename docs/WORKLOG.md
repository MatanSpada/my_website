# Worklog

- 2026-07-22 23:16:44 IDT — Started CAVE-003 exterior refinement: hardening the closed-door collision envelope, reshaping the facade toward a mountainside, and improving outdoor readability without starting CAVE-004.
- 2026-07-22 22:56:57 IDT — Started CAVE-003: inspecting the locked controller and replacing the normal scene with a playable cave-entrance exterior while preserving the chamber as review-only.
- 2026-07-22 23:05:00 IDT — Completed CAVE-003: added local procedural exterior geometry, static facade/door collision, CLOSED door state, atmosphere, review diagnostics, and entrance browser coverage; no CAVE-004 interaction started.
- 2026-07-22 22:33:35 IDT — Started CAVE-002 game-feel lock: inspecting the inherited movement foundation, comparison profiles, Chrome behavior, telemetry, and validation coverage before tuning.
- 2026-07-22 22:42:27 IDT — Locked CAVE-002 after three Chrome/telemetry tuning passes. Added the `locked` default, explicit physical capsule endpoints to prevent camera-height settling, and expanded unit/Playwright coverage for selection, controlled acceleration/stopping, physical grounding, effects, collision, passage, reset, and listener/loop stability.
- Bootstrapped Vite, strict TypeScript, Babylon.js, Havok, Vitest, and Playwright.
- Added a physical capsule and static test-chamber collider bodies.
- Added review telemetry and three tunable movement profiles.
- Corrected inverted pointer-delta signs at the mouse-look input boundary; positive horizontal deltas now turn right and positive vertical deltas look down, matching the Babylon camera rig.
- Added typed profile-specific look and head-bob response rates so responsive camera movement is immediate, grounded is restrained, and cinematic is deliberately smoothed.
- Added unit and Playwright coverage for four-direction mouse look, pitch clamping, profile URL selection, invalid-profile fallback, and measurable profile telemetry.
