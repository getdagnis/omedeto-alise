# AGENTS.md — Alise in Tokyo

This document defines how AI agents should understand, extend, and evolve the **Alise in Tokyo** platform.

It explains:

- conceptual identity
- architectural direction
- interaction priorities
- technology migration path
- system boundaries
- content rules
- expansion logic
- long-term platform intent

Agents should treat this file as the **operational compass** for decision-making inside the repository.

---

## Platform Identity

**Alise in Tokyo** is not a traditional game.

It is a layered creative system evolving toward:

```txt
- sound playground
- character collector
- combo discovery engine
- profile identity platform
- story participation system
- social board network
- creator ecosystem
- persistent cyberpunk Tokyo night universe
```

Agents should preserve this trajectory when making decisions.

Avoid implementing features that push the platform toward:

- rhythm-game cloning
- chat-app cloning
- social-media feed cloning
- generic avatar collectors

The platform grows through **interaction → identity → community → world → ecosystem**

---

## Core Interaction Model

Primary interaction loop:

```txt
select character
→ trigger sound
→ discover combo
→ unlock feedback
→ gain credits
→ expand board
→ evolve profile identity
```

Agents must protect this loop from unnecessary complexity.

Interaction responsiveness always has priority over feature expansion.

---

## Tokyo Cyber Night Concept Layer

The entire platform exists inside a fictional setting: **A LIVING CYBERPUNK TOKYO NIGHT**

Important characteristics:

- neon atmosphere
- anime-inspired personality tone
- district identity differences
- sound-reactive environment feel
- quiet social presence rather than noisy chat dominance
- collectible emotional fragments instead of loud progression mechanics

Agents should treat atmosphere as a system constraint.

Every feature should feel like it belongs inside this world.

---

## Visual & Emotional Direction

Tone references:

- late-night Tokyo sidewalks
- metro platform ambience
- rain reflections
- Akihabara neon energy
- Shibuya crossing density
- convenience store glow at 02:00

UI should feel:

```txt
calm
neon
precise
layered
alive
```

Never noisy or overloaded.

Avoid dashboard-style layouts unless explicitly requested.

---

## Platform Structure Overview

System layers:

```txt
interaction layer
progression layer
identity layer
social layer
story layer
economy layer
creator layer
world layer
```

Agents should extend the **lowest incomplete layer first** before building higher ones.

Example:

Do NOT implement marketplace features before identity persistence exists.

---

## Repository Architectural Phase (Current)

Current stage:

```txt
offline-first prototype
```

Implemented technologies:

- React
- Vite
- TypeScript
- React Aria Components
- Sass modules

UI implementation default:

- `src/components-ui` is the default home for reusable UI primitives and shared UI patterns.
- Agents should prefer using existing `src/components-ui` components before creating new UI in `src/components`.
- Agents should extend `src/components-ui` only when the requested work clearly fits the existing UI library direction.

Agents must respect:

Accessibility-first component architecture.

Do not replace React Aria patterns unless justified.

Do not create ad hoc parallel UI primitives in `src/components` when the need belongs in the shared UI layer.

If the current `src/components-ui` library is insufficient, agents must explicitly report:

- what UI capability is missing
- why the current library cannot support it cleanly
- whether the gap is a primitive, composition pattern, styling-system gap, or interaction/state gap

Agents must not autonomously invent new library-level UI surfaces that define product UI language without surfacing the gap first.

Future tasks should treat deviation from `src/components-ui` as an exception that must be justified.

---

## Migration Direction (Planned)

Platform evolves gradually toward:

```txt
offline prototype
→ Supabase persistence
→ Sanity story engine
→ social graph layer
→ creator ecosystem
→ React Native expansion
→ persistent Tokyo universe
```

Agents must not prematurely introduce backend assumptions.

Persistence should remain abstractable.

---

## Slot System Logic

Board slots represent progression identity.

Expected evolution:

```txt
1 slot
→ 3 slots
→ 6 slots
→ 12 slots
```

Future boards include:

```txt
player characters

- friend characters
```

Agents must treat slots as identity surface, not layout decoration.

---

## Combo System Logic

Combos are discovery mechanics.

They evolve into:

```txt
unlockables
collectibles
story fragments
economy triggers
profile signals
```

Agents should structure combo logic as reusable schema objects.

Avoid hardcoding combo relationships.

---

## Credits Economy Logic

Credits represent forward motion energy.

Credits are earned through:

- combo discovery
- Ultra Mode challenges
- social visibility
- board ranking presence
- story participation
- weekly goals
- passive friend activity

Credits are spent on:

- slot unlocks
- sound packs
- combo packs
- cosmetics
- profile upgrades

Agents must treat economy as:

```txt
motivation infrastructure
```

not monetization infrastructure.

---

## Shop Architecture Expectations

Shop exists as dedicated route:

```txt
/shop
```

Shop responsibilities:

- distribute sound packs
- distribute combo packs
- distribute character upgrades
- distribute cosmetics

Agents must avoid embedding shop logic inside edit modals.

Shop is platform surface, not tool surface.

---

## Character Evolution Logic

Characters are long-term companions.

Characters may eventually support:

```txt
leveling
visual upgrades
sound expansion
capability modifiers
micro-story fragments
identity metadata
```

Agents should keep character schema extensible.

Never assume characters are static assets.

---

## Social Board System

Boards evolve from:

```txt
personal interaction surface
→ shared social presence surface
```

Future board logic includes:

- friend slot population
- ranking-based placement
- passive reward loops
- mix sharing
- gifting mechanics
- featured board signals

Agents must treat boards as **ambient multiplayer space**, not chat interface replacement.

---

## Ranking & Metadata Systems

Ranking systems provide prestige signals without pressure mechanics.

Possible ranking types:

```txt
global rankings
friend rankings
circle rankings
district rankings (future)
```

Metadata signals may include:

```txt
combo rarity index
board influence score
story participation weight
discovery contribution score
```

Agents should structure ranking systems as optional overlays.

Never mandatory progression gates.

---

## Story Engine Direction

Story system evolves gradually:

Phase 1:

```txt
static lore
character bios
district descriptions
```

Phase 2:

```txt
weekly story prompts
branch voting
rewarded participation
```

Phase 3:

```txt
community-authored fragments
animated panels
sound-reactive scenes
world timeline influence
```

Story content managed through:

```txt
Sanity CMS
```

Agents should not embed story text inside source files.

---

## Combo Card Ecosystem

Combo cards represent structured collectible interaction recipes.

Card packs may include:

```txt
Tokyo Streets Pack
Rain Pack
Metro Pack
Neon Pack
District Packs
Character Packs
Seasonal Packs
```

Cards may evolve into:

```txt
rarity tiers
animated variants
foil variants
district-exclusive unlockables
```

Agents must model cards as content-layer objects.

---

## Notification & Presence Engine

Future presence signals include:

```txt
friend triggered combo
board ranking change
story vote completed
district event unlocked
new pack released
```

Delivery channels:

```txt
HUD signals
activity timeline
push notifications (mobile phase)
```

Agents should avoid intrusive notification styles.

Signals must feel atmospheric.

---

## Content Curation Model

Platform identity depends on curated tone consistency.

Content sources:

```txt
admin-curated
seasonal releases
event releases
community contributions (moderated)
```

Agents must assume moderation layer always exists.

---

## User Generated Content Layer (Future)

Possible UGC categories:

```txt
sounds
combo packs
character skins
story fragments
visual overlays
profile themes
```

Moderation pipeline:

```txt
AI-assisted filtering
manual approval fallback
curation scoring
```

Agents must design storage structures compatible with moderation queues.

---

## Marketplace Layer (Future)

Marketplace supports creator participation.

Creators may publish:

```txt
combo packs
skins
animations
story modules
district themes
```

Marketplace requires:

```txt
ownership tracking
licensing metadata
approval pipelines
creator attribution
```

Agents must not assume marketplace exists yet.

Prepare schemas only when persistence layer exists.

---

## Tokyo District Expansion Logic

Future world structure may include:

```txt
Shibuya
Akihabara
Shinjuku
Metro Layer
Night Rooftops
Hidden Backstreets
```

Districts may affect:

```txt
sound palettes
story arcs
unlock conditions
seasonal events
visual overlays
```

Agents should keep environment logic location-aware where possible.

---

## Cross-Platform Expansion Direction

Future supported environments:

```txt
web platform
React Native mobile app
interactive installation builds
festival playable builds
gallery exhibition builds
```

Agents must keep logic portable across platforms.

Avoid browser-only assumptions unless required.

---

## Long-Term Platform Goal

Final identity target:

```txt
persistent cyberpunk Tokyo night
as a playable creative universe
```

Agents should treat every feature decision as movement toward this world.
