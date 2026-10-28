import type { PropertyStatus } from "@/generated/prisma/enums";

const statusConfig: Record<
  PropertyStatus,
  { label: string; bg: string; ring: string }
> = {
  DISPONIVEL: { label: "Disponível", bg: "bg-mangue", ring: "ring-mangue-escuro/40" },
  RESERVADO: { label: "Reservado", bg: "bg-latao-escuro", ring: "ring-latao/40" },
  ALUGADO: { label: "Alugado", bg: "bg-grafite", ring: "ring-carvao/30" },
};

export function DoorPlate({
  codigo,
  status,
  size = "md",
}: {
  codigo: string;
  status: PropertyStatus;
  size?: "sm" | "md" | "lg";
}) {
  const config = statusConfig[status];
  const sizeClasses =
    size === "lg"
      ? "px-4 py-2.5 text-base"
      : size === "sm"
        ? "px-2 py-1 text-xs"
        : "px-3 py-1.5 text-sm";

  return (
    <div
      className={`inline-flex flex-col items-start rounded-md ${config.bg} text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.25)] ring-1 ${config.ring} ${sizeClasses}`}
    >
      <span className="font-utility font-bold tracking-wider tabular-nums leading-none">
        {codigo}
      </span>
      <span className="text-[0.7em] leading-none mt-1 opacity-90 uppercase tracking-wide">
        {config.label}
      </span>
    </div>
  );
}
