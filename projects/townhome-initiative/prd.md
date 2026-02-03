# PRD: Townhome Initiative Web Presentation (HTML “Deck”)

**Path:** `apdrexler.com/projects/townhome-initiative/presentation/`  
**Format:** Static site (HTML/CSS/JS) that behaves like a slide deck

This PRD defines the **product + behavior + content structure** of the presentation website.  
Visual/typography requirements live in **VisualStyle.md** (linked below).

- See: [Visual Style Spec](./VisualStyle.md)

---

## 1. Overview

### What we’re building
A **web-based presentation deck**: full-screen “slides” (sections), snap navigation, keyboard controls, and graphic-forward layouts. It replaces a PowerPoint.

### Why
- Screen-share friendly, crisp pacing
- Better support for rich visuals (screenshots, diagrams, GIFs)
- Easy iteration and reuse later

### Audience & context
Used as a **case study presentation** to showcase product work. Content maps to common PM case-study prompts:
- Problem / opportunity
- Team + role
- Goals + success metrics
- Process
- Challenges / tradeoffs
- Adoption / results
- Retrospective / what you’d change

---

## 2. Goals and Non-Goals

### Goals
1. **Deck-first UX**
   - Feels like slides, not a scrolling blog post.
2. **Graphic-heavy storytelling**
   - Each slide has a strong visual anchor (or intentional placeholder).
3. **Clear, “rubric-shaped” narrative**
   - It should be obvious where each PM prompt is answered.
4. **Stable + easy to update**
   - Replace visuals by swapping assets, without rewriting layout.

### Non-goals
- No CMS/admin UI.
- Not a marketing microsite (though it should look polished).
- Not an interactive demo app (but can link to demos).

---

## 3. Information Architecture

### URL structure
- `/projects/townhome-initiative/presentation/` → `index.html`
- Optional: `/assets/` for images/gifs
- Optional: `/data/` for slide manifest json (if used)

### Slide model
Each slide is a full-viewport `<section>` with:
- `id` for deep-linking (`#why-townhomes`, `#datums`, etc.)
- Title + optional eyebrow label
- A primary content region that supports “text + visual” layouts
- Optional speaker notes (presenter mode)

---

## 4. Content Outline (recommended baseline)
You can adjust the sequence, but keep the categories.

1. Title / opener
2. Problem / opportunity (“Why Townhomes?”)
3. Goals + constraints
4. Team + your role
5. What we built (capabilities map)
6. Deep dives (datums / levels / foundations / wall heights / multi-unit)
7. Execution approach (milestones, dependencies, sequencing)
8. Challenges + tradeoffs
9. Measuring success (signals, IBS validation, adoption)
10. Outcomes + next steps
11. Retrospective / what you’d change
12. Appendix: sources / links

---

## 5. Functional Requirements

### Navigation
- Arrow keys: `←` `→`
- Page keys: `PgUp` `PgDn`
- Space advances
- Optional: scroll wheel or trackpad scroll should move slide-by-slide (snap)
- Optional: a small on-screen nav (next/prev) for mouse users

### Slide snapping
- One slide occupies the stage at a time
- Transitions are subtle and fast (see VisualStyle)

### Deep links
- Visiting `.../presentation/#datums` jumps to the datums slide.
- Copying the URL preserves current slide.

### Table of contents (optional but recommended)
- A minimal “TOC” overlay or sidebar
- Clicking items jumps to slide

### Presenter mode (nice-to-have, high value)
Enable with `?presenter=1`:
- Speaker notes area (collapsed by default)
- Current slide number + total
- Timer
- Next slide title preview

### Asset placeholders
Until real visuals are ready, slides can use placeholder components:
- Screenshot Frame placeholders
- Workflow Panel placeholders
- Timeline Strip placeholders
- Metric Cards placeholders

(Exact specs in VisualStyle.md)

---

## 6. Technical Requirements

### Build constraints
- Static-only deployment (no server runtime required)
- Works in current Chrome/Edge/Safari
- Responsive scaling, preserving a 16:9 stage centered in viewport

### Performance
- Lazy-load images below current slide
- Prefer `.webp` for stills; use GIFs only where motion is essential
- Ensure crisp rendering during screen-share (avoid tiny type)

### Accessibility (lightweight)
- Logical heading order per slide
- Keyboard navigation always works
- Sufficient color contrast (see VisualStyle)

---

## 7. Analytics (optional)
If you want instrumentation:
- Page loads
- Slide change events (hash changes)
- Time per slide (client-only)

---

## 8. Acceptance Criteria
1. URL loads instantly into a title slide.
2. Arrow keys move slide-by-slide with snap.
3. Slide titles are readable at typical screen-share resolutions.
4. Placeholders look intentional and consistent with the deck style.
5. There is an appendix slide that references core artifacts (PRDs, decks, screenshots).

---

## 9. Milestones (suggested)
1. **MVP shell**
   - Stage + slide sections + snap navigation
2. **Content skeleton**
   - All slide titles + placeholder visuals
3. **Visual swap**
   - Replace placeholders with final screenshots/diagrams
4. **Presenter polish**
   - Presenter mode + final rehearsal tweaks

