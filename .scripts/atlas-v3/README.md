# Wine Atlas: explorer edition 3

Reviewed **10 October 2026**. `catalog.cjs` is the authoring source for all
17 sheets; `build.cjs` emits `maps/atlas-v3/*.svg` and `js/data-atlas-v2.js`.
The older metadata filename and `ATLAS_V2` global remain for classic-script
compatibility; the metadata version and image paths are edition 3.

## Rebuild

From the Codex repository root:

```text
node .scripts/atlas-v3/build.cjs
node .scripts/build-atlas-sources.cjs
```

An optional `--mirror /path/to/public/codex` argument writes the atlas SVGs
and metadata into the paired public wing. Follow the suite's publishing
instructions for the other runtime files, worker versions and release checks.
Generation is deterministic and makes no network requests.

## Geography and artwork

The renderer reuses `../atlas-v2/geography.json`: public-domain Natural Earth
1:10 million outlines and selected waterways, retrieved 27 September 2026
from upstream revision `ca96624a56bd078437bca8184e78163e5039ad19`.
That file retains the eight original download SHA-256 values and provenance.
The previous edition's downloader/extractor remains the reproducible source
preparation route. [Natural Earth terms](https://www.naturalearthdata.com/about/terms-of-use/)

North is up. Each map uses an equirectangular projection with its midpoint
as standard parallel; graticules and overview crop boxes use the same actual
visible extent. Vertex simplification has a 0.32-pixel tolerance at 1200 × 1500.
Insets have separate scales. These are orientation maps, not legal appellation
boundaries, cadastral maps or evidence of a particular vineyard's eligibility.

Representative dots remain fixed at the catalog coordinates. Number and
letter badges may move for legibility, with leaders back to their dots.
Nearby points can remain close at a country-wide scale. The reading guide
explains grouped headings and geographic scope.

The embedded `assets/codex-atlas-frame-v3.webp` supplies the shared library,
hospitality and celestial ornament. It is decoration outside the geographic
field, not geographic evidence. The vector layer supplies coastlines, rivers,
locators, labels, compass and study key. No generated terrain or wine-region
polygons are used. Journey captions are editorial invitations.

## Reviewed refinements

- Rías Baixas now uses a land-based Val do Salnés representative point
  (`-8.78, 42.50`), with a note that this is one of five separate subzones.
  [D.O. Rías Baixas](https://doriasbaixas.com/en/terroir-rias-baixas-a-natural-paradise/)
- Washington's Columbia Gorge locator is on the Washington side
  (`-121.52, 45.76`). The guide identifies its cross-border extent and
  distinguishes it from adjoining Columbia Valley.
  [Washington State Wine Commission](https://www.washingtonwine.org/resource/columbia-gorge/)
- The preserved Canterbury / Waipara heading identifies its two points as
  Waipara Valley and Canterbury Plains and explains their North Canterbury
  context. Coordinates are unchanged.
  [New Zealand Winegrowers](https://www.nzwine.com/en/regions/northcanterbury/)
- Hungary's legacy regional-presentation PDF reference was replaced by the
  working official [wine regions and districts directory](https://bor.hu/en/wine-regions/).

All **115 mapped lesson names and their order** retain exact `mapRegions`
joins. The original **117 rows** remain, including Virginia and Texas as
Beyond this map notes under New York. Question IDs, progress and study banks
are unchanged. The 172 representative points pass a land-containment sanity
check against the pinned geometry; this does not verify legal wine boundaries.

All 17 rendered plates were visually reviewed, including dense study keys.
The Madeira inset was moved clear of coordinate labels; New York's compass
was moved clear of Long Island. Original `maps/*.jpg` and `maps/atlas-v2/`
remain archived. Edition 3 uses its own versioned image paths and map cache;
do not overwrite an older saved edition to deliver a future revision.
