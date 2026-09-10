import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { LuLeaf, LuSettings, LuSprout } from "react-icons/lu";
import { FooterLeft, Header } from "../components/Brand";
import TouchButton from "../components/TouchButton";
import { useQuiz } from "../state/quizStore";
import homeBgDesign from "../assets/home_bg_design.png";

const VALUES = [
  { Icon: LuLeaf, text: "Safer\nFood" },
  { Icon: LuSettings, text: "Smarter\nOperations" },
  { Icon: LuSprout, text: "A More\nSustainable\nTomorrow" },
];

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.45, ease: "easeOut" },
  }),
};

export default function Start() {
  const navigate = useNavigate();
  const { startRound, ready } = useQuiz();

  const begin = () => {
    startRound();
    navigate("/quiz");
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      {/* Swoosh, hero photo and the three stacked thumbnails are one
          pre-composited image from the brand kit — see docs/B&R_Quiz_assets. */}
      <img
        src={homeBgDesign}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      />

      <Header
        tagline={
          <>
            Technology
            <br />
            for a better
            <br />
            food future
          </>
        }
      />

      {/* ---------- headline block ---------- */}
      <div className="relative z-20 px-[78px] pt-[58px]">
        <motion.div
          variants={rise}
          initial="hidden"
          animate="show"
          className="mb-11 h-2.5 w-[74px] bg-br-orange"
        />

        <motion.h1
          variants={rise}
          initial="hidden"
          animate="show"
          custom={1}
          className="m-0 text-[88px] font-bold leading-[1.1] tracking-[-1px] text-br-ink"
        >
          Ready to Test Your
          <span className="block text-[106px] font-extrabold text-br-orange">
            Food-Tech IQ?
          </span>
        </motion.h1>

        <motion.p
          variants={rise}
          initial="hidden"
          animate="show"
          custom={2}
          className="mt-10 max-w-[660px] text-[38px] leading-snug text-br-slate"
        >
          Discover how technology is shaping a safer, smarter and more
          sustainable food industry.
        </motion.p>

        <motion.div
          variants={rise}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-16"
        >
          <TouchButton
            onClick={begin}
            disabled={!ready}
            className="h-[130px] px-[66px] text-[46px] shadow-[0_14px_40px_rgba(245,124,31,0.35)]"
          >
            Start the Challenge
            <FiArrowRight size={54} />
          </TouchButton>
        </motion.div>
      </div>

      {/* ---------- value props ---------- */}
      <div className="absolute inset-x-0 bottom-[130px] z-30 flex items-center justify-center gap-[54px] px-[70px]">
        {VALUES.map(({ Icon, text }, i) => (
          <div key={text} className="flex items-center gap-[54px]">
            {i > 0 && <span className="h-[76px] w-[3px] bg-br-line" />}
            <div className="flex items-center gap-6">
              <Icon size={62} className="flex-none text-br-ink" />
              <span className="whitespace-pre-line text-[30px] font-semibold leading-tight text-br-ink">
                {text}
              </span>
            </div>
          </div>
        ))}
      </div>

      <FooterLeft />
    </div>
  );
}
