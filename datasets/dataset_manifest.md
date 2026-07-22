# Dataset Manifest — GuardianAI

Prepared for fine-tuning / evaluation. **Do not start long training until hostel labels exist.**

| Dataset | Source | License | Purpose | Classes | Approx images | Download |
|---------|--------|---------|---------|---------|---------------|----------|
| COCO 2017 Person | [cocodataset.org](https://cocodataset.org) | Annotations CC BY 4.0; images Flickr terms | Person detection bootstrap | person | ~64k w/ person (full) | `python -m training.download_coco_person` (sample) / `--full` |
| Hostel custom | Team capture | Institution-owned | Domain fine-tune | person | TBD | Manual → `datasets/hostel_person/` |
| CrowdHuman | [crowdhuman.org](https://www.crowdhuman.org/) | Research-only (registration) | Crowded scenes | person | ~15k train | Manual after license accept — see script stub |
| MOT17 | [motchallenge.net](https://motchallenge.net/data/MOT17/) | Academic | Tracking eval | pedestrian | sequences | Manual download |
| MOT20 | [motchallenge.net](https://motchallenge.net/data/MOT20/) | Academic | Dense tracking | pedestrian | sequences | Manual download |
| ExDark | [ExDark](https://github.com/cs-chan/Exclusively-Dark-Image-Dataset) | Research | Night / low-light | person (+others) | ~7k | GitHub release |
| Open Images Person | [Open Images V7](https://storage.googleapis.com/openimages/web/index.html) | CC BY 2.0 (images) | Extra person variety | Person | large | `training/download_openimages_person.py` (stub) |

## Local layout

```
datasets/
  hostel_person/     # ACTIVE fine-tune target (data.yaml)
  public/coco_person/
  zones/default_zones.json
```

## Integrity

```powershell
python -m training.validate_dataset
python -m training.validate_dataset --data datasets/coco_person.yaml
```

## Notes

- CrowdHuman / MOT require accepting upstream terms; scripts only document URLs (no silent bulk scrape where ToS forbid it).
- Privacy: no face-identity labels. Person boxes only.
