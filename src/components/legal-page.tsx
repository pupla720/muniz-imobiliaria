import type { ReactNode } from "react";

export function LegalPage({
  eyebrow,
  title,
  updatedAt,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  updatedAt?: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-7 py-16 sm:py-24">
      <p className="font-utility text-xs uppercase tracking-[0.28em] text-latao">
        {eyebrow}
      </p>
      <div className="w-12 h-px bg-latao mt-5 mb-5" />
      <h1 className="font-display font-medium text-[clamp(30px,4.5vw,50px)] tracking-tight text-carvao leading-[1.05]">
        {title}
      </h1>
      {updatedAt && (
        <p className="font-utility text-[11px] uppercase tracking-[0.18em] text-grafite mt-5">
          Atualizado em {updatedAt}
        </p>
      )}
      {intro && (
        <p className="text-grafite font-light leading-relaxed mt-6 text-lg">
          {intro}
        </p>
      )}

      <div
        className="mt-10 space-y-5 text-grafite font-light leading-relaxed
          [&_h2]:font-display [&_h2]:font-medium [&_h2]:text-carvao [&_h2]:text-2xl
          [&_h2]:tracking-tight [&_h2]:mt-12 [&_h2]:mb-0
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2
          [&_strong]:text-carvao [&_strong]:font-medium
          [&_a]:text-anil [&_a]:underline [&_a]:decoration-latao/60 hover:[&_a]:decoration-latao"
      >
        {children}
      </div>
    </div>
  );
}
