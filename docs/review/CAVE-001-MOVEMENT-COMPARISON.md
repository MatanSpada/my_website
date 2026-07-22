# CAVE-001 movement comparison

| Profile | Character | Result |
| --- | --- | --- |
| grounded | 4.2 max speed; 10 acceleration; gradual 7 deceleration; restrained 0.0018 mouse sensitivity with 12 look response; 1.05 FOV; 0.022/8.5 bob | Heavier default with readable physical weight |
| responsive | 5.7 max speed; 32 acceleration; sharp 34 deceleration; 0.0026 mouse sensitivity with 48 look response; 1.13 FOV; minimal 0.012/12 bob | Precise, fast, immediate comparison profile |
| cinematic | 3.2 max speed; 5 acceleration; smooth 4 deceleration; 0.00135 mouse sensitivity with 4 look response; 0.94 FOV; soft 0.045/7 bob | Deliberate, atmospheric, visibly smoothed profile |
| locked | 4.5 max speed; 15 acceleration; controlled 13 deceleration; precise 0.002 mouse sensitivity with 18 look response; 1.07 FOV; restrained 0.017/9.4 bob | CAVE-002 selected default: grounded physicality with enough initial response for direct desktop control |

The prior mouse look used negative pointer deltas for both yaw and pitch, reversing this rig's positive-right yaw and positive-down pitch convention. The correction applies positive pointer deltas once at the input boundary; the player movement basis remains unchanged. CAVE-002 selected `locked` as the normal default; the original profiles remain available for direct comparison.
