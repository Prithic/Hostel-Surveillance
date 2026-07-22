import sys
import time
from ai.opencv_stream import OpenCVVideoStream

def main():
    print("Testing OpenCVVideoStream...", flush=True)
    stream = OpenCVVideoStream(0)
    try:
        stream.open()
        for i in range(10):
            frame = stream.read()
            if frame is not None:
                print(f"Read frame {i}, shape: {frame.shape}", flush=True)
            else:
                print(f"Read frame {i}, None", flush=True)
            time.sleep(0.1)
    finally:
        stream.close()
        print("Stream closed.", flush=True)

if __name__ == "__main__":
    main()
