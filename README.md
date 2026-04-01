# Alise in Tokyo

Alise in Tokyo is an offline-first cyberpunk Tokyo sound playground where characters, sound combinations, boards, and atmosphere gradually turn into identity.

It started as a personal interactive soundboard and is evolving into a calmer kind of social creative platform: character-led, combo-driven, neon at night, and built around ambient presence rather than noisy feed logic.

Current status: early prototype.

## Run Locally

```bash
npm install
npm run dev
```

Optional checks:

```bash
npm run lint
npm run build
```

## Built With

- React 19
- Vite
- TypeScript
- React Aria Components
- Sass

## Project Structure

- `src/components-ui`: preferred reusable UI library and future default for shared UI primitives
- `src/components`: app/domain components tied to current screens and flows
- `src/screens`: top-level screen surfaces such as the UI sandbox
- `src/hooks`: reusable client-side logic
- `src/styles`: global theme and shared styling layers
- `docs`: concept, roadmap, and implementation guidance

## Notes For Contributors

- The project is currently offline-first. Future Supabase work should remain persistence-agnostic at the domain layer until persistence is intentionally introduced.
- Story and world content are expected to move toward a managed content system later. Do not treat hardcoded story text as the long-term pattern.
- React Native transition should remain possible. Favor portable logic boundaries, avoid browser-only assumptions unless required, and avoid coupling domain behavior to DOM-specific helpers.
- Prefer `src/components-ui` for new shared UI work. If the existing UI library is missing a needed primitive or pattern, surface the gap explicitly instead of inventing a parallel system.

## Further Context

- [`docs/CONCEPT.md`](docs/CONCEPT.md): abstract world and project concept
- [`docs/ROADMAP.md`](docs/ROADMAP.md): staged platform evolution
- [`docs/AGENTS.md`](docs/AGENTS.md): implementation rules and project guardrails
