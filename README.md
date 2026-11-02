# حكاية | Hikaya

قصص أطفال مخصّصة بالعربية والإنجليزية بهوية عُمانية — طفلك هو بطل الحكاية.

## ابدأ هنا

```bash
npm run verify   # فحص الملفات + الاختبارات
npm start        # معاينة محلية على http://localhost:4318
```

- فكرة المشروع الكاملة: [`docs/PROJECT-VISION.md`](docs/PROJECT-VISION.md)
- خطة التطوير والنواقص: [`docs/DEVELOPMENT-PLAN.md`](docs/DEVELOPMENT-PLAN.md)
- مواصفات المراحل 0–8: [`docs/phases/README.md`](docs/phases/README.md)
- الهندسة المستهدفة: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- التوثيق التقني: [`docs/DOCUMENTATION.md`](docs/DOCUMENTATION.md)
- النشر على Vercel: [`docs/DEPLOY-VERCEL.md`](docs/DEPLOY-VERCEL.md)
- وجوه الأبناء: [`docs/FAMILY-FACES.md`](docs/FAMILY-FACES.md)
- فهرس الملفات: [`docs/FILES.md`](docs/FILES.md)
- الشعار والهوية: [`BRAND.md`](BRAND.md)
- هيكل المنصة: [`platform/README.md`](platform/README.md)
- صحة الـ API: `/api/health`

**المستودع:** https://github.com/ainoamn/hikaya  
**الموقع الحي:** https://hikaya-nine.vercel.app  
**جذر الاستضافة:** مجلد `dist/` (لا يحتاج بناء تجميعي؛ `npm run build` يتحقق من اكتمال الملفات فقط).  
**صفحات الامتثال:** `/privacy.html` · `/terms.html` · `/status.html`

> هذه نسخة واجهة تجريبية. الدفع والطباعة التجارية وتوليد الذكاء الاصطناعي الحي غير مفعّلة.

---

## Expanded dreams, family stories, editorial gender and Arabic listening

The current library has 42 original bilingual fiction adventures (340 authored pages per language) plus the five separate sourced historical readings. Eighteen additions cover engineering, mechanics, pilots, community police, ambulance awareness, firefighters, sheep, horses, forest seeds and time with Dad, Mum and family. All additions have eight pages. The library filters nine categories, searches story text and progressively reveals nine cards at a time.

Twelve new selectable career characters bring the collection to 23. Seven new 4×2 illustration packs provide 56 prepared panels. WebP delivery retains the same dimensions and reduces the new artwork transfer from 21.4 MB to 4.4 MB; original PNGs remain in `artwork-source/`. They retain the existing family cartoon style. These are shared thematic illustrations, not automatically generated plot-specific pages or native 8K source files. Parents in the new illustrations are fictional. Source references are not deployed. `expansion-art-prompts.md` records asset provenance.

`more-stories.js` contains the new authored adventures. `gender-stories.js` supplies page-scoped masculine/feminine alternatives for all 42 stories, preserving supporting characters and sourced historical facts. The studio offers an explicit boy/girl selection, follows known default names, synchronizes compatible outfits and stores gender in saved stories. Arbitrary names do not cause guesses from photographs. A matching friend name is replaced with a friend role to keep the lead distinct.

`personalization.js` and `atelier.css` provide the new cream/emerald/coral design, dream shortcuts, character carousel, responsive cards and identity controls. The bilingual SVG mark was redesigned, and its PNG was rendered in the browser with the local Arabic font.

`story-voice.js` replaces the single long browser utterance with a page-by-page story player: strictly language-matched voices, sentence chunks, gentle pace, pause/resume, page navigation, optional continuous reading and custom vowel-marked name pronunciation. It uses available device voices and does not claim professional neural narration. If Arabic voices are absent, it explains the limitation and never substitutes an English voice. Speech on the site is not embedded in the downloadable silent book video. Implementation references: https://webaudio.github.io/web-speech-api/ and https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance .

Validation: `node tests/editorial.test.cjs` checks gender tokens, selected feminine/masculine clauses, name collisions, Arabic-only voices, pronunciation boundaries, sentence splitting and cancellation. A browser harness rendered all 1,360 fiction pages across both languages and both gender selections without layout failures. Actual UI checks covered male/female engineering stories, voice selection/pause, category loading and responsive layouts. The downloaded engineering PDF has nine unique 210 mm square image pages. Review artifacts remain under ignored `output/expansion/`. Desktop layout was inspected at 1280px with no horizontal overflow; viewport screenshot capture was unavailable at that override, then the default viewport was restored.

## 8K output and moving printed-book proof

Page exports now default to an 8192 × 8192 pixel square canvas, with 4096 and 2480 pixel alternatives. The same selection applies to PNG, full-book PDF, ZIP and printable HTML. This is output size, not native illustration resolution. The interface reports actual source dimensions and approximate print PPI. Text is rendered directly at the selected output resolution. The existing low-resolution atlas panels still need full-resolution replacement for high quality paid print production; enlarging them cannot add genuine detail. A reference-preserving restoration of the space atlas is saved as `space-restored.png`; its native size remains 1448 × 1086.

`dist/book-cinema.js` and `.css` add a silent moving proof: cover, RTL/LTR spreads, animated page turns, binding shadows, playback/pause/replay, previous/next scene, seek and playback speed. It uses the current book text and page styles. Entry points are the picture-book homepage section and each book studio. A complete 1280 × 800 WebM can be recorded locally with MediaRecorder; unsupported browsers keep the interactive preview. Reduced-motion preferences start playback paused. Closing frees canvases, streams and animation frames.

Validation: an actual UI download produced an 8192-square PNG and a 13-page PDF with 13 unique 8192-square image XObjects at 210 mm trim (about 104 MB). Rendered proofs are under ignored `output/quality/`. A complete WebM was downloaded and its VP9/1280×800 tracks inspected. Timeline checks cover 1/5/6/8/12 pages, including odd final spreads. Browser checks cover Arabic and English playback controls.

## Revised narrative library and transparent page lettering

The original fiction catalog contains 24 bilingual stories, four per initial category, now supplemented by the 18 adventures above. Leads are Isa (عيسى), Mudrik (مدرك), and Somoud (صمود). Every adventure has a distinct connected plot, dialogue, clues, a complication and a resolution. The falaj mystery has 12 pages; the other 23 have eight. Five sourced historical readings remain separate.

`dist/story-catalog.js` supplies authored content; `dist/story-library.js` and `.css` provide searchable category cards, reading and book-design entry points. `dist/book-paint.js` fills the entire square page with scene art and draws text directly over it, without opaque boxes or a lower paper band. Letter outlines preserve contrast. Per-page position and color controls are available in the book studio and persist into its exports. Prepared scene art is reused across stories within each art pack; new narratives do not automatically generate plot-specific illustrations.

Validation of this revision rendered all 392 Arabic/English story pages with no overflow or missing art. Browser checks covered filters, canonical names and text controls. The corrected Arabic PDF downloaded through the actual UI has 13 unique 210 mm square image pages (cover + 12 scenes); rendered review files and the PDF are under ignored `output/revision/`.

## Illustrated book studio and brand

The reader now opens a page-by-page picture-book studio with an independent scene for every story page. Twelve standalone forest illustrations and five 12-scene atlases cover ocean, space, knights, sailing and historical reading. The prepared cast uses the family reference style; a selectable narrator portrait follows the chosen character. Changing a story, outfit or new upload does not regenerate scene artwork automatically.

Text is composed with locally bundled Noto Sans Arabic, wrapped and fitted inside the page artwork, then baked into exported pixels. Overlong text blocks export instead of being silently clipped. Preview guides are excluded from exports.

Exports:

- RGB PDF proof, 210 × 210 mm trim, optional 3 mm bleed, optional cover, correct RTL/LTR viewer direction. Page artwork and text are one embedded image per PDF page.
- ZIP with every page as a distinct PNG at the selected resolution and a metadata/source manifest.
- Single PNG page at the selected resolution (up to 8192 × 8192).
- Self-contained illustrated HTML with exact-square print CSS.

These are review files, not certified press-ready files. Source scene resolution varies, especially the atlas panels; the 2480-pixel PDF canvas does not create additional source detail. Before paid print fulfillment, use high-resolution per-page generations, the printer's bleed/ICC/spine templates, source and identity review, and human prepress approval. Existing payment and fulfillment integration requirements still apply.

`dist/book-paint.js` contains canvas page composition. `dist/book.js` contains a binary image-PDF writer and an uncompressed ZIP writer with CRC32. The native browser handles Arabic shaping before rasterization. `dist/book.css` styles the studio.

Original vector branding is documented in `BRAND.md`; active assets are `dist/assets/hikaya-symbol.svg`, `dist/assets/hikaya-logo.svg`, and transparent `dist/assets/hikaya-logo.png`. The site header, favicon and book covers use the mark. Exact image-generation prompts are in `book-art-prompts.md`.

Validation: the sample Arabic book was downloaded through the actual UI and inspected with pypdf and rendered with PyMuPDF. It contains 13 square pages (cover + 12 story scenes), each with a unique embedded image. The ZIP passed CRC, image dimension, page count and uniqueness checks. Arabic/English previews and overlong-text rejection were exercised in the browser. Review artifacts are kept under ignored `output/pdf/`.

## Private family artwork edition

The parent-provided reference photographs were used through the built-in image editing tool to prepare recognizable cartoon adaptations of the three children. Active artwork is `dist/assets/characters-family.png`, `dist/assets/hero-family.png`, and `dist/assets/worlds-family.png`. Earlier generic art is retained. Original photographs are not copied into the project or deployed.

The taller boy from the left of the reference photos appears as the Omani boy, Gulf boy and knight. The girl in the center appears in the female roles. The younger boy on the right appears as sailor and Omani superhero. These are prepared illustrations; uploading a different photo does not dynamically regenerate faces. The wording in the studio, FAQ and exported files makes this distinction explicit. Site access remains owner-private.

Exact prompts and reference roles are in `family-art-prompts.md`.

## Character and heritage collections

- Eleven selectable characters: eight new original character illustrations (Omani boy/girl, Gulf boy, Arab girl, boy/girl knight on horseback, sailor, scholar) plus the three earlier Omani superhero, astronaut and marine explorer characters.
- Outfit selection changes the story cover, first-person fictional narration, downloaded illustrated HTML, and animated WebM preview. Reference photos remain browser-local and are not transformed by this prototype.
- Fiction: 42 authored adventures of 8–12 pages, with category search and bilingual gender variants.
- Historical readings: six pages, with verified facts explicitly distinguished from the child's imaginary present-day reading frame. Subjects: Ahmad ibn Majid, Ibn al-Haytham, Al-Khwarizmi, Ibn Battuta and Bahla Fort. Facts link to the Library of Congress, UNESCO and University of St Andrews. Artwork depicts fictional child characters, not historical likenesses. Edited facts require renewed review before publication.
- Choose an Omani setting, simple standard Arabic or Arabic with a light Omani touch. English remains supported. Historical sources determine the setting of factual readings.
- Downloaded standalone HTML now embeds a cover illustration and includes chapter headings, learning prompts and source links. Browser printing can export PDF; it is not a production print file with bleed.

Implementation: `dist/heritage-data.js`, `dist/heritage.js`, `dist/heritage.css`.

New original bitmap: `dist/assets/characters-atlas.png`, generated with the built-in image generation tool. Exact prompt: `characters-art-prompt.txt`. The 4×2 atlas uses CSS cropping; source art and prior characters are retained.

Independent bilingual prototype. Existing Nasab application is untouched.

## Omani edition

`dist/oman.js` adds an Omani identity, lightweight Omani Arabic expressions, and 12-page bilingual stories about falaj water conservation, curiosity about space, and protecting marine life. Original Omani art includes a child in dishdasha and kumma, mountain gardens, a falaj, and a maritime scene. Prices are illustrative OMR. All 22 Arab League countries appear in the demo address selector; this does not represent an activated shipping commitment.

Current art assets: `dist/assets/hero-oman.png` and `dist/assets/worlds-oman.png`. Earlier concept art is retained without overwriting.

## Preview

Run `node server.mjs`, then visit `http://localhost:4318`.

Static deployment root: `dist/`. No dependencies or build required.

## Working functionality

- Full Arabic RTL and English LTR interface, independent story language.
- Three adventure worlds, local photo preview with MIME and size validation and parental consent.
- Authored bilingual story previews of 8–12 pages, editable pages, device-local library and deletion.
- Downloadable standalone HTML story text; browser printing supports PDF export.
- Animated sample preview, browser speech synthesis, actual 6-second silent WebM sample export where supported.
- Print-order form validation and review. Address details stay in memory and are never submitted or stored.

## Required before commercial launch

This is a functional frontend prototype, **not a live AI generation or commerce service**. Prices and print specifications are illustrative. No API keys or payment details are collected.

1. Backend identity, user-owned storage, order database and image-upload lifecycle; server-side consent, image validation, retention and deletion controls.
2. Configure an AI provider for story writing and reference-image character generation, with child-appropriate content checks. Run long video jobs asynchronously and persist progress and downloadable results.
3. Integrate a hosted payment checkout. Calculate currency, tax, shipping and product price on the server; verify signed webhooks; create fulfillment only after confirmed payment. Never trust client totals.
4. Select printing and shipping partners, supported countries, actual product dimensions, production-ready PDFs with bleed and RTL page ordering, tracking and support/refund policies.
5. Replace sample copy with verified service commitments and approved pricing. Add account privacy, consent revocation, data export/deletion, terms and cancellation policies.
6. End-to-end testing of provider failures, payment retries, webhook idempotency, shipping and fulfillment before opening public access.

## Original art

Created with the built-in image generation tool; assets are included in `dist/assets/`.

- `hero.png`: Original Arab child superhero with teal suit, gold cape and fox in an enchanted forest, warm painterly storybook style, no text.
- `worlds.png`: Three-panel original storybook illustration: girl astronaut, forest hero, underwater explorer, no text.

Exact generation prompts are retained in `art-prompts.txt`.
