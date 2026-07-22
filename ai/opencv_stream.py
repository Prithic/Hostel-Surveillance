"""Threaded OpenCV VideoStream implementation for non-blocking high-FPS capture."""

from __future__ import annotations

import sys
import threading
import time
import cv2

from ai.video_stream import Frame, VideoStream


class OpenCVVideoStream(VideoStream):
    """Read frames via ``cv2.VideoCapture`` in a background thread to prevent buffer blocking.

    Args:
        source: Webcam index (``0``), file path, or stream URL.
    """

    def __init__(self, source: str | int = 0) -> None:
        self._source = source
        self._cap: cv2.VideoCapture | None = None
        self._thread: threading.Thread | None = None
        self._running = False
        self._lock = threading.Lock()
        self._latest_frame: Frame | None = None
        self._is_live = False

    def open(self) -> None:
        if self._cap is not None and self._cap.isOpened():
            return
        
        src_int = None
        if isinstance(self._source, int):
            src_int = self._source
        elif isinstance(self._source, str) and self._source.isdigit():
            src_int = int(self._source)

        if src_int is not None and sys.platform == "win32":
            cap = cv2.VideoCapture(src_int, cv2.CAP_DSHOW)
            self._is_live = True
        elif src_int is not None:
            cap = cv2.VideoCapture(src_int)
            self._is_live = True
        else:
            cap = cv2.VideoCapture(self._source)
            self._is_live = False

        if not cap.isOpened():
            cap.release()
            raise RuntimeError(f"cannot open video source: {self._source!r}")

        self._cap = cap

        if self._is_live:
            # Configure MJPG format to optimize hardware capture throughput
            self._cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*"MJPG"))
            self._cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            self._cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

            # Start background thread to continually pull latest frame from buffer
            self._running = True
            self._thread = threading.Thread(target=self._capture_loop, daemon=True)
            self._thread.start()

            # ponytail: wait up to 2 seconds for initial frame acquisition so caller read() never returns None on startup
            start_wait = time.perf_counter()
            while time.perf_counter() - start_wait < 2.0:
                with self._lock:
                    if self._latest_frame is not None:
                        break
                time.sleep(0.01)

    def _capture_loop(self) -> None:
        while self._running and self._cap is not None and self._cap.isOpened():
            ret, frame = self._cap.read()
            if ret and frame is not None:
                with self._lock:
                    self._latest_frame = frame
            else:
                time.sleep(0.001)

    def read(self) -> Frame | None:
        if self._cap is None:
            raise RuntimeError("stream is not open")
        
        if self._is_live:
            with self._lock:
                return self._latest_frame.copy() if self._latest_frame is not None else None
        else:
            ok, frame = self._cap.read()
            return frame if ok else None

    def close(self) -> None:
        self._running = False
        if self._thread is not None:
            self._thread.join(timeout=1.0)
            self._thread = None

        if self._cap is not None:
            self._cap.release()
            self._cap = None
        self._latest_frame = None

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
