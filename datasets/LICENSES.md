# Dataset licenses

GuardianAI only vendors **download scripts**, not the media. You must accept upstream terms before downloading.

## COCO 2017 (person subset)

| Asset | Source | Terms (summary) |
|-------|--------|-----------------|
| Annotations | [cocodataset.org](https://cocodataset.org/#termsofuse) | **Creative Commons Attribution 4.0** |
| Images | Flickr URLs via COCO | Subject to **original photographer / Flickr** terms; often OK for research; **verify before commercial/product use** |

Script: `python -m training.download_coco_person`  
Official mirrors used:

- `http://images.cocodataset.org/annotations/annotations_trainval2017.zip`
- `http://images.cocodataset.org/train2017/<file>` / `val2017/<file>`
- Optional full zips: `…/zips/train2017.zip`, `…/zips/val2017.zip`

We export **person** boxes only (`category_id == 1`), drop `iscrowd`, convert to YOLO class `0`.

## Custom hostel imagery

Owned by your institution / team. Do **not** publish identifiable student imagery. Labels must remain event/person-box only (no names, roll numbers, or face IDs).

## Not included (on purpose)

Face recognition datasets, attendance corpora, and any dataset that requires identity labels — out of scope for GuardianAI privacy rules.
