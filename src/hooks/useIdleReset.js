import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuiz } from "../state/quizStore";
import { PATHS } from "../routes/paths";

/**
 * Kiosk attract-loop: if nobody touches the screen for a while mid-quiz,
 * reset to the start screen so the next visitor gets a clean run.
 *
 * Lives as its own hook so the layout stays a plain render function and this
 * behaviour can be reused or disabled without touching the shell.
 */
export default function useIdleReset() {
  const navigate = useNavigate();
  const location = useLocation();
  const { config, startRound } = useQuiz();

  const seconds = config?.idleResetSeconds ?? 90;

  useEffect(() => {
    // Nothing to reset to on the start screen itself.
    if (location.pathname === PATHS.start || seconds <= 0) return;

    let timer;
    const reset = () => {
      startRound();
      navigate(PATHS.start);
    };
    const bump = () => {
      clearTimeout(timer);
      timer = setTimeout(reset, seconds * 1000);
    };

    bump();
    const events = ["pointerdown", "touchstart", "keydown"];
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, bump));
    };
  }, [location.pathname, seconds, navigate, startRound]);
}
