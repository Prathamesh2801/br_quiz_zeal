import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiCheck, FiHome, FiX } from "react-icons/fi";
import {
  BackgroundArt,
  CornerWave,
  FooterLeft,
  FooterRight,
  Header,
} from "../components/Brand";
import TouchButton from "../components/TouchButton";
import { useQuiz } from "../state/quizStore";
import { PATHS } from "../routes/paths";
import { playSound } from "../data/sounds";
import quizRightDesign from "../assets/quiz_right_design.png";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

// How long the tapped option sits alone before the correct answer joins it.
// Tuned against the cue lengths (correct 1.3s, buzzer 0.6s) so the reveal
// lands while the sound is still audible, not after silence.
const REVEAL_DELAY = { correct: 450, wrong: 900 };

export default function Quiz() {
  const navigate = useNavigate();
  const {
    config,
    question,
    index,
    total,
    selected,
    isAnswered,
    isLast,
    select,
    next,
    back,
    startRound,
  } = useQuiz();

  // Two-stage feedback: the tapped option colours immediately, then the
  // correct one is revealed a beat later. Flashing both at once reads as a
  // single confusing blink — the visitor needs a moment to register what
  // they picked before the answer appears next to it.
  //
  // The revealed flag stores which question it belongs to rather than a bare
  // boolean, so moving to another question invalidates it without an effect
  // having to reset it.
  const [revealedFor, setRevealedFor] = useState(null);
  const feedbackOn = Boolean(config?.showAnswerFeedback) && isAnswered;

  useEffect(() => {
    if (!feedbackOn) return;

    const correct = selected === question?.answer;
    playSound(correct ? "correct" : "wrong");

    // A correct pick needs no explanation, so it resolves quickly; a wrong
    // one holds longer so the red registers before the green appears.
    const delay = correct ? REVEAL_DELAY.correct : REVEAL_DELAY.wrong;
    const id = question?.id;
    const timer = setTimeout(() => setRevealedFor(id), delay);
    return () => clearTimeout(timer);
    // question.id, not question: a new object identity each render would
    // retrigger the sound on every re-render of the same question.
  }, [feedbackOn, selected, question?.id, question?.answer]);

  if (!question) return null;

  // The picked option always colours at once; the rest of the reveal waits.
  const showPick = feedbackOn;
  const showAnswer = showPick && revealedFor === question.id;

  const onNext = () => (isLast ? navigate(PATHS.result) : next());

  // Abandons the run: the next visitor should start clean, not resume a
  // half-finished round.
  const goHome = () => {
    startRound();
    navigate(PATHS.start);
  };

  // The screen is a fixed height, so a longer question has to buy its extra
  // lines from somewhere. Rather than let it push the nav row into the
  // footer, the question and its options step down through matching size
  // tiers together: the longest questions get the smallest type.
  const load = question.question.length + question.options.join("").length;
  const tier = load > 260 ? 2 : load > 170 ? 1 : 0;

  const headingSize = ["text-[68px]", "text-[56px]", "text-[46px]"][tier];
  const optionPad = ["min-h-[124px] px-[42px]", "min-h-[104px] px-[38px]", "min-h-[88px] px-[32px]"][tier];
  const optionText = ["text-[40px]", "text-[34px]", "text-[29px]"][tier];
  const optionBadge = [
    "h-[80px] w-[80px] text-[42px]",
    "h-[68px] w-[68px] text-[35px]",
    "h-[58px] w-[58px] text-[30px]",
  ][tier];
  const optionGap = ["gap-[20px]", "gap-[16px]", "gap-[13px]"][tier];
  const headingGap = ["mt-[36px]", "mt-[28px]", "mt-[22px]"][tier];

  // The art's curve cuts furthest into the text column near the top, so the
  // tallest questions start lower to clear it.
  const columnTop = ["pt-[310px]", "pt-[318px]", "pt-[352px]"][tier];


  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      <BackgroundArt />
      {/* Curved robot-arm panel, top-right — pre-composited brand-kit art,
          see docs/B&R_Quiz_assets/2.jpeg. */}
      <img
        src={quizRightDesign}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover"
      />
      {/* Short wave: tall enough to back the white footer text, short enough
          that the nav row above stays on light background — an orange Next
          button on solid orange would be unreadable. */}
      <CornerWave height={225} />

      <Header
        member
        taglineScrim
        tagline={
          <>
            Food for a
            <br />
            smarter tomorrow
          </>
        }
      />

      {/* Escape hatch under the logo: a visitor who walks up mid-round can
          restart rather than waiting for the idle timeout. */}
      <button
        type="button"
        onClick={goHome}
        aria-label="Start over"
        className="absolute left-[78px] top-[196px] z-30 flex h-[84px] w-[84px] items-center
          justify-center rounded-full border-[3px] border-br-line bg-white text-br-ink
          transition-colors duration-150 active:bg-br-soft"
      >
        <FiHome size={40} />
      </button>

      {/* ---------- page column ----------
          Counter, question, options, nav and footer are siblings in one
          full-height flex column, so they divide the screen between them
          instead of being placed at hand-computed offsets. Only the question
          block flexes; the nav row and footer keep their height whatever the
          question does, which is what makes an overlap impossible rather
          than merely unlikely. */}
      <div className={`absolute inset-0 z-20 flex flex-col px-[78px] pb-[54px] ${columnTop}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex min-h-0 flex-1 flex-col justify-center"
          >
            {/* The counter rides with the question so the two stay visually
                paired however much space the group is centred in. */}
            <div className="flex-none text-[32px] font-medium text-br-slate">
              Question{" "}
              <span className="font-bold text-br-ink">{index + 1}</span> of{" "}
              {total}
            </div>

            <div className={`mb-[24px] h-2.5 w-[74px] flex-none bg-br-orange ${headingGap}`} />

            {/* max-w stops short of the art's deepest reach into the column,
                so no question's first line can run under the apples. */}
            <h2
              className={`m-0 max-w-[665px] flex-none font-extrabold leading-[1.14] tracking-[-1px] text-br-ink ${headingSize}`}
            >
              {question.question}
            </h2>

            <div className={`mt-[34px] flex flex-none flex-col ${optionGap}`}>
              {question.options.map((opt, i) => (
                <Option
                  key={i}
                  letter={LETTERS[i]}
                  text={opt}
                  pad={optionPad}
                  textSize={optionText}
                  badge={optionBadge}
                  tier={tier}
                  state={optionState({
                    i,
                    selected,
                    answer: question.answer,
                    showPick,
                    showAnswer,
                  })}
                  locked={isAnswered}
                  onSelect={() => select(i)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav and footer are flex-none, so the question block above gives up
            space before they ever move. */}
        <div className="mt-[40px] flex flex-none items-center justify-between">
          <TouchButton
            variant="ghost"
            onClick={back}
            disabled={index === 0}
            className="h-[104px] px-[52px] text-[36px]"
          >
            <FiArrowLeft size={42} />
            Back
          </TouchButton>

          {/* Held until the answer is revealed, so a fast tap on Next can't
              skip past the reveal the delay exists to show. */}
          <TouchButton
            onClick={onNext}
            disabled={!isAnswered || (showPick && !showAnswer)}
            className="h-[104px] min-w-[300px] px-[60px] text-[36px]"
          >
            {isLast ? "Finish" : "Next"}
            <FiArrowRight size={42} />
          </TouchButton>
        </div>

        <div className="mt-[46px] flex flex-none items-end justify-between">
          <FooterLeft flow />
          <FooterRight flow />
        </div>
      </div>
    </div>
  );
}

/**
 * Which visual state an option row is in.
 *
 * `showPick` and `showAnswer` are separate so the tapped option can colour
 * before the correct one is revealed. Between the two, a wrong pick shows red
 * on its own and the others stay neutral rather than dimming early — dimming
 * them would give the answer away before the reveal.
 */
function optionState({ i, selected, answer, showPick, showAnswer }) {
  if (!showPick) return i === selected ? "selected" : "idle";

  if (showAnswer) {
    if (i === answer) return "correct";
    if (i === selected) return "wrong";
    return "dim";
  }

  // Pick registered, answer not yet revealed.
  if (i === selected) return i === answer ? "correct" : "wrong";
  return "idle";
}

const OPTION_STYLES = {
  idle: "border-br-line bg-white",
  selected: "border-br-orange bg-br-orange-soft",
  correct: "border-br-green bg-br-green-soft",
  wrong: "border-br-red bg-br-red-soft",
  dim: "border-br-line bg-white opacity-50",
};

const LETTER_STYLES = {
  idle: "border-br-orange text-br-orange",
  selected: "border-br-orange bg-br-orange text-white",
  correct: "border-br-green bg-br-green text-white",
  wrong: "border-br-red bg-br-red text-white",
  dim: "border-br-orange text-br-orange",
};

function Option({ letter, text, state, locked, onSelect, pad, textSize, badge, tier }) {
  const markSize = [54, 46, 38][tier];

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={locked}
      whileTap={locked ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 620, damping: 28 }}
      className={`flex w-full max-w-[860px] items-center gap-7 rounded-[26px] border-[3px] py-[14px]
        text-left transition-colors duration-150
        disabled:pointer-events-none ${pad} ${OPTION_STYLES[state]}`}
    >
      <span
        className={`flex flex-none items-center justify-center rounded-full
          border-4 font-bold transition-colors duration-150 ${badge} ${LETTER_STYLES[state]}`}
      >
        {letter}
      </span>

      <span className={`font-medium leading-tight text-br-ink ${textSize}`}>
        {text}
      </span>

      {(state === "correct" || state === "wrong") && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="ml-auto flex-none pl-4"
        >
          {state === "correct" ? (
            <FiCheck size={markSize} className="text-br-green" strokeWidth={3} />
          ) : (
            <FiX size={markSize} className="text-br-red" strokeWidth={3} />
          )}
        </motion.span>
      )}
    </motion.button>
  );
}
