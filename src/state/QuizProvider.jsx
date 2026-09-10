import { useCallback, useEffect, useMemo, useState } from "react";
import { buildRound, loadQuiz } from "../data/loadQuiz";
import { QuizContext } from "./quizStore";

export function QuizProvider({ children }) {
  const [bank, setBank] = useState(null); // { config, questions }
  const [error, setError] = useState(null);

  const [round, setRound] = useState([]); // questions for the current run
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // chosen option index, or null

  // Load the question bank once at boot.
  useEffect(() => {
    let alive = true;
    loadQuiz()
      .then((data) => {
        if (!alive) return;
        setBank(data);
        const first = buildRound(data);
        setRound(first);
        setAnswers(Array(first.length).fill(null));
      })
      .catch((err) => alive && setError(err.message));
    return () => {
      alive = false;
    };
  }, []);

  /** Fresh round: new question selection, cleared answers, back to Q1. */
  const startRound = useCallback(() => {
    if (!bank) return;
    const fresh = buildRound(bank);
    setRound(fresh);
    setAnswers(Array(fresh.length).fill(null));
    setIndex(0);
  }, [bank]);

  const select = useCallback(
    (optionIndex) => {
      setAnswers((prev) => {
        if (prev[index] !== null) return prev; // locked once answered
        const next = [...prev];
        next[index] = optionIndex;
        return next;
      });
    },
    [index],
  );

  const next = useCallback(
    () => setIndex((i) => Math.min(i + 1, round.length - 1)),
    [round.length],
  );
  const back = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  const score = useMemo(
    () => round.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0),
    [round, answers],
  );

  const value = useMemo(
    () => ({
      config: bank?.config ?? null,
      bankSize: bank?.questions.length ?? 0,
      ready: Boolean(bank),
      error,
      round,
      index,
      answers,
      question: round[index] ?? null,
      total: round.length,
      selected: answers[index] ?? null,
      isAnswered: answers[index] !== null && answers[index] !== undefined,
      isLast: index === round.length - 1,
      score,
      startRound,
      select,
      next,
      back,
    }),
    [bank, error, round, index, answers, score, startRound, select, next, back],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}
