// Shared brand chrome: logo lockup, background swooshes, footers.
// Swap the wordmark for the official SVG/PNG when you have the asset —
// drop it in public/assets/ and replace the markup inside <Logo>.

export function Logo({ member = false }) {
  return (
    <div className="flex items-start gap-8">
      <div>
        <div className="text-[76px] font-extrabold leading-[0.9] tracking-[-2px] text-br-ink">
          B&amp;R
        </div>
        <div className="mt-2.5 h-3 w-full bg-br-orange" />
      </div>

      {member && (
        <>
          <div className="mt-1 w-[3px] self-stretch bg-br-line" />
          <div className="pt-1 text-[26px] font-bold uppercase leading-tight tracking-wide text-br-ink">
            A member of
            <br />
            the ABB group
          </div>
        </>
      )}
    </div>
  );
}

export function Tagline({ children, withScrim = false }) {
  return (
    <div
      className={`ml-auto max-w-[320px] text-[27px] leading-snug text-br-slate ${
        withScrim ? "rounded-[20px] bg-white/75 px-6 py-5 backdrop-blur-sm" : ""
      }`}
    >
      <span className="mb-4 block h-2 w-[60px] bg-br-orange" />
      {children}
    </div>
  );
}

export function Header({ member = false, tagline, taglineScrim = false }) {
  return (
    <div className="relative z-20 flex items-start px-[78px] pt-[72px]">
      <Logo member={member} />
      {tagline && <Tagline withScrim={taglineScrim}>{tagline}</Tagline>}
    </div>
  );
}

// The footers take `flow` when they sit inside a flex row that already
// positions them (the Quiz screen), and stay absolute on the screens that
// place them as free-standing chrome.

export function FooterLeft({ flow = false }) {
  return (
    <div
      className={`text-[24px] font-medium tracking-[6px] text-br-grey ${
        flow ? "" : "absolute bottom-[54px] left-[78px] z-30"
      }`}
    >
      FOOD A BETTER TOMORROW
    </div>
  );
}

export function FooterRight({ flow = false }) {
  return (
    <div
      className={`text-right text-[22px] font-semibold uppercase leading-relaxed tracking-[2px] text-white ${
        flow ? "" : "absolute bottom-[54px] right-[78px] z-30"
      }`}
    >
      <span className="mb-3 ml-auto block h-1.5 w-11 bg-white" />
      Technology
      <br />
      People
      <br />A sustainable tomorrow
    </div>
  );
}

/**
 * Orange wave anchored to the bottom-right of the question/result screens.
 * `height` is the band it may occupy, in canvas px. Screens that put
 * controls near the bottom pass a smaller value and keep their buttons above
 * it: an orange button on solid orange is invisible, especially disabled.
 */
export function CornerWave({ height = 420 }) {
  return (
    <svg
      className="pointer-events-none absolute bottom-0 right-0 z-10 w-[700px]"
      style={{ height }}
      viewBox="0 0 820 420"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 820 0 C 620 40, 470 150, 300 250 C 180 322, 80 372, 0 420 L 820 420 Z"
        fill="#f57c1f"
      />
      <path
        d="M 820 96 C 660 130, 520 226, 372 316 C 296 362, 220 396, 150 420 L 820 420 Z"
        fill="#e97313"
        opacity="0.5"
      />
    </svg>
  );
}

/** Faint pinstripe texture used across all three screens. */
export function BackgroundArt() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox="0 0 1080 1920"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <rect width="1080" height="1920" fill="#fff" />
      <g stroke="#eef0f2" strokeWidth="2" fill="none">
        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={i}
            d={`M -120 ${240 + i * 122} C 220 ${140 + i * 122}, 560 ${
              420 + i * 122
            }, 1200 ${180 + i * 122}`}
          />
        ))}
      </g>
    </svg>
  );
}
