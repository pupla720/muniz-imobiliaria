"use client";

import { useState } from "react";
import { adminLabel } from "@/components/admin/ui";

export function ImageUploadField({
  name,
  category,
  label,
  defaultValue = "",
}: {
  name: string;
  category: "corretores" | "depoimentos";
  label: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Erro ao enviar imagem.");
      setUploading(false);
      return;
    }

    setUrl(data.url);
    setUploading(false);
  }

  return (
    <div>
      <label className={adminLabel}>{label}</label>
      <div className="flex items-center gap-3 mt-1.5">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Pré-visualização"
            className="w-16 h-16 rounded-full object-cover border border-carvao/15"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-cal border border-carvao/15 flex items-center justify-center text-[10px] text-grafite text-center">
            Sem foto
          </div>
        )}
        <div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="text-xs text-grafite file:mr-3 file:rounded-md file:border file:border-carvao/20 file:bg-cal file:px-3 file:py-1.5 file:text-carvao file:text-[11px] file:uppercase file:tracking-[0.1em]"
          />
          {uploading && <p className="text-xs text-grafite mt-1">Enviando…</p>}
          {error && <p className="text-xs text-alerta mt-1">{error}</p>}
        </div>
      </div>
      <input type="hidden" name={name} value={url} />
    </div>
  );
}
