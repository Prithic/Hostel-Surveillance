"""MOT17 / MOT20 download stubs (academic license — manual accept)."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _stub(name: str, url: str) -> None:
    out = ROOT / "datasets" / "public" / name
    out.mkdir(parents=True, exist_ok=True)
    (out / "raw").mkdir(exist_ok=True)
    (out / "README.md").write_text(
        f"# {name}\n\nAcademic dataset. Download from:\n{url}\n\n"
        "Place sequences under raw/. Convert pedestrian boxes to YOLO if used for detection fine-tune;\n"
        "prefer MOT for tracking evaluation metrics.\n",
        encoding="utf-8",
    )
    print(f"{name} stub → {out}")


def main() -> None:
    _stub("mot17", "https://motchallenge.net/data/MOT17/")
    _stub("mot20", "https://motchallenge.net/data/MOT20/")


if __name__ == "__main__":
    main()
