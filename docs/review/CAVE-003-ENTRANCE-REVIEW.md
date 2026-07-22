# CAVE-003 entrance review

Normal play builds `CaveEntranceWorld`: a broad physical exterior floor, asymmetric static rock facade, dark cave depth, arch piers/lintel, local rock scatter, and fog. Spawn is `(0, .9, 9)`, facing the entrance and 14.2 m from the door.

`MainDoor` owns the only door state, `CLOSED`, its oak/iron visual pieces, and one static collision aggregate. It has no input, prompts, sound, or opening states; CAVE-004 can replace only that state/collider behavior.

Static world collision owns the ground, facade masses, rocks, arch, and closed door. The exterior deliberately retains the CAVE-002 flat physical plane so locked movement behavior is unchanged. Lighting combines cool hemispheric ambience with a low-range warm entrance guide; exponential fog preserves readable near stone while giving the opening depth.

Chrome review captured `cave-003-spawn.png`, `cave-003-approach.png`, `cave-003-main-door.png`, `cave-003-door-collision.png`, and `cave-003-wide-entrance.png`. Known limitations: procedural materials and simple rocks are placeholders for CAVE-006 polish; no interior exists yet.
