# Narrative: Townhome Initiative Web Presentation

This doc defines the **slide-by-slide narrative** and the **content you'll place on each slide**. It is intentionally optimized for a project that is **mid-delivery** (beta target April): the story makes clear what's **working now**, what's **in progress**, and what's **planned**—without diminishing the impact of the work.

**Default slide format:**
- Eyebrow (small): `Townhome Initiative Case Study`
- Title (big)
- Left: 2–4 bullets max
- Right: one dominant visual (or an intentional placeholder)

**Deep-dive slide pattern (repeatable):**
- *Problem* → *Before behavior* → *After design* → *Why it matters*

---

## Slide 1 — Cover
**Title:** Townhomes at Higharc (Case Study)
- Subtitle: Platform expansion from single-family → multi-unit
- Your name + role + date

**Visual:** Full-bleed "hero" graphic placeholder (townhome massing or clean initiative diagram)

**Speaker intent:** Set tone: sharp, visual-forward, structured case study.

---

## Slide 2 — Agenda
**Title:** What I'll cover

**Context:**
- Introduction
- How Higharc works today

**The Townhomes Initiative:**
- Why Townhomes
- Identifying the most critical problems
- Team and Role
- Our Process
- Mockups and "drawing to think"
- Delivery Process
- Defining Success

**The Product Solution:**
- High level product solutions
- Feature Deep Dives (4)

**Retrospective:**
- Next Steps for Townhome Initiative
- Reflections

**Visual:** Single-column agenda layout with section headers

---

## Slide 3 — Introduction
**Title:** Introduction

**My Experience:**
- Product leader with 5 years of product experience at intersection of AEC and technology
- Reimagining how homes are designed, documented, and built
- Licensed Architect with 7+ years experience leading design teams and delivering complex projects
- Technologist excited about generative AI
- Fun Fact: produced documentary on informal settlements in South America (withinformalcities.org)

**What Drives Me:**
- Excited by the opportunity to improve the built environment. >80% of all new SFH construction is production housing. If we could improve that product by just 2% the net impact at scale would be transformative.
- As a product leader and architect, I love envisioning the unseen, pulling from and aligning multiple stakeholders, and executing on a product vision to deliver value.

**Visual:** Profile headshot

---

## Slide 4 — How Higharc Works Today
**Title:** How Higharc works today
- Platform for builders to design homes and produce: drawings, takeoffs, and visualizations
- Changes ripple across multiple products and downstream outputs

**Visual:** Higharc solution overview GIF

---

## Slide 5 — Why Townhomes?
**Title:** Why Townhomes?
- Multiple active customers pursuing townhomes in Higharc today—hitting significant limitations
- Unlocks ~$20M ARR in existing sales pipeline
- Opens the door to builders currently blocked without townhome support—massive TAM and gateway to larger builders
- Platform leverage: capabilities built for townhomes strengthen the foundation for all building types

**Visual:** Buffington Townhomes photo

---

## Slide 6 — Identifying the Most Critical Problems
**Title:** Identifying the most critical problems
- Interviewed current and prospective customers on townhome needs
- Conducted internal reviews with SMEs, Sales, and CSMs
- Stack ranked limitations strategically to build out functionality over time
- Aligned across org and leadership on the most severe problems to address first

**Visual:** Townhome limitations analysis

---

## Slide 7 — Team and Role
**Title:** Team and Role
- The Townhome Initiative originated via product research and presentation to leadership team Jan '25
- I was assigned to lead the initiative and be DRI for its development and delivery
- Since January, I've worked extensively with 20+ different individuals across the org. I have no direct reports, and have led with influence and a sense for camaraderie as we work towards this collective goal.
- While I frequently engage with Sales, Marketing, Ops, and leadership, I spend most of my day-to-day engaging directly with the PDE team. Across 6 different projects I work with as many engineers, 2 product designers, and collaborate with fellow PMs.

**Visual:** Org chart + Townhome Initiative Team photo

---

## Slide 8 — Our Process
**Title:** Our Process

**Some Frameworks I Like:**
- Double Diamond framework / IDEO
- Continuous Discovery (Teresa Torres)
- Shape Up (Basecamp)

**Principles:**
- Incremental Delivery
- Mockups are very high value
- Estimating over 6 weeks worth of work is silly
- (Rough) Documentation is critical — especially working remote
- Milestone oriented deliverables and goals
- Strategic focused collaboration

**Visual:** User Journey Mapping image

---

## Slide 9 — Mockups, and "drawing to think"
**Title:** Mockups, and "drawing to think"
- It's important to test our ideas by sketching out concepts
- Sketches can be physical, FigJam diagrams, or interactive AI prototypes
- All of PDE can sketch and diagram out ideas to better align and test ideas
- These visuals can be reviewed directly with clients for more thoughtful feedback
- "Stop explaining it and draw!"

**Visual:** Pinboard collage of sketches, diagrams, and mockups

---

## Slide 10 — Delivery Process
**Title:** Delivery Process
- We use multiple techniques to help us estimate, track, and deliver as predictably as possible
- Work Plans: These docs break projects into 6-week chunks we can describe in a few bullet points. Any chunk that takes 6+ weeks needs to be broken down further. This also helps us limit unintentional scope creep.
- Milestones: We established key demo milestones that have helped rally the PDE team and give us opportunity for transparent feedback and WIP demos.
- Gantt-style prioritization and roadmapping: Reviewed multiple scenarios and paths that give us flexibility to take on unexpected priorities or fires.

**Visual:** Image carousel (4 slides) - Initiative Roadmap, Linear Workplan, Milestones, Eng-Gantt

---

## Slide 11 — Defining Success
**Title:** Defining Success
- Defined success for standalone projects and broader townhome workflow
- Target incremental delivery and investment to ensure we're not over investing
- Specific targets to support Interest, Adoption, Production, Performance, and Revenue

**Visual:** Success Criteria panel (HTML/CSS) with milestone targets for IBS, Beta, GA, and Q2

---

## Slide 12 — The Product Solution (High Level)
**Title:** The product solution
- 1. Core Building Model Improvements: Datums + Levels, Walls, Foundations
- 2. Modeling Components / Units: Modeling Components, Reporting Units, Unit Options
- 3. Dedicated Builder and Sales Experience: Dedicated Townhome Workflow, Specialized Sales Views

**Visual:** Townhome workflow GIF

---

## Slide 13 — Deep Dive: Levels and Datums (Feature Deep Dive 1)
**Title:** Levels and Datums

**Problem:**
- Higharc lacks user-defined, absolute datums. All datums were relative to one another or hosted to parent levels.
- Levels stack automatically on top of one another. Users can't associate a level with a specific datum, and can't separate the top of one floor from the bottom of the next.

**Solution:**
- We introduced Origin-relative datums. These are horizontal reference planes that users can lock other geometric objects to, including levels, floors, and walls. This gives users much more control.
- We also introduced new level behavior such that levels could be set to specific datums instead of always "stacking" on top of one another. This has unlocked future support for Split-level typologies, Stepped townhome units, and buildings that have complex relationships with grade including multiple foundation or basement levels.

**Visual:** Levels demo GIF + Demo File link

---

## Slide 14 — Deep Dive: Modeling Components (Feature Deep Dive 2)
**Title:** Modeling Components, Reporting Units, and Options
- Problem: rooms aren't the right driver for slabs/walls; stepped conditions need explicit control
- Before: room-hosted foundations; no hierarchy for multi-unit; wall heights hard to represent
- After: user-authored boundaries; per-edge wall controls; building-level constraints with unit options

**Visual:** Component hover interaction

---

## Slide 15 — Feature Highlight: Config for Townhomes
**Title:** Feature Highlight: Config for Townhomes

**Problem:**
- Higharc's builder portal product (Config) only supports SFHs on individual lots.
- Builders want to centrally manage options and require a dedicated workflow to enable or lock options per building, or per individual unit.
- The solution should be as tightly scoped as possible and work with existing patterns and concepts.

**Solution:**
- Introduce a new level in the location hierarchy: "Building"
- Buildings contain individual units/lots and allow builders to manage options at the building or individual unit level.
- The feature is light touch, and sets us up for future broader investments in the Config product.

**Visual:** Image carousel (5 slides) - workflow diagrams, AccountSettingsConfig, AddBuildingConfig, Building Level, OptionTemplate

---

## Slide 16 — Deep Dive: Showroom Updates for Townhomes (Feature Deep Dive 4)
**Title:** Showroom Updates for Townhomes
- Need to present one unit clearly while showing adjacency/shared walls
- Filtering modes: highlight current unit, dim others, isolate systems
- Critical for demo clarity and customer comprehension

**Visual:** Image carousel with 16 showroom slides

---

## Slide 17 — Next Steps for Townhome Initiative
**Title:** Next Steps for Townhome Initiative

**Current Focus:**
- Pushing team to deliver exceptional demo experience for 2/17 tradeshow
- Content creation and coordination with PMM, Sales and Marketing
- Q2 and Q3 roadmapping - anticipating growth and prioritization shifts

**Next Up:**
- Preparing for final big effort before Beta Phase (April)
- Design and usability reviews to polish rough workflows
- Feedback and progress check-ins with internal users and existing customers
- Anticipating Townhome workflow GA for all customers June/July

**Risks:**
- We hit MVP but fail to deliver exceptional working product
- Eng Staffing constraints force us to prioritize other initiatives
- Fail to provide proper guardrails and training guidance, limiting adoption

**Visual:** Placeholder

---

## Slide 18 — Reflections
**Title:** Reflections

**Things That Went Well:**
- One of the largest and most successful cross-squad initiatives in Higharc history.
- We've built strategic, sustainable solutions that scale beyond the Townhome use case or workflow.
- Personally really enjoyable. The project is the right combination of challenging, complex, exciting, and set up for success.

**Things I'd Do Differently:**
- Anticipate large chunks of scope and weigh pro/cons for greenlighting much earlier
- Get ahead of internal communication and marketing. Define the problem we're actually solving and communicate it clearly.
- Delegate more across partners. I'm in the middle of everything and often critical path for decisions, but my team is talented and can make great decisions without me.

**Visual:** Two feedback screenshots stacked vertically (feedback-carissa.png, feedback-jennifer.png)

---

# Visual priorities (where real screenshots matter most)
- Why Townhomes (Slide 5)
- Identifying the most critical problems (Slide 6)
- The product solution (Slide 12)
- Deep dives (Slides 13–16)
- Our Process (Slide 8)

# Copy rules (keep it sharp)
- Titles should fit on one line when possible
- Bullets: 6–10 words each
- Avoid paragraphs except appendix

