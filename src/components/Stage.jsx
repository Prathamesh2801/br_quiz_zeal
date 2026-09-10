import { useEffect, useRef, useState } from "react";

// The whole UI is laid out against a fixed portrait canvas and then scaled
// to fit the actual screen. One layout, no media queries, and it looks
// identical on the 1080x1920 kiosk panel and in a small browser window.
export const STAGE_W = 1080;
export const STAGE_H = 1920;

export default function Stage({ children }) {
  const [scale, setScale] = useState(1);
  const frame = useRef(0);

  useEffect(() => {
    const fit = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const { innerWidth: w, innerHeight: h } = window;
        setScale(Math.min(w / STAGE_W, h / STAGE_H));
      });
    };

    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("orientationchange", fit);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("resize", fit);
      window.removeEventListener("orientationchange", fit);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div
        data-stage
        className="relative flex-none overflow-hidden bg-white"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
