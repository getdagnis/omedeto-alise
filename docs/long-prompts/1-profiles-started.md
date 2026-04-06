# Character System: ALISE Profile Implementation

> **Note:** User created a snippet for JSX changes: `{/* user note: keep next line changes or ask */}`

---

## Overview

This document outlines the user journey and technical requirements for the character system, starting with the main character **ALISE**. The approach moves from larger-picture structural changes to smaller UI tweaks.

### Development Guidelines

- **Larger picture changes**: More room for UI improvisation
- **Smaller picture tweaks**: More specific instructions, less improvisation
- **State management**: Prefer Zustand for state management, or Context API for smaller things

---

## User Journey: ALISE Main Character

### 1. Initial User Greeting

A new user is greeted by:

- **One main character** (always ALISE at first, later editable)
- **4 additional hidden/empty character shells**

### 2. ALISE Profile Accessibility

- Main character (ALISE) has an editable profile
- She is already set to a unique "character type" named **ALISE**
- When user clicks on ALISE, they are **NOT** asked to "first select an identity..." (unlike with anonymous characters)
- **Note:** Updated text + made it larger in Notice modal — keep this change

### 3. ALISE's Constellation Cloud Setup

ALISE comes with a pre-configured constellation cloud:

- **Total sounds**: 24 (or 32, but start with 24)
  - Make this a `const` variable at the top for quick access
- **Preselected sounds**: 6 initially selected
- **Sound sources**:
  - 18 sounds: Simulated user randomly selected ones
  - 6 sounds (all selected): From a combo package

#### Combo Package: "Tokyo Rises"

Contains:

1. "fly me"
2. "synth rise"
3. "glow"

(One more combo — create one yourself)

#### Visual Enhancement (Future Idea)

> When all sounds from one combo are selected, connect/group them via a dotted line or similar visual indicator. Note this for later if not a trivial solution.

### 4. Sound Selection in Constellation

- From all 24 visible sounds, ALISE can select/highlight **up to 6 sounds**
- She is always **level 2** from the beginning

### 5. Apply to Stage

When "Apply to Stage" button is pressed:

- All selected sounds are applied to ALISE's character on the stage
- Not all sounds in the constellation, which is sort of a draft, middle stage, but just the ones highlighted
- When added to stage they are **NOT ACTIVATED yet!**
- They run the flash notification when stage is changed and becomes visible
- **Note:** No tooltip about activation when just added, only when user starts interacting without activating

### 6. Character Card Logic

- The existing character card logic takes over from here
- This logic is already pretty much perfected

---

## Combo System Specifications

### A. Double-Click Selection

- Double-clicking a sound that is in a combo selects **all sounds from that combo** (if present on the same character)
- **Activates all** (if the clicked one was inactive) or **deactivates one** (if the clicked one was active)

### B. Combo Indicators

- Combo sounds should have a small `*` or a smaller/slightly more interesting symbol next to them
- Barely noticeable, but a hint for those "who know"

### C. Combo Universality

- Combos are universal
- **Initial scope**: Local scope universal (built-in combos and user-made localStorage combos)
- Available for every character
- **Later**: Available for all application users when published
- **Publishing a combo will earn you money**

### D. Combo Ownership

- Combos you create: You own as both **creator** and **owner** (technically)
- Combos you "purchase" or "obtain": You own as **owner only**

### E. Official/Initial Combos

- All official/initial combos will have **ALISE as an author**
- For now at least; later there might be more admin names

### F. Combo Uniqueness (Future)

- You will not be able to create two combos with the exact same sounds
- At least one sound will have to differ

### G. Combo UI Display

- Combos appear as a **vertical list of cards** in the constellation panel
- **Position**: Over the constellation, from top right downwards
- **Proportions**: About 4rem to 6rem
- **Preselected choice of images** when creating one (for now, just a color box)
- **When clicked**: Expands towards right showing:
  - Combo title
  - List of sounds
  - Author
  - Author comments

---

## Character Type Limitations

- Character types per user will be **limited to one**
- As long as ALISE is ALISE, no other ALISE's can be chosen
- ALISE's images are locked
- ALISE's name is locked
- Even if the user changes name/image for their ALISE character — it is still ALISE's character

### Available Actions

- **"Unlink from..."** button
- **"Reset character"** button

---

## Next Steps

After testing and commenting on ALISE's user journey, move on to:

- Other characters
- Sound library
- UI refinements

---

_Sounds like a lot? Let's tackle it step by step!_
