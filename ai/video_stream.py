"""Video source contracts.

Supports webcam indices, local files (MP4), and later RTSP URLs via the same
:class:`VideoStream` interface. Callers iterate frames; they do not own OpenCV
details.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from types import TracebackType
from typing import Any, Iterator, TypeAlias

# Opaque BGR image buffer. Concrete streams use numpy.ndarray (OpenCV Mat).
# Kept as Any so this foundation module has zero hard dependencies.
Frame: TypeAlias = Any


class VideoStream(ABC):
    """Readable video source with context-manager lifecycle.

    Typical use::

        with open_stream(config.source) as stream:
            for frame in stream:
                ...

    Implementations must release the capture device in :meth:`close`.
    """

    @abstractmethod
    def open(self) -> None:
        """Acquire the underlying capture. Idempotent or raise if already open."""

    @abstractmethod
    def read(self) -> Frame | None:
        """Return the next frame, or ``None`` at end-of-stream / disconnect."""

    @abstractmethod
    def close(self) -> None:
        """Release the capture. Safe to call multiple times."""

    @property
    @abstractmethod
    def fps(self) -> float | None:
        """Reported frames-per-second, or ``None`` if unknown."""

    @property
    @abstractmethod
    def frame_size(self) -> tuple[int, int] | None:
        """``(width, height)`` in pixels, or ``None`` before open / if unknown."""

    def __enter__(self) -> VideoStream:
        self.open()
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        tb: TracebackType | None,
    ) -> None:
        self.close()

    def __iter__(self) -> Iterator[Frame]:
        while True:
            frame = self.read()
            if frame is None:
                break
            yield frame
