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

# Platform Identity

**Alise in Tokyo** is not a traditional game.

It is a layered creative system evolving toward:

```
sound playground

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

# Core Interaction Model

Primary interaction loop:

```
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

# Tokyo Cyber Night Concept Layer

The entire platform exists inside a fictional setting:

```
a living cyberpunk Tokyo night
```

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

# Visual & Emotional Direction

Tone references:

- late-night Tokyo sidewalks
- metro platform ambience
- rain reflections
- Akihabara neon energy
- Shibuya crossing density
- convenience store glow at 02:00

UI should feel:

```
calm
neon
precise
layered
alive
```

Never noisy or overloaded.

Avoid dashboard-style layouts unless explicitly requested.

---

# Platform Structure Overview

System layers:

```
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

# Repository Architectural Phase (Current)

Current stage:

```
offline-first prototype
```

Implemented technologies:

- React
- Vite
- TypeScript
- React Aria Components
- Sass modules

Agents must respect:

Accessibility-first component architecture.

Do not replace React Aria patterns unless justified.

---

# Migration Direction (Planned)

Platform evolves gradually toward:

```
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

# Slot System Logic

Board slots represent progression identity.

Expected evolution:

```
1 slot
→ 3 slots
→ 6 slots
→ 12 slots
```

Future boards include:

```
player characters

- friend characters
```

Agents must treat slots as identity surface, not layout decoration.

---

# Combo System Logic

Combos are discovery mechanics.

They evolve into:

```
unlockables
collectibles
story fragments
economy triggers
profile signals
```

Agents should structure combo logic as reusable schema objects.

Avoid hardcoding combo relationships.

---

# Credits Economy Logic

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

# Shop Architecture Expectations

Shop exists as dedicated route:

```
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

# Character Evolution Logic

Characters are long-term companions.

Characters may eventually support:

```
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

# Social Board System

Boards evolve from:

```
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

# Ranking & Metadata Systems

Ranking systems provide prestige signals without pressure mechanics.

Possible ranking types:

```
global rankings
friend rankings
circle rankings
district rankings (future)
```

Metadata signals may include:

```
combo rarity index
board influence score
story participation weight
discovery contribution score
```

Agents should structure ranking systems as optional overlays.

Never mandatory progression gates.

---

# Story Engine Direction

Story system evolves gradually:

Phase 1:

```
static lore
character bios
district descriptions
```

Phase 2:

```
weekly story prompts
branch voting
rewarded participation
```

Phase 3:

```
community-authored fragments
animated panels
sound-reactive scenes
world timeline influence
```

Story content managed through:

```
Sanity CMS
```

Agents should not embed story text inside source files.

---

# Combo Card Ecosystem

Combo cards represent structured collectible interaction recipes.

Card packs may include:

```
Tokyo Streets Pack
Rain Pack
Metro Pack
Neon Pack
District Packs
Character Packs
Seasonal Packs
```

Cards may evolve into:

```
rarity tiers
animated variants
foil variants
district-exclusive unlockables
```

Agents must model cards as content-layer objects.

---

# Notification & Presence Engine

Future presence signals include:

```
friend triggered combo
board ranking change
story vote completed
district event unlocked
new pack released
```

Delivery channels:

```
HUD signals
activity timeline
push notifications (mobile phase)
```

Agents should avoid intrusive notification styles.

Signals must feel atmospheric.

---

# Content Curation Model

Platform identity depends on curated tone consistency.

Content sources:

```
admin-curated
seasonal releases
event releases
community contributions (moderated)
```

Agents must assume moderation layer always exists.

---

# User Generated Content Layer (Future)

Possible UGC categories:

```
sounds
combo packs
character skins
story fragments
visual overlays
profile themes
```

Moderation pipeline:

```
AI-assisted filtering
manual approval fallback
curation scoring
```

Agents must design storage structures compatible with moderation queues.

---

# Marketplace Layer (Future)

Marketplace supports creator participation.

Creators may publish:

```
combo packs
skins
animations
story modules
district themes
```

Marketplace requires:

```
ownership tracking
licensing metadata
approval pipelines
creator attribution
```

Agents must not assume marketplace exists yet.

Prepare schemas only when persistence layer exists.

---

# Tokyo District Expansion Logic

Future world structure may include:

```
Shibuya
Akihabara
Shinjuku
Metro Layer
Night Rooftops
Hidden Backstreets
```

Districts may affect:

```
sound palettes
story arcs
unlock conditions
seasonal events
visual overlays
```

Agents should keep environment logic location-aware where possible.

---

# Cross-Platform Expansion Direction

Future supported environments:

```
web platform
React Native mobile app
interactive installation builds
festival playable builds
gallery exhibition builds
```

Agents must keep logic portable across platforms.

Avoid browser-only assumptions unless required.

---

# Long-Term Platform Goal

Final identity target:

```
persistent cyberpunk Tokyo night
as a playable creative universe
```

Agents should treat every feature decision as movement toward this world.
