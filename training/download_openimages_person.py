"""Open Images person subset helper (documents official paths; optional sample)."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "datasets" / "public" / "openimages_person"

README = """# Open Images — Person

Images: CC BY 2.0 (see Open Images terms).
https://storage.googleapis.com/openimages/web/download_v7.html

Recommended: use FiftyOne / official OID downloader filtered to label `Person`,
then convert boxes to YOLO under images/{train,val} + labels/{train,val}.

This stub does not auto-download tens of GB.
"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "README.md").write_text(README, encoding="utf-8")
    print(f"Open Images person stub at {OUT}")


if __name__ == "__main__":
    main()
