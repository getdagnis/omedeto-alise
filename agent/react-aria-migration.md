# React Aria & Storybook Migration Plan

## Objective

Transition the entire application to a consistent, accessible component system based on `react-aria-components`. We will build this "Storybook-first," perfecting the look and feel of each component in isolation before integrating them into the main app.

The design aesthetic is **Electronic Tokyo Cyber Night**: deep dark indigo/purple backgrounds with vibrant glowing accents (Indigo/Purple default, Cyan, Pink, Yellow).

---

## Phase 1: Atomic UI Components (Storybook First)

We will build these foundational elements using `react-aria-components`, styling them with our custom CSS variables, and documenting them in Storybook.

1. **Button (`src/components/ui/Button.tsx`)**
   - **Purpose**: The core interactive element.
   - **Sizes**: `sm`, `md` (default), `lg`.
   - **Variants**: `primary` (glowing indigo/cyan), `secondary` (glass/outline), `destructive` (pink/red), `icon` (circular, icon-only).
2. **ToggleButton (`src/components/ui/ToggleButton.tsx`)**
   - **Purpose**: For boolean states (e.g., Favorite Heart, Mute Speaker, Featured Star).
3. **Checkbox & CheckboxGroup (`src/components/ui/Checkbox.tsx`)**
   - **Purpose**: Multi-selection in Admin Triage or selecting multiple sounds.
   - **Style**: Custom checked state with a cyan/indigo glow.
4. **TextField & SearchField (`src/components/ui/TextField.tsx`)**
   - **Purpose**: Text input for renaming characters/sounds, and a specialized variant for searching the Shop/Admin.
   - **Style**: Dark background, subtle border, glowing focus ring.
5. **ProgressBar / Meter (`src/components/ui/ProgressBar.tsx`)**
   - **Purpose**: To replace the custom `meterFill` logic in the Progression system.
   - **Style**: Segmented or continuous glowing tracks.
6. **TagGroup / Badge (`src/components/ui/TagGroup.tsx`)**
   - **Purpose**: Displaying read-only metadata (e.g., "BEAT", "CYBERPUNK", "CLEARED").
7. **ColorSlider / ColorSwatch (`src/components/ui/ColorPicker.tsx`)**
   - **Purpose**: For the character color scheme selector, upgrading from the simple button grid.

---

## Phase 2: Structural Components (Storybook First)

Grouping atomic components into complex, accessible structures.

1. **Card (`src/components/ui/Card.tsx`)**
   - **Purpose**: Standardized container with hover effects and glassmorphism.
   - **Variants**: `character` (large, vertical), `shopItem` (horizontal row), `adminRow` (dense).
2. **Tabs (`src/components/ui/Tabs.tsx`)**
   - **Purpose**: For switching views (e.g., "COLORS" vs "SOUNDS" in Edit Modal; Admin filter tabs).
   - **Style**: Animated underline or pill background for the active state.
3. **Modal & Dialog (`src/components/ui/Modal.tsx`)**
   - **Purpose**: Accessible overlay for `EditCharacterModal`, `Shop`, and sub-modals like the Image Picker.
   - **Features**: Built-in focus management, escape-to-close, and backdrop styling.
4. **Menu (`src/components/ui/Menu.tsx`)**
   - **Purpose**: For dropdowns (e.g., the main hamburger menu, or contextual actions on a sound card).

---

## Phase 3: Layout Containers (App Integration)

Standardizing the macro-structure of the app.

1. **BottomNav (`src/components/ui/BottomNav.tsx`)**
   - **Purpose**: Refactoring the current context-aware bottom bar using standardized Buttons and structural logic.
2. **AppHeader (`src/components/ui/AppHeader.tsx`)**
   - **Purpose**: Creating a reusable top bar for standalone pages (like the Shop and Admin views).

---

## Phase 4: App Integration (The "Swap")

Once a component is approved in Storybook, we incrementally replace existing code in the live app to minimize breakages.

1. **Step 1: Replace Buttons & Icons**: Swap all raw `<button>` elements with `<Button>` or `<ToggleButton>`. (High impact, low risk).
2. **Step 2: Upgrade Inputs**: Replace native `<input>` and `<select>` in the Admin panel with `<TextField>` and custom styled menus.
3. **Step 3: Refactor Layouts**: Convert `EditCharacterModal` and `Shop` to use the new `<Modal>`, `<Tabs>`, and `<Card>` components.
4. **Step 4: Advanced Components**: Integrate the `ColorPicker` and `<ProgressBar>`.

---

## Next Immediate Steps

1. Set up the base CSS variables for the "Electronic Tokyo" theme to be consumed by these components.
2. Create the `Button` component (copying/adapting from `agent/react-aria-starter/src/Button.tsx`).
3. Write `Button.stories.ts` and verify it looks perfect in the Storybook UI before moving to the next component.
