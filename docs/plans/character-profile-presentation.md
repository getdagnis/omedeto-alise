# Alise in Tokyo: Character Profile Walkthrough

This document outlines the structural components and functional mechanics of the Character Profile interface, moving from the top of the screen to the bottom.

## 1. The Header: Identity and Status

- **Dynamic Theming:** The background and accent colors of the profile view inherit the specific hex codes assigned to the selected character (e.g., Alise utilizes a magenta and cyan palette).
- **User Rank Display:** The top of the screen displays the user's current progression level directly associated with the mixing feature (e.g., "LEVEL 3 SOUNDMIXER").
- **Navigation:** A "Back to Grid" button is positioned at the top left to return the user to the main character selection screen.

## 2. The Constellation: Audio Mixing Interface

- **Visual Layout:** A grayscale background image of the selected character sits in the center. Surrounding this image is a grid of selectable UI components called "Sound Chips."
- **Interaction:** Each Sound Chip represents an individual audio stem (beat, synth loop, voice line). Tapping a chip toggles the audio track on or off. Active chips are highlighted using the character's primary color.
- **Audio Engine (Current):** The system supports overlapping playback of multiple audio stems simultaneously.
- **Audio Engine (Upcoming):** We are implementing spatial audio integration, allowing specific stems to have predefined 3D positional data (panning, reverb, and distance simulation).

## 3. Combo Discovery: The Collection Grid

- **Structure:** Located below the Constellation is a grid displaying a set of "Combo Cards."
- **State Mechanics:** By default, undiscovered cards display a locked state with obscured titles.
- **Trigger Logic:** The system continuously monitors the array of active Sound Chips. When the array matches a predefined combination (e.g., activating 'synth-rise', 'synth-space', and 'synth-night' simultaneously), a specific Combo Card is unlocked.
- **Card Data:** An unlocked card reveals its Title (e.g., "Cosmic!"), Rarity tier (Common, Rare, Ultra), and a short text description.
- **Future Integration:** Unlocked Combos will act as prerequisites for accessing character-specific animations or advanced sound packs.

## 4. Milestones: Achievement Tracking

- **List View:** A vertical list displaying specific milestones the user can achieve within the app.
- **Unlock Criteria:** Achievements are tied to specific user analytics. For example, the "Tokyo Night" milestone is unlocked when total mixing time reaches 60 minutes. The "Sound Collector" milestone unlocks when 50 unique sounds have been added to the library.
- **Visual Feedback:** Unlocked achievements are displayed at full opacity with an accompanying icon, while locked achievements remain dimmed.

## 5. The Social Layer: Asynchronous Sharing (Upcoming)

- **Mix Capacity Meter:** A progress bar displaying the number of active sounds relative to the user's current maximum allowed limit.
- **Export Function:** A share button generates a unique URL containing a serialized state of the user's current active sounds and selected character.
- **Web Interface:** Opening the URL in a web browser renders a lightweight, playable "Combo Card." It automatically plays the specific mix and displays the character's aesthetic.
- **Forking Mechanic:** Users viewing a shared link have the option to import that specific mix state into their own app instance to modify it and reshare.

## 6. The Shop: Ecosystem Economy

- **Access Point:** A secondary navigation button at the bottom of the profile leads to the Shop interface.
- **Currency System:** Users accrue a virtual token balance through interactions such as unlocking Combos or reaching Milestones.
- **Transactions:** Tokens are exchanged for new Sound Chips, character color schemes, or voice packs. Direct fiat microtransactions are also supported for token purchases.

---

**Summary:**
The Character Profile combines an overlapping audio player with state-based collection mechanics, metric-driven achievements, and a serialized URL sharing system. These features integrate directly with an in-app virtual economy.
