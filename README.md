# B&R Food-Tech Quiz — Kiosk

Offline touch quiz for a vertical portrait TV. React + Vite + Tailwind,
hash routing, Framer Motion, React Icons.

The UI is laid out on a fixed **1080 x 1920 (9:16)** canvas and scaled to fit
whatever panel it runs on, so the design never reflows or distorts.

## Run it

```bash
npm install
npm run dev      # development
npm run build    # produces dist/
npm run preview  # serve the built dist/ locally
```

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
    // "questionsPerRound": 5,   // optional: ask only the first N. Omit it and
                                 // every visitor is asked the whole file.
    "shuffleQuestions": true,    // ask the bank in a random order each round
    "shuffleOptions": false,     // also shuffle A/B/C/D within a question
    "showAnswerFeedback": true,  // show right/wrong immediately on tap
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
its block. To **edit** one, change the text. Every visitor is asked the whole
bank, currently 30 questions, so adding a block lengthens the quiz and
deleting one shortens it. There is no per-round count to keep in sync — unless
you set `questionsPerRound`, which asks only the first N and is clamped to the
number of questions actually in the file.

A question with a missing field or an out-of-range `answer` is skipped with a
console warning rather than crashing the kiosk. If the whole file is invalid,
the screen shows a readable error instead of a blank page.

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

## Images

See `public/assets/README.txt`. Five slots, fixed filenames, drop-in
replacements. The files there now are grey placeholders.

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
