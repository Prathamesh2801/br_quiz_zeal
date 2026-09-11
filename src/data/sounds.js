import correctUrl from "../assets/sounds/correct.mp3";
import wrongUrl from "../assets/sounds/wrong.mp3";

// One Audio element per cue, reused for the whole session. Creating a new one
// per tap would re-fetch and add latency on the kiosk's first few plays.
const clips = {
  correct: new Audio(correctUrl),
  wrong: new Audio(wrongUrl),
};

for (const clip of Object.values(clips)) clip.preload = "auto";

/**
 * Plays a feedback cue. Always rewinds first so rapid taps retrigger the
 * sound instead of being ignored mid-playback.
 *
 * play() returns a promise that rejects when the browser blocks audio (no
 * user gesture yet, or no output device). That is never fatal here — the
 * quiz is fully usable silent — so the rejection is swallowed.
 */
export function playSound(name) {
  const clip = clips[name];
  if (!clip) return;

  clip.currentTime = 0;
  clip.play().catch(() => {});
}
