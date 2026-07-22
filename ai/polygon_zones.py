"""Polygon zone manager (OpenCV point-in-polygon)."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Sequence

import cv2
import numpy as np

from ai.zone import Point, Zone, ZoneManager


def _poly_np(zone: Zone) -> np.ndarray:
    return np.array([[p.x, p.y] for p in zone.polygon], dtype=np.float32)


class PolygonZoneManager(ZoneManager):
    """In-memory zones with optional JSON load/save."""

    def __init__(self, zones: Sequence[Zone] | None = None) -> None:
        self._zones: dict[str, Zone] = {z.zone_id: z for z in (zones or ())}

    @classmethod
    def from_json(cls, path: str | Path) -> PolygonZoneManager:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
        zones: list[Zone] = []
        for item in data.get("zones", []):
            poly = tuple(Point(float(x), float(y)) for x, y in item["polygon"])
            zones.append(
                Zone(
                    zone_id=str(item["zone_id"]),
                    name=str(item.get("name", item["zone_id"])),
                    polygon=poly,
                    restricted=bool(item.get("restricted", True)),
                )
            )
        return cls(zones)

    def zones(self) -> Sequence[Zone]:
        return tuple(self._zones.values())

    def contains(self, point: Point, zone_id: str) -> bool:
        zone = self._zones.get(zone_id)
        if zone is None:
            return False
        # cv2: +1 inside, 0 edge, -1 outside
        return cv2.pointPolygonTest(_poly_np(zone), (point.x, point.y), False) >= 0

    def zones_containing(self, point: Point) -> Sequence[Zone]:
        return tuple(z for z in self._zones.values() if self.contains(point, z.zone_id))


if __name__ == "__main__":
    z = Zone("a", "A", (Point(0, 0), Point(10, 0), Point(10, 10), Point(0, 10)))
    m = PolygonZoneManager([z])
    assert m.contains(Point(5, 5), "a")
    assert not m.contains(Point(50, 50), "a")
    print("polygon_zones: ok")
