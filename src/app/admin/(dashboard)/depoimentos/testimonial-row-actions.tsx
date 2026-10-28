"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminBtnGhost } from "@/components/admin/ui";

export function TestimonialRowActions({
  testimonialId,
  published,
}: {
  testimonialId: string;
  published: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleTogglePublish() {
    setLoading(true);
    await fetch(`/api/admin/testimonials/${testimonialId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Excluir este depoimento? Essa ação não pode ser desfeita.")) return;
    setLoading(true);
    await fetch(`/api/admin/testimonials/${testimonialId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={handleTogglePublish}
        disabled={loading}
        className={`${adminBtnGhost} disabled:opacity-60`}
      >
        {published ? "Despublicar" : "Publicar"}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-md border border-alerta/40 text-alerta min-h-9 px-3 text-[11px] uppercase tracking-[0.1em] hover:bg-alerta/10 transition-colors disabled:opacity-60"
      >
        Excluir
      </button>
    </div>
  );
}
