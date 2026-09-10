import { motion } from "framer-motion";
import trophyImage from "../assets/trophy.png";

// The artwork's own aspect ratio (1389x1132), so the box matches the image
// and never letterboxes it.
const RATIO = 1389 / 1132;
const BASE_HEIGHT = 470;

/**
 * Brand trophy artwork with a spring entrance.
 *
 * The confetti burst is part of the image, so there is nothing to draw here —
 * `size` just scales the whole thing, letting the Result screen fit it above
 * the score card and buttons without anything running off the canvas.
 */
export default function Trophy({ size = 1 }) {
  const height = BASE_HEIGHT * size;

  return (
    <motion.img
      src={trophyImage}
      alt=""
      aria-hidden="true"
      style={{ height, width: height * RATIO }}
      className="flex-none select-none object-contain"
      initial={{ scale: 0.6, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 16 }}
      draggable={false}
    />
  );
}
