"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminBtnGhost } from "@/components/admin/ui";

export function DeletePropertyButton({ propertyId, title }: { propertyId: string; title: string }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao excluir");
      router.refresh();
    } catch {
      alert("Erro ao excluir o imóvel. Tente novamente.");
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-grafite">Excluir "{title}"?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {deleting ? "Excluindo…" : "Sim, excluir"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="text-xs text-grafite px-3 py-1.5 hover:text-carvao disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className={`${adminBtnGhost} text-red-600 hover:text-red-700 hover:bg-red-50`}
    >
      Excluir
    </button>
  );
}