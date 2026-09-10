import { motion } from "framer-motion";

const VARIANTS = {
  primary: "bg-br-orange text-white",
  ghost: "bg-white text-br-ink border-[3px] border-br-line",
};

/**
 * Pill button sized for finger input on the kiosk panel.
 * Every tap target here clears the ~9mm touch minimum by a wide margin.
 */
export default function TouchButton({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  onClick,
  ...rest
}) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 620, damping: 26 }}
      className={`inline-flex items-center justify-center gap-6 rounded-full font-bold
        disabled:pointer-events-none disabled:opacity-35 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
