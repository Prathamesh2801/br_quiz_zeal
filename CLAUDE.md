# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Offline touch-screen quiz kiosk for a vertical portrait TV (B&R Food-Tech). React 19 + Vite 8 + Tailwind 4 + Framer Motion, no backend. The build output in `dist/` is copied to the kiosk PC and served by any static http server.

## Commands

```bash
npm install
npm run dev      # dev server
npm run build    # -> dist/
npm run preview  # serve the built dist/
npm run lint     # eslint (flat config, dist/ ignored)
```

The directory name contains `&`, which breaks the npm/npx shims on Windows. If `npm run build` fails for that reason, call Vite directly: `node node_modules/vite/bin/vite.js build`.

There is no test suite.

## Architecture

**Fixed-canvas layout.** [Stage.jsx](src/components/Stage.jsx) renders every screen inside a hard-coded 1080x1920 box and applies a CSS `scale()` computed from the window size. There are no media queries and no responsive layout anywhere — all sizes in the screens are absolute pixels against that canvas (e.g. `text-[64px]`). Keep new UI in absolute px; do not introduce breakpoints.

**Layering.** `main.jsx` only mounts the tree. Routing lives in [src/routes/](src/routes/) (`paths.js` holds every path string, `routes.jsx` the table, `router.jsx` the instance); the kiosk shell lives in [src/app/](src/app/); screens in `src/screens/` render content only and assume the stage, the quiz state and the boot/error handling are already in place. A new screen is a file in `src/screens/`, a path in `paths.js` and an entry in `routes.jsx` — `main.jsx` should not need to change.

**Hash routing.** [router.jsx](src/routes/router.jsx) uses `createHashRouter` deliberately: the kiosk serves static files with no server rewrites, so `#/quiz` survives a hard refresh. Do not switch to a browser router. Routes: `#/` Start, `#/quiz` Quiz, `#/result` Result, all children of [AppLayout.jsx](src/app/AppLayout.jsx).

**State.** One context, no external store. [QuizProvider.jsx](src/state/QuizProvider.jsx) holds the bank, the current round, and the answers array; [quizStore.js](src/state/quizStore.js) holds the context object and the `useQuiz` hook. They are split so the provider file exports only components and Fast Refresh keeps working — preserve that split.

**Data is deliberately not bundled.** [loadQuiz.js](src/data/loadQuiz.js) fetches `public/data/questions.json` at runtime via `import.meta.env.BASE_URL`, with a `?t=` cache-buster, so an operator can edit `dist/data/questions.json` in Notepad on the kiosk and refresh, with no rebuild and no internet. The cache-buster matters: without a unique URL, Apache/XAMPP can answer the reload with its own `304 Not Modified` and the operator sees stale questions after saving. Never `import` the JSON — that would bundle it and break the whole workflow. Anything an operator may need to change at the venue belongs in `public/`, not `src/`.

**Editing questions in production.** `dist/` is self-contained: serve it from XAMPP's `htdocs`, then add, remove or reword entries in `dist/data/questions.json` and refresh the screen. `questionsPerRound` is optional — leave it out and every visitor is asked the whole file, so adding or deleting a question needs no second edit; set it to ask only the first N. It is clamped to the bank size, so a stale value left after deleting questions cannot over-ask. A malformed row is skipped with a `console.warn` rather than taking the kiosk down. Keep `public/data/questions.json` in step with any kiosk edit, or the next build will overwrite it.

**Brand art is bundled, not runtime data.** The background/decorative images (`home_bg_design.png`, `quiz_right_design.png` in [src/assets/](src/assets/)) are fixed brand-kit art, not operator content, so they are imported as normal ES modules and let Vite hash and bundle them — unlike `public/data/questions.json`. Start renders `home_bg_design.png` full-bleed in place of a separately composed photo band and thumbnail stack; Quiz and Result render `quiz_right_design.png` for the top-right curved panel, plus the code-drawn `CornerWave` for the bottom-right orange swoosh (the PNG only covers the top corner). See [docs/B&R_Quiz_assets/](docs/B&R_Quiz_assets/) for the source mockups.

**Failure behaviour is a product requirement.** A malformed question row is skipped with a `console.warn` rather than throwing (`validateQuestion`); only a totally unusable file throws, and [AppLayout.jsx](src/app/AppLayout.jsx) renders a readable `BootMessage` instead of a blank screen. Keep that shape when touching the loader. `answer` accepts a 0-based index or a letter (`"B"`).

**Whole bank per round, by default.** `shuffleQuestions` changes only the order, never the count (see *Editing questions in production* above for `questionsPerRound`). `?limit=5` before the `#` in the URL trims the round for a one-off test without editing the file. The Quiz screen shows a plain "Question N of M" counter rather than a segmented progress bar, which would not fit 30 segments on the canvas.

**Kiosk behaviours** that are easy to break: [useIdleReset.js](src/hooks/useIdleReset.js) returns to the start screen after `config.idleResetSeconds` of no input; `index.css` disables scrolling, selection, pinch-zoom, tap highlight and long-press callout; `index.html` locks the viewport; `base: './'` in [vite.config.js](vite.config.js) keeps `dist/` relocatable.

**Theming.** Brand colours and the font live as `@theme` tokens in [index.css](src/index.css) (`--color-br-*`). Use the generated `br-*` Tailwind classes rather than raw hex values in components.

Note `dist/` is a build artifact and is git-ignored — run the build to produce it, and do not hand-edit it here. Editing `dist/data/questions.json` directly is expected on the kiosk itself (see *Editing questions in production*), but those edits must be mirrored back into `public/data/questions.json` or the next build discards them.
