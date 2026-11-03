# Repository Guidelines

## Project Structure & Module Organization

The app is a Vite-powered React and TypeScript project. `src/` contains the UI, shared types, components, Canvas player, motion and audio engines. `scene_engine/` contains the local parser, analyzer, director, timeline and reusable templates. `server.ts` provides the Express API. `tests/`, `examples/`, and `docs/` contain automated checks, a sample script and engine documentation. Static HTML and deployment settings live in the root.

## Build, Test, and Development Commands

Run `npm install` to install dependencies.

- `npm run dev` starts the local server through `tsx server.ts`.
- `npm run build` creates the production Vite bundle in `dist/`.
- `npm run preview` serves the built bundle locally for review.
- `npm start` runs the server in its production-style mode.
- `npm run lint` runs TypeScript checking with `tsc --noEmit`.
- `npm test` runs parser, analyzer and timeline tests with Node's test runner.

`npm run dev` serves the app and local `/api/scene-engine/generate` endpoint.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Follow the existing two-space indentation and keep JSX readable. Use `PascalCase` for component files and component names (for example, `ShowreelCanvasStage.tsx`), `camelCase` for variables and functions, and descriptive names for engine modules. Reuse shared types from `src/types/` and keep presentation components in `src/components/`. No separate formatter or lint configuration is present; `npm run lint` is the available static check.

## Testing Guidelines

Tests use Node's built-in `node:test` runner through the existing `tsx` dependency. Place tests under `tests/` with the `*.test.ts` suffix. Run `npm test`, `npm run lint`, and `npm run build` when validating changes.

## Commit & Pull Request Guidelines

Git history could not be inspected in this environment, so no repository-specific commit convention is established. Use short, imperative commit subjects (for example, `Improve scene inspector controls`). Pull requests should explain the user-visible change, note relevant validation commands and results, link related issues when available, and include screenshots or a short recording for UI changes.

## Security & Configuration

Use `.env.example` as the template for local environment variables; keep real credentials in an untracked `.env` file and never commit secrets. Review `.gitignore` before adding generated output or local configuration.
