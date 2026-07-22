# Quality report

Generated: 2026-07-22T13:25:39.401827+00:00

## Extraction
- considered: {'considered': 960, 'saved': 65, 'blur': 0, 'dup': 35, 'corrupt': 0}
## Annotation
- {'images': 65, 'with_boxes': 18, 'boxes': 24, 'tiny_dropped': 0}
## QC removals
- {'images_before': 65, 'removed_empty': 47, 'removed_corrupt': 0, 'removed_duplicate': 0, 'removed_bad_label': 0, 'images_after': 18, 'total_boxes': 24, 'conf_mean': 0.462785014261802}

## Policies
- Empty label images removed
- MD5 duplicate images removed
- Boxes with area < 0.0008 dropped
- Blur (Laplacian < 35.0) skipped at extract
- Near-duplicate frames (hist corr ≥ 0.995) skipped
