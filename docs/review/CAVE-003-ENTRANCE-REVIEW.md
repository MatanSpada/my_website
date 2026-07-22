# CAVE-003 entrance review

Normal play builds `CaveEntranceWorld`: a broad physical exterior floor, asymmetric static rock facade, dark cave depth, arch piers/lintel, local rock scatter, and fog. Spawn is `(0, .9, 9)`, facing the entrance and 14.2 m from the door.

The original leaf-only collider left practical side/jamb bypass opportunities. `MainDoor` now owns `CLOSED`, its oak/iron visual pieces, the leaf collision, and one wider invisible CLOSED-state seal aligned to the jambs. This completely blocks front, back, edge slipping, and the adjacent opening; CAVE-004 can replace that single seal when it implements animation.

Static world collision owns the ground, layered mountainside masses, facade, rocks, arch, and closed door. The exterior deliberately retains the CAVE-002 flat physical plane so locked movement behavior is unchanged. New high rock masses reshape the flat wall into a hillside silhouette, sparse grass/moss tufts add restrained green detail, and brighter cool ambient plus warm entrance light improve readability.

Chrome review captured `cave-003-spawn.png`, `cave-003-approach.png`, `cave-003-main-door.png`, `cave-003-door-collision.png`, and `cave-003-wide-entrance.png`. Known limitations: procedural materials and simple rocks are placeholders for CAVE-006 polish; no interior exists yet.
