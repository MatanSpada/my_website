# Architecture

`MainDoor` owns the sole door state machine (`CLOSED`, `OPENING`, `OPEN`), visual hinge transform, animation clock, and closed collision aggregates. `CaveGame` only evaluates pointer-lock proximity/facing eligibility and requests one interaction; it owns the prompt and reset. The player controller remains unchanged.

`CaveInterior` owns corridor, hall, scoped local lighting, and the specialization-door registry. Its five doors are static CLOSED colliders with future connection anchors; they deliberately do not reuse MainDoor interaction. Structural collision remains a small set of flat static boxes; irregular rocks, frames, ridges, and plaques are visual-only so presentation work cannot degrade the locked route.

`CaveGame` exposes read-only review zones (`cave-entrance`, `cave-interior`, and `specialization-hall`) and reports zone, door registry, render metrics, physics-body count, one-loop state, and listener count. `MainDoor` disposes the hidden CLOSED seal mesh as well as its aggregate during release/reset, preventing reset-time mesh growth.
