"""Document CrowdHuman download (registration / research license required)."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "datasets" / "public" / "crowdhuman"

README = """# CrowdHuman

1. Register / accept terms at https://www.crowdhuman.org/
2. Download CrowdHuman_train.zip + annotation_train.odgt (and val).
3. Place archives in datasets/public/crowdhuman/raw/
4. Convert ODGT → YOLO person labels (converter TBD when license confirmed).

Do not redistribute the dataset inside this repo.
"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "raw").mkdir(exist_ok=True)
    (OUT / "README.md").write_text(README, encoding="utf-8")
    print(f"CrowdHuman stub ready at {OUT}")
    print("Manual download required — see README.md (research license).")


if __name__ == "__main__":
    main()
