import { createContext, useContext } from "react";

// The context object and its hook live outside the provider component file
// so that file exports only components (keeps React Fast Refresh working).
export const QuizContext = createContext(null);

/** Access the shared quiz state. Must be used inside <QuizProvider>. */
export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used inside <QuizProvider>");
  return ctx;
}
