"""Run HackSprint final jury viva from FINAL_JURY_VIVA.md."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
text = (ROOT / "FINAL_JURY_VIVA.md").read_text(encoding="utf-8")

pat = re.compile(
    r"\*\*Q(\d+)\.(?:\s*\([^)]+\))?\*\* (.+?)\n\*\*A:\*\* (.+?)\n\*\*Grade: ([ABCF][^\n]*)\*\*",
    re.S,
)
qs = [(int(n), q.strip(), a.strip(), g.strip()) for n, q, a, g in pat.findall(text)]

def out(s: str) -> None:
    print(s.encode("ascii", "replace").decode("ascii"))


out("=" * 72)
out(" HACKSPRINT FINAL JURY - LIVE SESSION")
out(" Evidence: feat/real-product (frozen)")
out("=" * 72)
out(f" Loaded {len(qs)} graded questions\n")

blocks = [
    (1, 20, "AI RESEARCHER"),
    (21, 40, "PRODUCT MANAGER"),
    (41, 60, "STARTUP FOUNDER"),
    (61, 80, "SECURITY EXPERT"),
    (81, 100, "HOSTEL WARDEN"),
    (101, 120, "CROSS-FIRE"),
]

grades: dict[str, int] = {"A": 0, "B": 0, "C": 0, "F": 0}
for _, _, _, g in qs:
    grades[g[0]] = grades.get(g[0], 0) + 1

for lo, hi, name in blocks:
    out("-" * 72)
    out(f" JUDGE: {name}")
    out("-" * 72)
    for n, q, a, g in qs:
        if lo <= n <= hi:
            short = a if len(a) <= 200 else a[:200] + "..."
            out(f"\nQ{n}. {q}")
            out(f"   YOU: {short}")
            out(f"   GRADE: {g}")
    out("")

out("=" * 72)
out(" GRADE DISTRIBUTION")
out("=" * 72)
for k in "ABCF":
    out(f"  {k}: {grades.get(k, 0)}")

out("")
out(" SCORECARD")
out("  Presentation     8.4/10")
out("  Technical        8.6/10")
out("  Innovation       7.8/10")
out("  Business         6.5/10")
out("  Judge Confidence 8.2/10")
out("  Win probability  35-45%")
out("")
out(" LOSE IF: overclaim / empty CCTV / ERP digression")
out(" WIN IF:  privacy-first triage, live gate + SOS, honesty")
out(" RECOMMENDATION: Security first. Tell the truth. Stop before you invent.")
out("=" * 72)
if len(qs) < 100:
    raise SystemExit(f"expected >=100 questions, got {len(qs)}")
out(f"VIVA COMPLETE - {len(qs)} questions graded.")
