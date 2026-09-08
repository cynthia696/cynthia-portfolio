# Portfolio design system

Agent-facing design guidance for **Cynthia Cheng’s portfolio**. Prefer matching existing patterns on each page over inventing new ones. When editing UI, read nearby CSS on the same page first.

## Site map & URLs

| Page | File |
|------|------|
| Home | `index.html` |
| Gripp Rendezvoo | `gripp-rendezvoo.html` |
| Permissions | `permissions.html` |
| Crop Circle System | `crop-circle-system.html` |
| WIWANT | `wiwant.html` |
| AI Playground | `ai-playground.html` |
| About | `about.html` |

Do not resurrect old filenames (`atlas-analytics.html`, `mosaic-design-system.html`, `design-system-rebuild.html`, `beacon-ai-assistant.html`).

## Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / project titles | **Exposure** (`fonts/Exposure-Trial-10.woff2`) | Hero lines, case study `.display`, footer titles, Explore more titles |
| Brand / nav | **Nav Sans** (`fonts/NavSans.woff2`) | Wordmark + primary nav |
| UI / body | **Inter** | Case body, footnotes, captions, footer notes |

Fallbacks: Exposure → Georgia, serif; Nav Sans / Inter → system-ui.

Display sizes typically `clamp(28px, 3.2–3.6vw, 40–44px)`, letter-spacing around `-0.02em`, weight 400 for Exposure.

**Avoid** default AI stacks (Inter-only pages, Roboto, Arial as the design voice). Exposure + Nav Sans are brand-critical.

## Color & atmosphere

### Shared case-study tokens

```css
--pad: clamp(24px, 5vw, 80px);
--content: 1120px;
--section-y: clamp(72px, 9vw, 112px);
--ink: #222;      /* or near-black */
--muted: #717171; /* secondary text */
--line: #e8e8e8;
--soft: #f2f2f2;
```

Eyebrows on light sections often use warm brown `#56483b`. Reflection blocks are **black** `#000` with light type.

### Footer

- Background: `#FBF9F7`
- Top arch via SVG `#footer-arch-clip` (inverse of hero curve)
- Arch height: `--footer-arch: clamp(140px, 21vh, 260px)`
- Do not flatten the arched transition into a hard rectangle

### Things to avoid (visual defaults)

- Purple-on-white / purple→indigo gradient themes
- Warm cream + terracotta “AI brochure” look as a new default on branded surfaces
- Glow stacks, emoji decoration, dense pill chip rows
- Cards in heroes unless the design system already requires them

## Layout rhythm

- **Content measure**: `max-width: var(--content)` → **1120px**, padded with `--pad`
- **Desktop nav / footer side inset** (≥1100px): **240px** left/right (match home)
- One job per section: one purpose, one headline, usually one short supporting line
- Full-bleed heroes on case studies: media as edge-to-edge plane with convex clip — not inset cards
- Home stack gap between major blocks: `--home-stack-gap` (keep Selected Work ↔ Explore AI ↔ footer arch consistent)

## Navigation

- Home wordmark: Exposure / brand color treatment on home; case pages use `← Cynthia Cheng` back link over hero
- Links: Work, AI Playground, About, Resume, Contact
- Keep nav structure identical across case studies unless asked otherwise

## Case study sections (pattern)

Typical order: Hero → Overview / problem → research & solution → reflection (black) → **Explore more work** → site footer.

### Explore more work

- Title only: **Explore more work** (no “Other Work” eyebrow)
- Two columns in `--content` width
- Thumbnails: **rounded rectangles** (`border-radius: ~20px`, aspect ~16/10) — not circles
- Show **two other projects** (exclude the current page); link to renamed URLs above

### Reflection

- Full-bleed black, centered type
- Eyebrow uppercase Inter Medium; title Inter Medium ~36px; body 16px / 1.7

## Footer (all main pages)

Shared structure:

1. Titles: “You made it to the bottom!” / “Each page features a pet I’ve cared for.” (Exposure)
2. Pet story (Inter 16 / 1.7 / `#444`, left-aligned, max ~1120px) — **unique per page**
3. Row: brand · **3 polaroids** · Explore / Connect links

### Polaroids

- White frame, equal padding (~10px), soft shadow, slight rotations
- Spread on scroll via `js/footer-photos-spread.js` + `.is-spread`
- Middle slot may be `<video muted autoplay loop playsinline>` (same cover treatment as images)
- **Do not brighten** footage with filters unless asked — keep original exposure
- Assets live under `images/footer/` and `videos/footer/` with page-specific names (`home-pet-*`, `permission-pet-*`, `about-pet-*`, etc.)

## Home — Selected Work & Freetime

- Selected Work: cover image + Exposure title + date; links to work URLs above
- Freetime marquee (`#freetime`): keep in sync with AI Playground card order when adding projects (duplicate both `.freetime__group`s)

## AI Playground

- Polaroid snap carousel: `js/polaroid-carousel.js` + `images/ai-playground/cards.json`
- Adding a project: add video under `videos/freetime/`, poster under `images/ai-playground/cards/`, **prepend/update `cards.json`**, and sync home freetime strip
- Page scroll lock until last card is centered; then release to footer
- Input mapping (confirmed): **Down / Right / swipe-down = forward**; **Up / Left / swipe-up = back**
- Hide horizontal scrollbar on the track (`scrollbar-width: none`)

## Motion

- Prefer intentional, few motions (2–3) over constant noise
- Existing easings often use `cubic-bezier(0.22, 1, 0.36, 1)`
- Respect `prefers-reduced-motion` where transforms animate in volume

## Implementation notes for agents

- Most pages are **self-contained HTML + inline CSS** — duplicate carefully or shared snippets stay in sync by habit, not imports
- Vite multi-page inputs are listed in `vite.config.js`; update when adding/renaming HTML entries
- Prefer editing the page you’re on; don’t “improve” unrelated pages
- Match quotes/copy exactly when the user pastes content; don’t add emojis unless provided
- Images: convert HEIC/MOV into web JPEGs/MP4s in-repo before referencing

## Quick checklist before shipping UI

- [ ] Exposure / Nav Sans / Inter used for the right roles  
- [ ] Content width ~1120px; desktop inset 240px where applicable  
- [ ] Footer arch + pet story/polaroids still coherent  
- [ ] Work links use current filenames  
- [ ] No accidental purple/glow/card-hero defaults  
- [ ] Mobile: first viewport and footer still readable  
