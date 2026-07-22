# Architecture

`MainDoor` owns the sole door state machine (`CLOSED`, `OPENING`, `OPEN`), visual hinge transform, animation clock, and closed collision aggregates. `CaveGame` only evaluates pointer-lock proximity/facing eligibility and requests one interaction; it owns the prompt and reset. The player controller remains unchanged.
