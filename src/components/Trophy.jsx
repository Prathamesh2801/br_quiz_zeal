import { motion } from "framer-motion";

// Confetti shards radiating from the cup. Deterministic (no random) so the
// burst looks the same on every play — kiosk content should be predictable.
const SHARDS = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2;
  return {
    angle,
    distance: 210 + (i % 3) * 34,
    color: ["#f57c1f", "#ffa45c", "#c9ced4"][i % 3],
    rotate: (i * 47) % 180,
    delay: 0.18 + (i % 6) * 0.035,
  };
});

/**
 * Gold cup with an animated confetti burst, drawn entirely in SVG.
 * `size` scales the whole burst so the Result screen can fit it alongside the
 * score card and buttons without anything running off the canvas.
 */
export default function Trophy({ size = 1 }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ height: 470 * size, width: 620 * size }}
    >
      {/* confetti */}
      {SHARDS.map((s, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{
            x: Math.cos(s.angle) * s.distance * size,
            y: Math.sin(s.angle) * s.distance * 0.78 * size,
            opacity: [0, 1, 1, 0.9],
            scale: 1,
          }}
          transition={{ delay: s.delay, duration: 0.85, ease: "easeOut" }}
          style={{
            background: s.color,
            rotate: `${s.rotate}deg`,
            height: 26 * size,
            width: 11 * size,
          }}
          className="absolute rounded-[3px]"
        />
      ))}

      <motion.svg
        viewBox="0 0 260 250"
        style={{ height: 330 * size, width: 330 * size }}
        className="relative"
        initial={{ scale: 0.6, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 16 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffd970" />
            <stop offset="45%" stopColor="#f3b73b" />
            <stop offset="100%" stopColor="#d9911d" />
          </linearGradient>
          <linearGradient id="goldDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8ae35" />
            <stop offset="100%" stopColor="#c07f14" />
          </linearGradient>
        </defs>

        {/* handles */}
        <path
          d="M72 46 H40 a30 30 0 0 0 -30 30 a46 46 0 0 0 46 46 h20"
          fill="none"
          stroke="url(#goldDark)"
          strokeWidth="15"
          strokeLinecap="round"
        />
        <path
          d="M188 46 h32 a30 30 0 0 1 30 30 a46 46 0 0 1 -46 46 h-20"
          fill="none"
          stroke="url(#goldDark)"
          strokeWidth="15"
          strokeLinecap="round"
        />

        {/* cup */}
        <path
          d="M64 26 h132 v70 a66 66 0 0 1 -132 0 z"
          fill="url(#gold)"
        />
        <rect x="58" y="18" width="144" height="20" rx="8" fill="url(#gold)" />

        {/* star */}
        <path
          d="M130 52 l10.5 21.4 23.6 3.4 -17 16.6 4 23.5 -21.1 -11.1 -21.1 11.1 4 -23.5 -17 -16.6 23.6 -3.4 z"
          fill="#fff3d0"
          opacity="0.95"
        />

        {/* stem + base */}
        <rect x="118" y="160" width="24" height="30" fill="url(#goldDark)" />
        <path d="M92 190 h76 v18 h-76 z" fill="#2b2b2b" />
        <rect x="74" y="208" width="112" height="26" rx="7" fill="#1f1f1f" />
        <rect x="104" y="213" width="52" height="15" rx="4" fill="url(#gold)" />
      </motion.svg>
    </div>
  );
}
