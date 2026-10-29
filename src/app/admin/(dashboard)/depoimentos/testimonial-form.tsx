"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  adminLabel,
  adminInput,
  adminTextarea,
  adminBtnPrimary,
} from "@/components/admin/ui";

export interface TestimonialFormValues {
  authorName: string;
  photoUrl: string;
  propertyCode: string;
  quote: string;
  published: boolean;
}

const emptyValues: TestimonialFormValues = {
  authorName: "",
  photoUrl: "",
  propertyCode: "",
  quote: "",
  published: false,
};

export function TestimonialForm({
  testimonialId,
  defaultValues,
}: {
  testimonialId?: string;
  defaultValues?: TestimonialFormValues;
}) {
  const router = useRouter();
  const isEdit = Boolean(testimonialId);
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
      isEdit ? `/api/admin/testimonials/${testimonialId}` : "/api/admin/testimonials",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Erro ao salvar depoimento.");
      setLoading(false);
      return;
    }

    router.push("/admin/depoimentos");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-cal-claro border border-carvao/12 rounded-md p-6 space-y-4"
    >
      <ImageUploadField
        name="photoUrl"
        category="depoimentos"
        label="Foto (opcional)"
        defaultValue={initial.photoUrl}
      />

      <div className="space-y-1.5">
        <label className={adminLabel}>Nome de quem alugou</label>
        <input
          name="authorName"
          required
          minLength={3}
          defaultValue={initial.authorName}
          className={adminInput}
        />
      </div>

      <div className="space-y-1.5">
        <label className={adminLabel}>Código do imóvel alugado (opcional)</label>
        <input
          name="propertyCode"
          placeholder="FSA-0142"
          defaultValue={initial.propertyCode}
          className={adminInput}
        />
      </div>

      <div className="space-y-1.5">
        <label className={adminLabel}>Depoimento</label>
        <textarea
          name="quote"
          required
          minLength={10}
          rows={4}
          defaultValue={initial.quote}
          className={adminTextarea}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-carvao">
        <input
          type="checkbox"
          name="published"
          defaultChecked={initial.published}
          className="accent-anil"
        />
        Publicar no site
      </label>

      {error && <p className="text-sm text-alerta">{error}</p>}

      <button type="submit" disabled={loading} className={`${adminBtnPrimary} w-full`}>
        {loading ? "Salvando…" : isEdit ? "Salvar alterações" : "Cadastrar depoimento"}
      </button>
    </form>
  );
}
