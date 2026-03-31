# ROADMAP.md — Alise in Tokyo (Unified Vision Roadmap)

This document defines the **long-term evolution path** of _Alise in Tokyo_ — from a small offline interaction prototype into a scalable cyberpunk Tokyo social creative platform and persistent online universe.

## This roadmap combines:

- existing prototype logic
- previously defined repository roadmap ideas
- platform-scale architecture direction
- social layer expansion
- creator ecosystem vision
- economy system evolution
- open-ended future opportunities

## Purpose:

Guide both **humans and agents** toward consistent platform decisions across iterations.

This roadmap intentionally contains **more possibilities than commitments**.

It defines direction, not constraints.

---

## Platform Core Identity

Alise in Tokyo is evolving into:

- sound playground
- character collector
- combo discovery system
- story engine
- social board network
- profile identity space
- creator economy platform
- cyberpunk/Tokyo/anime global creative universe

The roadmap expands outward from **interaction → identity → community → world → ecosystem**.

---

## Stage 0 — Offline Interaction Prototype

**Goal: validate interaction before social functions exist.**

### Includes

Core soundboard interaction:

- slot selection (initially only 1 of 6 is unlocked)
- sound triggering
- combo structure foundation
- character edit modal
- silhouette locking
- accessibility-first components
- Storybook-driven UI system
- shop UI prototype
- goals UI prototype
- HUD experiments
- Ultra Mode concept layer

### Why this stage matters

- Proves: **interaction is fun without backend**
- Ensures platform grows from **playability**, not infrastructure assumptions.

### Technology Layer

Frontend:

- React
- Vite
- TypeScript
- React Aria Components
- Sass modules
- Storybook

---

## Stage 1 — Local Progression Loop

### Goal

Turn sandbox interaction into repeatable motivation loop.

### Includes

Character XP:

- leveling via usage
- combo discovery rewards
- silhouette reveals
- slot unlock ladder

Board capacity progression: **1 → 3 → 6 → 12 characters**

Offline Mode: **6 starter characters unlocked immediately**

Online Mode: **progression unlock path begins at 1**

Ultra Mode: **challenge-based reward engine**

Credits prototype system: **local-only economy simulation**

### Why this stage matters

Introduces: **motivation** before backend complexity exists.

---

## Stage 2 — Credits Economy Layer (EARN / SHOP)

### Goal

Introduce forward momentum through resource flow.

### Credits Earned From

- combo discovery
- Ultra Mode challenges
- story engagement
- featured board placements
- social multipliers
- weekly goals
- friend activity bonuses
- passive presence rewards

Example:

```txt
# Alise triggered combo on Mark's board
# + 50 credits
```

Live micro-feedback loops encouraged.

### Credits Spent On

- slot unlocks
- combo packs
- sound packs
- character upgrades
- cosmetics
- profile themes
- story interaction boosts

### Shop Route

/shop

Centralized marketplace:

moves sounds outside edit modal.

Future:

limited-time packs
seasonal releases
event-based drops

---

## Stage 3 — Profile Identity Layer

### Goal

Make player profile the center of experience.

Profiles display:

- character collection
- unlocked combo cards
- achievements
- featured mixes
- wallet summary
- activity signals
- board reputation score

Optional extensions:

profile banners
neon theme skins
animated avatars
status loops
micro-story panels

Why this matters:

Creates

ownership

Ownership creates retention.

---

## Stage 4 — Character Evolution System

### Goal

Turn characters into progression companions.

Characters gain:

- levels
- additional sounds
- cosmetic upgrades
- unlockable visual variants
- capability modifiers
- passive bonuses

Possible capability examples:

combo multiplier boost
faster credit gain
story interaction bonuses
friend-board visibility bonus

Future expansion option:

Characters carry:

custom micro-story fragments
player-written notes
relationship tags

Turning them into identity objects.

---

## Stage 5 — Social Boards Layer

### Goal

Introduce ambient multiplayer presence.

Board composition:

your characters

- friends' active characters

Dynamic slot filling based on:

- activity
- relationship strength
- ranking performance

Social Features

Possible implementations:

- comments on boards
- reactions to combos
- likes on characters
- shared mixes
- gifting system
- shipping mechanics (item transfer between players)
- live chat (optional later stage)

Featured Boards System

Players earn credits based on:

how often their characters appear
on friends' boards

This creates passive progression loop.

---

## Stage 6 — Rankings & Metadata Layer

### Goal

Introduce measurable presence.

Possible ranking types:

Global:

top mixers
top collectors
top combo discoverers

Social:

friend leaderboard
circle leaderboard
local cluster leaderboard

Experimental metadata metrics:

board influence score
combo rarity index
discovery contribution score
story participation weight

Purpose:

Enable prestige loop without disrupting casual players.

---

## Stage 7 — Stories Platform (Cyberpunk Tokyo)

### Goal

Turn platform into narrative world.

Initial Stories Section

Includes:

- character bios
- Tokyo districts
- faction fragments
- atmospheric lore drops

Later expansion:

Weekly story participation system

Users can:

```txt
submit story fragments
vote story branches
unlock narrative rewards
```

High-ranking story contributors receive:

```txt
credits
visibility
rare unlocks
world influence signals
```

Future animation direction:

```txt
low-frame anime sequences
sound-reactive panels
motion manga transitions
```

---

## Stage 8 — Combo Card Ecosystem

### Goal

Introduce collectible interaction recipes.

Admin-curated packs:

Examples:

Tokyo Streets Pack
Rain Pack
Metro Pack
Neon Pack
District Packs
Character Packs
Seasonal Packs

Each pack includes:

- 3–6 combos
- unlock conditions
- preview interactions
- visual card identity

Future extension:

rarity tiers
foil variants
animated cards
district-exclusive cards

---

## Stage 9 — Curated Content Release Engine

### Goal

Maintain aesthetic consistency during growth.

Admin tooling supports:

- sound curation
- combo pack publishing
- weekly drops
- event scheduling
- seasonal Tokyo changes

Example live events:

```txt
Shibuya rain week
Akihabara neon festival
Metro midnight transmissions
```

Ensures platform identity remains coherent.

---

## Stage 10 — Supabase Identity Layer Migration

### Goal

Persist player world across devices.

Migration includes:

```txt
authentication

progression persistence

credits ledger

inventory tables

story participation tracking

board relationships

vote systems
```

friend graph

storage layer

Enables:

true multiplayer presence

---

## Stage 11 — Sanity Story Engine Integration

### Goal

Enable structured narrative expansion.

Sanity manages:

- story nodes
- character lore
- Tokyo districts
- event metadata
- faction arcs

Supabase manages:

votes
participation
rewards
ownership signals

Together:

story becomes interactive infrastructure

---

## Stage 12 — User Generated Content Layer

### Goal

Allow players to extend the world safely.

Possible UGC types:

```txt
sounds

combo packs

character skins

story fragments

visual overlays

profile themes
```

Moderation pipeline:

AI-assisted filtering
manual approval fallback
curation scoring

Purpose:

```txt
scale content without scaling team size linearly.
```

---

## Stage 13 — Marketplace Layer

### Goal

Enable creator economy participation.

Creators can publish:

```txt
combo packs
skins
animations
story modules
district themes
```

Platform manages:

```txt
ownership

licensing metadata

approval pipelines

creator attribution
```

Possible monetization directions:

```txt
credits marketplace
creator royalties
premium district passes
seasonal creator drops
```

---

## Stage 14 — Notification & Presence Engine

### Goal

Make Tokyo feel alive continuously.

Example notifications:

```txt
friend triggered combo
character ranked on board
story vote completed
district event unlocked
pack released
```

Delivery channels:

```txt
in-app HUD signals
activity timeline
push notifications (later stage)
```

Creates:

```txt
ambient participation loop
```

---

## Stage 15 — React Native Expansion Layer

### Goal

Support daily interaction environments.

Mobile enables:

```txt
habit formation
background presence
push-based engagement
offline mix creation
```

Shared architecture target:

component contract reuse
shared schema logic
Supabase auth sync

---

## Stage 16 — Persistent Tokyo Universe Layer

### Goal

Transform platform into evolving digital place.

Possible world-scale systems:

```txt
district-based sound ecosystems

seasonal world timeline

character arc evolution

global community story outcomes

event-driven atmosphere changes

weather-linked audio palettes
```

Example:

```txt
metro shutdown event week
rain signal frequency shift
festival audio overlays
night-only district unlocks
```

Creates:

```txt
return rituals
```

Rituals create culture.

Culture creates longevity.

---

## Stage 17 — Open Possibility Expansion Layer

These are intentionally exploratory directions.

They are not commitments.

They guide architectural flexibility decisions.

Possible future directions:

```txt
# Collaborative Boards

- shared squad editing
- duo mix sessions
- live combo creation rooms

# Tokyo District Map Navigation

- visual navigation between districts
- district-exclusive unlockables
- sound geography system

# Faction System

- district alliances
- story voting influence groups
- identity-based progression modifiers

# Seasonal Identity Tracks

- winter Tokyo tone shift
- summer neon festival overlays
- night-cycle progression themes

# Sound-Reactive UI

- HUD glow changes
- profile animation states
- district UI resonance layers

# AI-assisted Combo Discovery

- suggested combos
- style-based discovery hints
- creative assistant tools

# Creator Tools SDK

- community-built pack generators
- visual mod kits
- story scripting templates

# Cross-platform Universe Bridges

- web
- mobile
- interactive installation versions
- gallery exhibition builds
- festival playable builds
```

---

## Final Vision Direction

The final trajectory is not a single feature.

It is the platform's identity:

### Cyberpunk Tokyo Night as a global creative universe

Everything in the roadmap supports movement toward that goal.
