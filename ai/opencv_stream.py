"""OpenCV-backed :class:`~ai.video_stream.VideoStream` for webcam / file / RTSP later."""

from __future__ import annotations

import sys

import cv2

from ai.video_stream import Frame, VideoStream


class OpenCVVideoStream(VideoStream):
    """Read frames via ``cv2.VideoCapture``.

    Args:
        source: Webcam index (``0``), file path, or stream URL.
    """

    def __init__(self, source: str | int = 0) -> None:
        self._source = source
        self._cap: cv2.VideoCapture | None = None

    def open(self) -> None:
        if self._cap is not None and self._cap.isOpened():
            return
        # ponytail: CAP_DSHOW avoids flaky default MSMF opens on Windows webcams
        if isinstance(self._source, int) and sys.platform == "win32":
            cap = cv2.VideoCapture(self._source, cv2.CAP_DSHOW)
        else:
            cap = cv2.VideoCapture(self._source)
        if not cap.isOpened():
            cap.release()
            raise RuntimeError(f"cannot open video source: {self._source!r}")
        self._cap = cap

    def read(self) -> Frame | None:
        if self._cap is None:
            raise RuntimeError("stream is not open")
        ok, frame = self._cap.read()
        if not ok:
            return None
        return frame

    def close(self) -> None:
        if self._cap is not None:
            self._cap.release()
            self._cap = None

    @property
    def fps(self) -> float | None:
        if self._cap is None:
            return None
        value = float(self._cap.get(cv2.CAP_PROP_FPS))
        return value if value > 0 else None

    @property
    def frame_size(self) -> tuple[int, int] | None:
        if self._cap is None:
            return None
        w = int(self._cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(self._cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        if w <= 0 or h <= 0:
            return None
        return (w, h)
