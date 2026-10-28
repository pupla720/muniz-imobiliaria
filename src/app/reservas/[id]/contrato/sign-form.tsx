"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignForm({
  reservationId,
  defaultName,
  defaultCpf,
}: {
  reservationId: string;
  defaultName: string;
  defaultCpf: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      signerName: String(form.get("signerName") ?? ""),
      signerCpf: String(form.get("signerCpf") ?? ""),
      agree: form.get("agree") === "on",
    };

    if (!payload.agree) {
      setError("Você precisa concordar com os termos do contrato para assinar.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/contracts/${reservationId}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Não foi possível assinar o contrato.");
        setLoading(false);
        return;
      }

      router.push(`/reservas/${reservationId}`);
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  const fieldCls =
    "w-full border border-carvao/20 rounded-md px-4 min-h-12 text-sm text-carvao bg-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-latao";
  const labelCls =
    "font-utility text-[11px] uppercase tracking-[0.16em] text-grafite";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-grafite font-light leading-relaxed">
        Leia o contrato ao lado. Ao assinar, ficam registrados seu nome, CPF,
        data/hora e endereço IP como aceite eletrônico deste contrato.
      </p>
      <div className="space-y-1.5">
        <label className={labelCls}>Nome completo (para assinatura)</label>
        <input
          name="signerName"
          required
          minLength={3}
          defaultValue={defaultName}
          className={fieldCls}
        />
      </div>
      <div className="space-y-1.5">
        <label className={labelCls}>CPF</label>
        <input
          name="signerCpf"
          required
          minLength={11}
          defaultValue={defaultCpf}
          className={fieldCls}
        />
      </div>
      <label className="flex items-start gap-2.5 text-sm text-carvao font-light">
        <input type="checkbox" name="agree" className="mt-1 accent-anil" />
        Li e concordo com os termos do contrato de locação acima.
      </label>

      {error && <p className="text-sm text-alerta">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center rounded-md bg-anil text-cal-claro min-h-12 px-5 text-[13px] uppercase tracking-[0.12em] hover:bg-anil-escuro transition-colors duration-300 disabled:opacity-60"
      >
        {loading ? "Assinando…" : "Assinar contrato"}
      </button>
    </form>
  );
}
