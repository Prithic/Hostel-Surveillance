# GO_NO_GO_DECISION.md

## Decision: **CONDITIONAL GO**

Would you confidently demonstrate this live without worrying about failure?

### Answer: **YES — with the checklist, not with blind hope.**

### Why YES

1. Critical foot-guns fixed: default camera `0`, model path resolution, live pipeline no longer dies on transient `None`, zone entry is edge-triggered, README matches privacy story, dashboard has MJPEG, CORS tightened, chat does not invent incidents.  
2. Core story is demonstrable offline from dashboard: detect → track → zone → incident → API → UI → chatbot.  
3. Backup path `python -m ai.demo_mvp` still proves AI if web stack hiccups.

### Why not unconditional

1. CPU FPS may look weak.  
2. Loitering still missing; night rule needs clock narrative.  
3. Other frontend pages still contradict privacy (avoid them).  
4. No auth; single-camera process.

### Required for GO on stage

Follow `DEMO_CHECKLIST.md` exactly. Rehearse once on the competition machine.
