# Teaching illustrations

These images are learning content, not decorative interface controls. Preserve the
approved house artwork and the true colours of wine. The 4 October 2026 training
brief defines three related families: the candlelit library plate, the flat field
atlas sheet and the parchment diagram. Readable labels, explanations and sources
belong beside each image in ordinary app text.

## Current guides

`js/data-teaching-images.js` holds the exact approved file inventory, alt text,
captions, numbered keys and primary-source reading. The first three guides cover
ullage, condition clues and crystals/sediment/cork. Their captions distinguish
visual clues from diagnosis. No illustration proves a bottle's condition, no
unverified restaurant cellar claim is added, and cork pieces are not TCA taint.

`js/codex33.js` places closed disclosures in My restaurant, selected written
Library chapters and the grid reference. It never mounts them in question runs,
tasting flights or flashcard faces. No image URL enters the document until the
reader opens its guide. Its key remains readable offline without the image.
`js/codex34.js` extends the reference views with colour/rim reading in Study the
grid, bottle shapes in Winemaking and beside the house's full-list door, and a
Pinot Noir portrait only inside that grape's Compendium entry. The portrait has
no numbered callouts, so its reading list is unordered. All three remain closed
until requested, with no art on quiz, flashcard or blind-flight screens. Colour
is not a grape/age verdict, bottle shape and punt depth are not quality rules,
and one botanical specimen is not representative of every Pinot clone.
Exact delivery sizes and full-image checksums live in the manifest.
The colour, bottle-shape and Pinot additions total 408,660 bytes across their
three full images and three thumbnails. The colour plate uses an angled
overhead view so the standing glasses remain physically legible; its numbered
colour/rim key is unchanged. The bottle plate omits fixed punt-depth cutaways.
When a device has saved only one rendition, offline rotation and enlargement
keep using that rendition. The viewer says when only the smaller copy is saved.

## Adding or revising art

1. Inspect the actual image against its lesson and numbered key. Keep a versioned
   filename (`name-v1.webp`, then `name-v2.webp`), never replace a delivered file.
2. Encode each WebP at no more than **256,000 bytes**. Add its real width and
   height, descriptive alt text, title, caption, numbered `key` pairs and primary
   `sources` to the manifest. An optional `thumb` contains its own `file`, `width`
   and `height`, at the same aspect ratio. Alt text describes the teaching point,
   not merely the medium. It must not reveal a question's answer on a front face.
3. Add placement only to a reading/reference view, test the picture and text in
   both services at 320 and 390 pixels, and check the enlarged version. A removed
   manifest entry returns no figure; a failed image leaves the caption/key intact.
4. Bump the manifest/script query versions in **both** `index.html` and the
   worker's `importScripts` when those files change; bump the worker `CACHE` too.
   The small scripts/styles belong in `ASSETS`. Art never does.
5. Run `node .scripts/check-teaching-images.js --require-art`, the atlas cache/data/UI checks,
   syntax, home and navigation checks. The source owns the change; publication
   must explicitly include new runtime image paths as well as the source delta.

The worker intercepts the entire local `assets/teach/` and `maps/atlas-zoom-vN/`
namespaces before any general map or shell caching. Only exact manifest URLs
enter the optional cache: query variants, unknown files and other installations
cannot do so. The installation's `codexteach-v1-<encoded directory>` collection
holds at most **48 files** (full images and thumbnails count separately), each at
most 256,000 bytes. FIFO eviction removes the oldest first; serialized writes
keep concurrent requests bounded. Viewed art survives shell updates, while a new
path is a new edition. Missing storage still permits online viewing.

## Future closer-look maps

Use separate `kind: 'zoom'` entries, versioned paths under `maps/atlas-zoom-v1/`,
and a `parentAtlas` id such as `france`. Supply `scope`, a `reading` array and
source links, alongside the normal figure metadata/key. Once reviewed and
registered, a closed Closer looks section appears on that existing atlas sheet.
No empty links or placeholder maps appear beforehand.

Zoom files have their own installation cache, `codexzoom-v1-<encoded directory>`,
bounded to **24 files** at 256,000 bytes each. Do not add them to `ATLAS_V2`, change
`mapFile`, split an existing `regions[]` record or reuse `codexmaps-v2-*`. The
seventeen reviewed SVGs, their joins and stored map collection are independent.
Any future map requires geographical review against authoritative data and a
bibliography entry before publication; these reading illustrations make
no geographic changes.
