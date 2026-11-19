import { Fragment, type ElementType } from "react";

type Part = string | { em: string };

/** Quebra o texto em palavras para a animação de entrada palavra por palavra. */
export default function Split({
  as: Tag = "h2",
  parts,
  className,
  hero = false,
}: {
  as?: ElementType;
  parts: Part[];
  className?: string;
  hero?: boolean;
}) {
  let i = 0;
  const words = (txt: string) =>
    txt
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => {
        const d = i++ * 80;
        return (
          <Fragment key={d}>
            <span className="w" style={{ ["--d" as string]: d }}>
              <span>{w}</span>
            </span>{" "}
          </Fragment>
        );
      });
  return (
    <Tag className={className} {...(hero ? {} : { "data-split": "" })}>
      {parts.map((p, k) =>
        typeof p === "string" ? <span key={k}>{words(p)}</span> : <em key={k}>{words(p.em)}</em>
      )}
    </Tag>
  );
}
