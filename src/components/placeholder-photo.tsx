// TODO: substituir por foto real do imóvel assim que a imobiliária enviar.
// Nunca preencher com banco de imagens — o placeholder fica visível de
// propósito até a foto real chegar.
export function PlaceholderPhoto({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center bg-anil/10 overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent, transparent 10px, rgba(14,90,102,0.12) 10px, rgba(14,90,102,0.12) 20px)",
        }}
        aria-hidden="true"
      />
      <KeyIcon />
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-anil text-white text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
        Foto em breve
      </span>
    </div>
  );
}

function KeyIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      width="40"
      height="40"
      className="text-anil/50"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="22" cy="22" r="12" stroke="currentColor" strokeWidth="4" />
      <path
        d="M30 30L54 54M54 54L48 60M54 54L60 48"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
