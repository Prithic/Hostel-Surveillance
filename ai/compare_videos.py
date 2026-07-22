import time
from pathlib import Path
import cv2

from ai.config import AIConfig
from ai.bytetrack import ByteTrackTracker
from ai.opencv_stream import OpenCVVideoStream
from ai.yolo_detector import YOLODetector

def run_comparison():
    root = Path(__file__).resolve().parents[1]
    videos = list(root.glob("*.mp4"))
    
    if not videos:
        print("No MP4 videos found in the root directory.")
        return

    print(f"Found {len(videos)} videos. Running comparison headless (no GUI)...\n")
    print(f"| {'Video Name':<50} | {'Frames':<8} | {'Avg FPS':<8} | {'Unique Tracks':<13} | {'Total Boxes':<11} |")
    print(f"|{'-'*52}|{'-'*10}|{'-'*10}|{'-'*15}|{'-'*13}|")

    for video_path in videos:
        import torch
        device = "cuda" if torch.cuda.is_available() else ("mps" if torch.backends.mps.is_available() else "cpu")
        
        config = AIConfig(
            source=str(video_path),
            model_path=root / "YOLOv8s_v4_production_20260722-180642" / "best.pt",
            confidence_threshold=0.5,
            device=device
        )
        
        detector = YOLODetector(
            model_path=str(config.model_path),
            confidence_threshold=config.confidence_threshold,
            person_class_id=config.person_class_id,
            device=config.device
        )
        
        tracker = ByteTrackTracker(
            model_path=str(config.model_path),
            confidence_threshold=config.confidence_threshold,
            person_class_id=config.person_class_id,
            device=config.device
        )
        
        stream = OpenCVVideoStream(config.source)
        stream.open()
        
        unique_ids = set()
        total_boxes = 0
        frame_count = 0
        
        start_time = time.perf_counter()
        
        while True:
            frame = stream.read()
            if frame is None:
                break
                
            frame_count += 1
            detections = detector.detect(frame)
            tracks = tracker.update(detections=detections, frame=frame)
            
            for track in tracks:
                unique_ids.add(track.track_id)
                total_boxes += 1
                
        end_time = time.perf_counter()
        
        stream.close()
        tracker.close()
        detector.close()
        
        duration = end_time - start_time
        avg_fps = frame_count / duration if duration > 0 else 0
        
        name = video_path.name
        if len(name) > 47:
            name = name[:47] + "..."
            
        print(f"| {name:<50} | {frame_count:<8} | {avg_fps:<8.1f} | {len(unique_ids):<13} | {total_boxes:<11} |")

if __name__ == "__main__":
    run_comparison()
