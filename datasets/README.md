# Datasets

YOLO layout for GuardianAI person detection fine-tuning.

## Layout

```
datasets/
  data.yaml                 # active train target → hostel_person/
  coco_person.yaml          # public COCO person export
  LICENSES.md
  hostel_person/            # CUSTOM hostel data (fine-tune here)
    images/{train,val}/
    labels/{train,val}/
  public/coco_person/       # optional public bootstrap (download script)
    images/{train,val}/
    labels/{train,val}/
    raw/                    # COCO zips / annotations (gitignored)
```

Label format (YOLO): one `.txt` per image, same stem:

```text
0 0.512 0.440 0.200 0.610
```

`class_id x_center y_center width height` — all geometry normalized to `[0, 1]`.  
Class `0` = `person` only. No face boxes. No identity labels.

## Add custom hostel images

1. Capture stills from hostel CCTV / phone (corridors, gates, common rooms). Prefer the same angles as production cameras.
2. Blur or crop faces if your hostel policy requires it — the model only needs **person** boxes, not identities.
3. Label with any YOLO tool (e.g. [Label Studio](https://labelstud.io/), [CVAT](https://www.cvat.ai/), [Roboflow](https://roboflow.com/), or Ultralytics annotation). Single class: `person`.
4. Split ~80/20 into `hostel_person/images/train` and `…/val` (and matching `labels/`).
5. Validate:

```powershell
python -m training.validate_dataset
```

6. When validation prints `OK`, fine-tune:

```powershell
python -m training.train
```

### Quality bar (before training)

| Rule | Why |
|------|-----|
| ≥ 200–500 labeled frames (more is better) | Stable fine-tune |
| Both day and night lighting | Night-movement scenario |
| Empty corridors as negatives (empty `.txt` files) | Fewer false alarms |
| Match camera resolution / FOV when possible | Less domain gap |
| No student names / IDs in filenames or labels | Privacy |

### Optional: bootstrap from public COCO person boxes

```powershell
python -m training.download_coco_person
python -m training.validate_dataset --data datasets/coco_person.yaml
```

Copy or merge into `hostel_person/` only if you accept COCO licensing (see `LICENSES.md`). Prefer **hostel-local** images for the final model.

Full training docs: [`docs/training-pipeline.md`](../docs/training-pipeline.md)
