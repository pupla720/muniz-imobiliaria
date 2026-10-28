"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Erro ao entrar.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  const fieldCls =
    "w-full border border-carvao/20 rounded-md px-4 min-h-12 text-sm text-carvao bg-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-latao";
  const labelCls =
    "font-utility text-[11px] uppercase tracking-[0.16em] text-grafite";

  return (
    <div className="min-h-screen bg-cal flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-2xl font-semibold tracking-[0.05em] text-anil">
            Muniz Imobiliária
          </p>
          <p className="font-utility text-[10.5px] uppercase tracking-[0.28em] text-grafite mt-1.5">
            Painel administrativo
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-cal-claro border border-carvao/12 rounded-md p-7 space-y-4"
        >
          <div className="space-y-1.5">
            <label className={labelCls}>E-mail</label>
            <input type="email" name="email" required className={fieldCls} />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Senha</label>
            <input type="password" name="password" required className={fieldCls} />
          </div>
          {error && <p className="text-sm text-alerta">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center rounded-md bg-anil text-cal-claro min-h-12 px-5 text-[13px] uppercase tracking-[0.12em] hover:bg-anil-escuro transition-colors duration-300 disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
