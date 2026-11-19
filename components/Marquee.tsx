export default function Marquee({ words, alt = false }: { words: string[]; alt?: boolean }) {
  const all = [...words, ...words];
  return (
    <div className={alt ? "marquee alt" : "marquee"} data-dir={alt ? "1" : "-1"} aria-hidden="true">
      <div className="row">
        {all.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
    </div>
  );
}
