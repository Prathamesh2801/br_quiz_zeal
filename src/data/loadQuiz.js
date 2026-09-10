// Loads and validates public/data/questions.json.
//
// The file lives in public/ (not src/) on purpose: it is NOT bundled, so on
// the kiosk you can edit dist/data/questions.json with Notepad, refresh the
// screen, and the new questions are live. No rebuild, no internet.

// No questionsPerRound here on purpose: when the file doesn't set one, the
// round is however many questions the file actually contains, so adding or
// deleting a question needs no second edit to keep a count in sync.
const DEFAULT_CONFIG = {
  shuffleQuestions: false,
  shuffleOptions: false,
  showAnswerFeedback: true,
  idleResetSeconds: 90,
};

/** Fisher-Yates. Returns a new array; never mutates the input. */
export function shuffle(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Validates one question. Returns null when the row is unusable so a single
 * bad edit in the JSON cannot take the whole kiosk down.
 */
function validateQuestion(raw, index) {
  const where = `question #${raw?.id ?? index + 1}`;

  if (!raw || typeof raw.question !== "string" || !raw.question.trim()) {
    console.warn(`[quiz] skipped ${where}: missing "question" text`);
    return null;
  }
  if (!Array.isArray(raw.options) || raw.options.length < 2) {
    console.warn(`[quiz] skipped ${where}: needs at least 2 options`);
    return null;
  }
  const options = raw.options.map((o) => String(o ?? "").trim());
  if (options.some((o) => !o)) {
    console.warn(`[quiz] skipped ${where}: an option is blank`);
    return null;
  }

  // "answer" may be a 0-based index or a letter ("B"). Both are accepted so
  // the file stays easy to hand-edit.
  let answer = raw.answer;
  if (typeof answer === "string") {
    const letter = answer.trim().toUpperCase();
    answer = /^[A-Z]$/.test(letter)
      ? letter.charCodeAt(0) - 65
      : Number(answer);
  }
  if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) {
    console.warn(`[quiz] skipped ${where}: "answer" must point at an option`);
    return null;
  }

  return {
    id: raw.id ?? index + 1,
    question: raw.question.trim(),
    options,
    answer,
  };
}

/**
 * Reads the question bank off disk and returns { config, questions }.
 * Throws with a human-readable message the boot screen can display.
 */
export async function loadQuiz() {
  // Relative to the page so it resolves under any base path, including
  // file:// and a sub-folder on the kiosk.
  //
  // The ?t= cache-buster is what makes editing the file on the kiosk actually
  // take effect: without a unique URL, Apache (XAMPP) can still answer a
  // reload with 304 Not Modified from its own ETag/Last-Modified, and the
  // operator sees the old questions after saving. A fresh URL every load
  // cannot be served from any cache.
  const url = `${import.meta.env.BASE_URL}data/questions.json?t=${Date.now()}`;

  let res;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch {
    throw new Error(`Could not read ${url}. Serve the folder over http.`);
  }
  if (!res.ok) throw new Error(`Could not read questions.json (${res.status}).`);

  let parsed;
  try {
    parsed = await res.json();
  } catch {
    throw new Error("questions.json is not valid JSON. Check for a stray comma.");
  }

  // Accept either { config, questions } or a bare array of questions.
  const rawList = Array.isArray(parsed) ? parsed : parsed.questions;
  if (!Array.isArray(rawList)) {
    throw new Error('questions.json must contain a "questions" array.');
  }

  const questions = rawList
    .map(validateQuestion)
    .filter(Boolean);

  if (!questions.length) {
    throw new Error("No valid questions found in questions.json.");
  }

  const config = { ...DEFAULT_CONFIG, ...(Array.isArray(parsed) ? {} : parsed.config) };

  // "questionsPerRound" is optional. Leave it out and every visitor is asked
  // the whole file; set it (in dev or on the kiosk) to ask only the first N.
  // Clamped to the bank size so a stale number left behind after deleting
  // questions can never ask for more than exist.
  if (!Number.isInteger(config.questionsPerRound) || config.questionsPerRound <= 0) {
    config.questionsPerRound = questions.length;
  }
  config.questionsPerRound = Math.min(config.questionsPerRound, questions.length);

  // Quick override without touching the file: open the kiosk as ?limit=5#/
  const limit = Number(new URLSearchParams(window.location.search).get("limit"));
  if (Number.isInteger(limit) && limit > 0 && limit < config.questionsPerRound) {
    config.questionsPerRound = limit;
  }

  return { config, questions };
}

/**
 * Builds one round. Every valid question in the bank is asked, shuffling only
 * changes the order, never how many — unless a debug ?limit= override trimmed
 * config.questionsPerRound below the bank size.
 */
export function buildRound({ config, questions }) {
  const ordered = config.shuffleQuestions ? shuffle(questions) : [...questions];
  const picked = ordered.slice(0, config.questionsPerRound);

  if (!config.shuffleOptions) return picked;

  return picked.map((q) => {
    const order = shuffle(q.options.map((_, i) => i));
    return {
      ...q,
      options: order.map((i) => q.options[i]),
      answer: order.indexOf(q.answer),
    };
  });
}
