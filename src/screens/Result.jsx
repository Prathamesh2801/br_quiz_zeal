import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiHome } from "react-icons/fi";
import {
  BackgroundArt,
  CornerWave,
  FooterLeft,
  FooterRight,
  Header,
} from "../components/Brand";
import TouchButton from "../components/TouchButton";
import Trophy from "../components/Trophy";
import { useQuiz } from "../state/quizStore";
import quizRightDesign from "../assets/quiz_right_design.png";

/** Headline + blurb tuned to how well the visitor did. */
function verdict(score, total) {
  const pct = total ? score / total : 0;
  if (pct === 1)
    return {
      title: "Perfect score!",
      blurb: "You really know your food tech. Nothing left to teach you here.",
    };
  if (pct >= 0.6)
    return {
      title: "Great job!",
      blurb:
        "You're one step closer to a smarter, more sustainable food future.",
    };
  if (pct >= 0.3)
    return {
      title: "Nice start!",
      blurb:
        "There's more to discover about how technology is shaping our food.",
    };
  return {
    title: "Thanks for playing!",
    blurb: "Come talk to our team to learn how technology is changing food.",
  };
}

export default function Result() {
  const navigate = useNavigate();
  const { score, total, startRound } = useQuiz();
  const { title, blurb } = verdict(score, total);

  const playAgain = () => {
    startRound();
    navigate("/quiz");
  };

  const goHome = () => {
    startRound();
    navigate("/");
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      <BackgroundArt />
      {/* Curved robot-arm panel, top-right — pre-composited brand-kit art,
          see docs/B&R_Quiz_assets/3.jpeg. */}
      <img
        src={quizRightDesign}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover"
      />
      {/* Short wave, as on Quiz: tall enough to back the white footer text,
          short enough to stay clear of the orange Play Again button. */}
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

      {/* Same full-height flex column as the Quiz screen: the footer is a
          sibling with a fixed height, and the content block above it centres
          in whatever is left, so nothing can run off the bottom. */}
      <div className="absolute inset-0 z-20 flex flex-col px-[78px] pb-[54px] pt-[240px]">
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
          <Trophy size={0.72} />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
            className="m-0 mt-[10px] text-[82px] font-extrabold leading-none tracking-[-2px] text-br-orange"
          >
            Congratulations!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.45 }}
            className="mt-5 text-[40px] font-bold text-br-ink"
          >
            You completed the challenge!
          </motion.p>

          {/* ---------- score card ---------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, type: "spring", stiffness: 260, damping: 20 }}
            className="mt-[34px] w-[560px] rounded-[28px] bg-br-soft pb-8 pt-7"
          >
            <div className="text-[27px] font-semibold tracking-[8px] text-br-grey">
              YOUR SCORE
            </div>
            <div className="mt-2 text-[108px] font-extrabold leading-none tracking-[-4px]">
              <span className="text-br-orange">{score}</span>
              <span className="text-br-slate">/{total}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.45 }}
          >
            <p className="mt-[30px] text-[40px] font-bold text-br-ink">{title}</p>
            <p className="mx-auto mt-3 max-w-[720px] text-[31px] leading-snug text-br-slate">
              {blurb}
            </p>
          </motion.div>
        </div>

        {/* ---------- actions ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.45 }}
          className="mx-auto mt-[34px] flex w-[620px] flex-none flex-col gap-5"
        >
          <TouchButton
            onClick={playAgain}
            className="h-[104px] w-full text-[38px] shadow-[0_14px_40px_rgba(245,124,31,0.35)]"
          >
            Play Again
            <FiArrowRight size={44} />
          </TouchButton>

          <TouchButton
            variant="ghost"
            onClick={goHome}
            className="h-[104px] w-full text-[38px]"
          >
            <FiHome size={42} />
            Back to Home
          </TouchButton>
        </motion.div>

        <div className="mt-[40px] flex flex-none items-end justify-between">
          <FooterLeft flow />
          <FooterRight flow />
        </div>
      </div>
    </div>
  );
}
