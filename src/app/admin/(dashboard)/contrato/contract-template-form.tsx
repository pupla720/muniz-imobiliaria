"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminLabel,
  adminInput,
  adminTextarea,
  adminBtnPrimary,
} from "@/components/admin/ui";

export function ContractTemplateForm({
  defaultLandlordName,
  defaultRentDueDay,
  defaultTermsText,
}: {
  defaultLandlordName: string;
  defaultRentDueDay: number;
  defaultTermsText: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      landlordName: String(form.get("landlordName") ?? ""),
      rentDueDay: Number(form.get("rentDueDay") ?? 5),
      termsText: String(form.get("termsText") ?? ""),
    };

    const response = await fetch("/api/admin/contract-template", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Erro ao salvar.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className={adminLabel}>Nome da imobiliária (locador)</label>
        <input
          name="landlordName"
          required
          minLength={2}
          defaultValue={defaultLandlordName}
          className={adminInput}
        />
      </div>
      <div className="space-y-1.5">
        <label className={adminLabel}>Dia de vencimento do aluguel</label>
        <input
          name="rentDueDay"
          type="number"
          min={1}
          max={28}
          required
          defaultValue={defaultRentDueDay}
          className={`${adminInput} w-32`}
        />
      </div>
      <div className="space-y-1.5">
        <label className={adminLabel}>
          Cláusulas gerais (prazo, reajuste, rescisão, foro, etc.)
        </label>
        <textarea
          name="termsText"
          required
          minLength={10}
          rows={8}
          defaultValue={defaultTermsText}
          className={adminTextarea}
        />
      </div>

      {error && <p className="text-sm text-alerta">{error}</p>}
      {success && <p className="text-sm text-mangue-escuro">Modelo salvo com sucesso.</p>}

      <button type="submit" disabled={loading} className={adminBtnPrimary}>
        {loading ? "Salvando…" : "Salvar modelo"}
      </button>
    </form>
  );
}
