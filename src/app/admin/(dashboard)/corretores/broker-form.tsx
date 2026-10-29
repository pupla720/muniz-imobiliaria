"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { adminLabel, adminInput, adminBtnPrimary } from "@/components/admin/ui";

export interface BrokerFormValues {
  name: string;
  creci: string;
  whatsapp: string;
  photoUrl: string;
}

const emptyValues: BrokerFormValues = { name: "", creci: "", whatsapp: "", photoUrl: "" };

export function BrokerForm({
  brokerId,
  defaultValues,
}: {
  brokerId?: string;
  defaultValues?: BrokerFormValues;
}) {
  const router = useRouter();
  const isEdit = Boolean(brokerId);
  const initial = defaultValues ?? emptyValues;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const response = await fetch(
      isEdit ? `/api/admin/brokers/${brokerId}` : "/api/admin/brokers",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Erro ao salvar corretor.");
      setLoading(false);
      return;
    }

    router.push("/admin/corretores");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-cal-claro border border-carvao/12 rounded-md p-6 space-y-4"
    >
      <ImageUploadField
        name="photoUrl"
        category="corretores"
        label="Foto"
        defaultValue={initial.photoUrl}
      />

      <div className="space-y-1.5">
        <label className={adminLabel}>Nome completo</label>
        <input
          name="name"
          required
          minLength={3}
          defaultValue={initial.name}
          className={adminInput}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={adminLabel}>CRECI</label>
          <input name="creci" required defaultValue={initial.creci} className={adminInput} />
        </div>
        <div className="space-y-1.5">
          <label className={adminLabel}>WhatsApp (DDI+DDD+número, só dígitos)</label>
          <input
            name="whatsapp"
            required
            minLength={10}
            placeholder="5575999999999"
            defaultValue={initial.whatsapp}
            className={adminInput}
          />
        </div>
      </div>

      {error && <p className="text-sm text-alerta">{error}</p>}

      <button type="submit" disabled={loading} className={`${adminBtnPrimary} w-full`}>
        {loading ? "Salvando…" : isEdit ? "Salvar alterações" : "Cadastrar corretor"}
      </button>
    </form>
  );
}
