# B&R Food-Tech Quiz — Kiosk

Offline touch quiz for a vertical portrait TV. React + Vite + Tailwind,
hash routing, Framer Motion, React Icons.

The UI is laid out on a fixed **1080 x 1920 (9:16)** canvas and scaled to fit
whatever panel it runs on, so the design never reflows or distorts.

## Run it

```bash
npm install
npm run dev        # development
npm run build      # produces dist/ and br-quiz-kiosk.zip
npm run build:only # dist/ without the zip
npm run preview    # serve the built dist/ locally
```

`npm run build` also writes **`br-quiz-kiosk.zip`**, the deploy bundle. It
contains the contents of `dist/` with `index.html` at the top level, so it
unpacks straight into XAMPP's `htdocs` with no extra folder.

> The folder name contains `&`, which breaks the npm/npx shims on Windows.
> If `npm run build` fails, call Vite directly:
> `node node_modules/vite/bin/vite.js build`

## Editing the questions

Everything lives in **`public/data/questions.json`**. It is plain JSON and is
*not* bundled, so on the kiosk you can edit `dist/data/questions.json` in
Notepad, refresh the screen, and the change is live. No rebuild, no internet.

```jsonc
{
  "config": {
    "questionsPerRound": 15,     // optional: ask this many. Omit it and every
                                 // visitor is asked the whole file.
    "shuffleQuestions": true,    // ask the bank in a random order each round
    "shuffleOptions": true,      // also shuffle A/B/C/D within a question
    "showAnswerFeedback": true,  // colour + sound on tap, answer revealed after
    "idleResetSeconds": 90       // untouched this long -> back to start (0 = off)
  },
  "questions": [
    {
      "id": 1,
      "question": "What does CRA stand for?",
      "options": ["Cyber Risk Assessment", "Cyber Resilience Act", "…", "…"],
      "answer": 1
    }
  ]
}
```

**`answer`** is the 0-based index of the correct option, so `0` = A, `1` = B,
`2` = C, `3` = D. A letter (`"B"`) also works if you find that easier.

To **add** a question, copy a block and append it. To **remove** one, delete
its block. To **edit** one, change the text. To **retire** one without losing
it, add `"enabled": false` to its block — JSON has no comments, so this is how
a question is parked in the file but never asked.

The file currently holds **29 questions**. How many each visitor is asked is
set by `questionsPerRound`, and the settings work together:

- `questionsPerRound` sets how many are asked. It is clamped to how many
  questions the file actually contains, so a leftover number can never ask for
  more than exist. Omit it to ask all of them.
- `shuffleQuestions` picks that many *at random* rather than the first N in
  file order, so asking 15 of 29 gives each visitor a different set.
- `shuffleOptions` reorders A/B/C/D within each question. The correct answer
  follows its option, so scoring stays right.

A question with a missing field or an out-of-range `answer` is skipped with a
console warning rather than crashing the kiosk. If the whole file is invalid,
the screen shows a readable error instead of a blank page.

Avoid two identical options in one question — it makes the answer ambiguous.

### On the kiosk (XAMPP)

Copy `dist/` into XAMPP's `htdocs` (a subfolder is fine — the build uses
relative paths) and open it in the browser. To change the quiz afterwards:

1. Edit `htdocs/<your-folder>/data/questions.json` in Notepad.
2. Save.
3. Refresh the screen.

That is the whole loop — no rebuild, no Node, no internet. The questions are
fetched fresh on every load, so a saved edit always shows up rather than being
served from Apache's cache.

Keep `public/data/questions.json` in step with anything you change on the
kiosk. It is the source copy, and the next `npm run build` overwrites `dist/`.

## Answer feedback

Tapping an option colours that option straight away and plays a sound — a
chime for correct, a buzzer for wrong. The correct answer is then revealed a
moment later, rather than at the same instant, so the visitor sees what they
picked before the answer appears beside it. Next stays disabled until the
reveal finishes.

Set `"showAnswerFeedback": false` in the config to turn the whole thing off,
sounds included. The sound files live in `src/assets/sounds/`; the delays are
`REVEAL_DELAY` at the top of `src/screens/Quiz.jsx`.

Audio is best-effort: if the kiosk has no sound output, or the browser blocks
playback, the quiz carries on silently rather than erroring.

## Images

The brand artwork lives in `src/assets/` and is bundled at build time:

| File                    | Where it appears                          |
| ----------------------- | ----------------------------------------- |
| `home_bg_design.png`    | Start screen background, full bleed       |
| `quiz_right_design.png` | Quiz and Result, top-right curved panel   |
| `trophy.png`            | Result screen                             |

These are fixed design assets, not operator content, so changing one means
editing the file and rebuilding. Only `data/questions.json` is meant to be
edited on the kiosk.

## Screens

| Route      | Screen                                        |
| ---------- | --------------------------------------------- |
| `#/`       | Start / attract screen                        |
| `#/quiz`   | One question at a time, with Back and Next    |
| `#/result` | Score, verdict, Play Again and Back to Home   |

Hash routing (`createHashRouter`) is deliberate: the kiosk serves static files
with no server rewrites, so `#/quiz` always resolves even on a hard refresh.

## Source layout

| Folder            | What lives there                                          |
| ----------------- | --------------------------------------------------------- |
| `src/routes/`     | Route table, paths, and the router instance                |
| `src/app/`        | Kiosk shell: layout, boot and error message                |
| `src/screens/`    | One file per screen, content only                          |
| `src/components/` | Reusable pieces: stage, buttons, brand chrome              |
| `src/state/`      | Quiz context provider and its hook                         |
| `src/hooks/`      | Shared behaviour hooks, e.g. the idle reset                |
| `src/data/`       | Loading and validating the question bank                   |

Adding a screen is three steps: a file in `src/screens/`, a path in
`src/routes/paths.js`, and an entry in `src/routes/routes.jsx`. `main.jsx`
never changes.

## Kiosk notes

- Scrolling, text selection, pinch-zoom and long-press menus are disabled.
- After `idleResetSeconds` without a touch, the app returns to the start
  screen so the next visitor gets a clean run.
- `base: './'` in `vite.config.js` keeps asset paths relative, so `dist/` can
  be served from any folder.
- Serve `dist/` over http (any static server). Opening `index.html` via
  `file://` will not work, because the browser blocks the `fetch` of
  `questions.json`.
- Launch Chrome/Edge in kiosk mode pointed at the local URL, e.g.
  `chrome.exe --kiosk --app=http://localhost:8080`.
