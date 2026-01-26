# Visual Style Spec: Townhome Initiative Web Presentation

This spec defines the **look-and-feel** of the web deck.\
Goal: **sharp, clean, modern, graphic-heavy**, consistent with the Townhomes PPT decks in this project.

---

## 1. Style goals

- Crisp, minimal UI chrome
- High visual density (screenshots/diagrams are the star)
- Text supports visuals: **headline → 2–4 bullets → big proof**
- “Intentional placeholders” while assets are being gathered

---

## 2. Typography

### Primary font

**DM Sans**\
Use weights:

- 400 Regular
- 500 Medium
- 600 SemiBold

**CSS stack** `DM Sans, Arial, sans-serif`

### Type scale (presentation-optimized)

Assuming a 16:9 stage.

- **Hero title:** 46px (600)
- **Slide title:** 40px (600)
- **Body:** 19px (400)
- **Secondary:** 15px (400–500)
- **Micro:** 12px (400)

### Typography rules

- Titles: SemiBold
- Eyebrows / tags: Medium
- Body: Regular
- Line height:
  - Titles: 1.05–1.15
  - Body: 1.35–1.5
- Avoid paragraphs; keep bullets short.

---

## 3. Color system

### Neutrals

- Background: `#FFFFFF`
- Primary text: `#111111`
- Secondary text: `#888888`
- Surface / placeholder fill: `#EEEEEE`

### Accent (pick one, keep consistent)

Use **one** accent family for the entire deck.

**Recommended accent (clean/modern)**

- Accent: `#FFAB40`
- Link / teal accent: `#0097A7`

### Dark section slides

Use sparingly (cover / dividers / “big moment” slides).

- Dark BG: `#362F2F`
- Text on dark: `#FFFFFF`
- Secondary on dark: `rgba(255,255,255,0.7)`

---

## 4. Layout and grid

### Stage

- Fixed **16:9** stage centered in viewport
- Content scales responsively while preserving aspect ratio
- Stage padding: **28px**

### Grid

Use a 12-column grid.

- Text column: **5 cols**
- Gap: **1 col**
- Visual column: **6 cols**

### Slide structure

- Optional eyebrow label (small, top-left)
- Title
- Main region:
  - Most slides: text left + visual right
  - Some slides: full-bleed visual with minimal text

---

## 5. Components (graphic-first)

### A) Screenshot Frame

**Use for:** UI screenshots, renders, simple diagrams\
**Structure:**

- Visual container (16:9 or 4:3)
- Optional “chip” label (e.g., Studio / CFG / Showroom)
- Caption line beneath

**Placeholder look:**

- Fill `#EEEEEE`
- Border: 1px subtle (low contrast)
- Radius: 12–16px
- Centered icon + label (e.g., “Replace with Studio screenshot”)

### B) Workflow Panel

**Use for:** end-to-end demo flows

- Left: 3–7 short steps (numbered)
- Right: large diagram placeholder
- Optional small “Demo Walkthrough” label

### C) Timeline Strip

**Use for:** milestones (POC → demo → IBS → GA)

- Horizontal markers
- Minimal text; emphasize the line and nodes

### D) Metric Cards

**Use for:** success metrics / validation targets

- Big number
- One-line definition
- Secondary note

### E) Section Divider Slide

**Use for:** chapter breaks

- Dark background
- One bold statement + short subtitle

---

## 6. Motion and transitions

- Slide transition: fast and subtle
  - Duration: **150–250ms**
  - Motion: small translate (6–12px) + fade
- No heavy animations, parallax, or gimmicks.

---

## 7. Design tokens (drop-in)

```css
:root {
  --font-sans: "DM Sans", Arial, sans-serif;

  --w-regular: 400;
  --w-medium: 500;
  --w-semibold: 600;

  --t-hero: 46px;
  --t-title: 40px;
  --t-body: 19px;
  --t-secondary: 15px;
  --t-micro: 12px;

  --bg: #ffffff;
  --text: #111111;
  --text-secondary: #888888;
  --surface: #eeeeee;

  --accent: #ffab40;
  --link: #0097a7;

  --dark-bg: #362f2f;

  --stage-padding: 28px;
  --radius: 14px;
  --transition-ms: 200ms;
}
```

---

## 8. “Sharp & clean” checklist (visual QA)

- Titles never wrap awkwardly (tight copy)
- No more than 4 bullets on a standard slide
- Every slide has a dominant visual or intentional placeholder
- Consistent margins/padding across slides
- Captions are always secondary color, small, and aligned

