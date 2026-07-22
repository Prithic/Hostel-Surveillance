"""Restricted-zone geometry contracts.

Zones are polygons in image pixel space. Rules ask the zone manager whether a
point (typically a track's bbox center) lies inside a restricted region.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Sequence


@dataclass(frozen=True)
class Point:
    """2D point in pixel coordinates (origin top-left)."""

    x: float
    y: float


@dataclass(frozen=True)
class Zone:
    """A named polygonal region of interest.

    Attributes:
        zone_id: Stable identifier used in incidents / config.
        name: Human-readable label for explainable alerts.
        polygon: Vertices in order (clockwise or counter-clockwise).
            At least three points are required for a valid zone.
        restricted: If True, entry may trigger a restricted-zone incident.
    """

    zone_id: str
    name: str
    polygon: tuple[Point, ...]
    restricted: bool = True

    def __post_init__(self) -> None:
        if len(self.polygon) < 3:
            raise ValueError(f"zone {self.zone_id!r} needs >= 3 vertices")


class ZoneManager(ABC):
    """Load and query restricted polygons.

    Concrete implementations will load from JSON/YAML and run point-in-polygon
    tests (e.g. via OpenCV or shapely).
    """

    @abstractmethod
    def zones(self) -> Sequence[Zone]:
        """Return all registered zones."""

    @abstractmethod
    def contains(self, point: Point, zone_id: str) -> bool:
        """Return True if ``point`` lies inside the zone ``zone_id``."""

    @abstractmethod
    def zones_containing(self, point: Point) -> Sequence[Zone]:
        """Return every zone that contains ``point`` (may be empty)."""
