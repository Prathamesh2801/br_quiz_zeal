/**
 * Full-screen message used while the question bank loads and when it cannot
 * be read. The kiosk must never show a blank screen to a visitor.
 */
export default function BootMessage({ title, body, hint }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-20 text-center">
      <h2 className="m-0 text-[64px] font-bold text-br-ink">{title}</h2>
      <p className="m-0 text-[36px] leading-relaxed text-br-slate">{body}</p>
      {hint && <p className="m-0 text-[30px] text-br-grey">{hint}</p>}
    </div>
  );
}
