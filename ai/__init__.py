"""GuardianAI vision pipeline package.

Public contracts for the MVP foundation. Implementations (YOLO, ByteTrack,
polygon checks, rule evaluation) land in later phases — not here.

Pipeline (intended):

    VideoStream → Detector → Tracker → ZoneManager → RuleEngine → alerts
"""

from ai.config import AIConfig
from ai.detector import Detection, Detector
from ai.rules import Incident, Rule, RuleEngine
from ai.tracker import Track, Tracker
from ai.video_stream import Frame, VideoStream
from ai.zone import Point, Zone, ZoneManager

__all__ = [
    "AIConfig",
    "Detection",
    "Detector",
    "Frame",
    "Incident",
    "Point",
    "Rule",
    "RuleEngine",
    "Track",
    "Tracker",
    "VideoStream",
    "Zone",
    "ZoneManager",
]

__version__ = "0.1.0"
