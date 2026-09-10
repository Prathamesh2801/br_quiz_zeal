import { Outlet } from "react-router-dom";
import Stage from "../components/Stage";
import { QuizProvider } from "../state/QuizProvider";
import { useQuiz } from "../state/quizStore";
import { useIdleReset } from "../hooks";
import BootMessage from "./BootMessage";

/**
 * Everything a screen can assume is already there: the scaled stage, the quiz
 * state, and a readable message while the bank loads or if it is broken.
 * Screens render only their own content.
 */
function Shell() {
  const { ready, error } = useQuiz();
  useIdleReset();

  return (
    <Stage>
      {error ? (
        <BootMessage
          title="Quiz data problem"
          body={error}
          hint="Fix public/data/questions.json, then refresh the screen."
        />
      ) : !ready ? (
        <BootMessage title="Loading…" body="Preparing the challenge." />
      ) : (
        <Outlet />
      )}
    </Stage>
  );
}

export default function AppLayout() {
  return (
    <QuizProvider>
      <Shell />
    </QuizProvider>
  );
}
