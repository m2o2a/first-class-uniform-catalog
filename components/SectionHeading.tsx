export default function SectionHeading({
  eyebrow,
  title,
  sub,
  dark = false
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-2xl mx-auto text-center mb-12 px-4">
      <p className="text-signal text-xs tracking-widest2 font-bold mb-3">{eyebrow.toUpperCase()}</p>
      <h2
        className={`font-display font-bold text-3xl sm:text-4xl ${dark ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-3 text-sm sm:text-base ${dark ? "text-mist" : "text-steel"}`}>{sub}</p>
      )}
      <hr className={`stitch ${dark ? "stitch-light" : ""} w-16 mx-auto mt-6`} />
    </div>
  );
}
