# Architecture

`MainDoor` owns the sole door state machine (`CLOSED`, `OPENING`, `OPEN`), visual hinge transform, animation clock, and closed collision aggregates. `CaveGame` only evaluates pointer-lock proximity/facing eligibility and requests one interaction; it owns the prompt and reset. The player controller remains unchanged.

`CaveInterior` owns corridor, hall, lighting, and specialization-door registry. Its five doors are static CLOSED colliders with future connection anchors; they deliberately do not reuse MainDoor interaction.
