"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  adminLabel,
  adminInput,
  adminTextarea,
  adminBtnPrimary,
} from "@/components/admin/ui";

// Rótulos legíveis por campo, para traduzir os erros de validação da API.
const FIELD_LABELS: Record<string, string> = {
  codigo: "Código",
  type: "Tipo",
  status: "Status",
  title: "Título",
  description: "Descrição",
  address: "Endereço",
  bairro: "Bairro",
  city: "Cidade",
  state: "UF",
  priceMonthly: "Aluguel",
  condominio: "Condomínio",
  iptu: "IPTU",
  depositAmount: "Caução",
  bedrooms: "Quartos",
  bathrooms: "Banheiros",
  vagas: "Vagas",
  areaM2: "Área (m²)",
  andar: "Andar",
  floorPlanUrl: "URL da planta",
  brokerId: "Corretor",
};

export interface PropertyFormValues {
  codigo: string;
  type: "CASA" | "APARTAMENTO";
  status: "DISPONIVEL" | "RESERVADO" | "ALUGADO";
  title: string;
  description: string;
  address: string;
  bairro: string;
  city: string;
  state: string;
  priceMonthly: number;
  condominio: number;
  iptu: number;
  depositAmount: number;
  bedrooms: number;
  bathrooms: number;
  vagas: number;
  areaM2: number;
  andar: string;
  mobiliado: boolean;
  aceitaPet: boolean;
  floorPlanUrl: string;
  brokerId: string;
  photosText: string;
}

const emptyValues: PropertyFormValues = {
  codigo: "",
  type: "CASA",
  status: "DISPONIVEL",
  title: "",
  description: "",
  address: "",
  bairro: "",
  city: "Feira de Santana",
  state: "BA",
  priceMonthly: 0,
  condominio: 0,
  iptu: 0,
  depositAmount: 300,
  bedrooms: 0,
  bathrooms: 0,
  vagas: 0,
  areaM2: 0,
  andar: "",
  mobiliado: false,
  aceitaPet: false,
  floorPlanUrl: "",
  brokerId: "",
  photosText: "",
};

interface PhotoItem {
  url: string;
  isLocal: boolean;
  file?: File;
  uploading?: boolean;
  broken?: boolean;
}

export function PropertyForm({
  propertyId,
  defaultValues,
  brokers,
}: {
  propertyId?: string;
  defaultValues?: PropertyFormValues;
  brokers: { id: string; name: string }[];
}) {
  const router = useRouter();
  const isEdit = Boolean(propertyId);
  const initial = defaultValues ?? emptyValues;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    if (!initial.photosText) return [];
    return initial.photosText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((url) => {
        // Detectar URLs locais antigas que não vão funcionar na Vercel
        const isBrokenLocalUrl = url.startsWith("/uploads/");
        return {
          url: isBrokenLocalUrl ? "" : url,
          isLocal: false,
          uploading: false,
          broken: isBrokenLocalUrl
        };
      })
      .filter(p => p.url || p.broken); // Manter apenas URLs válidas ou marcadas como quebradas
  });
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "imoveis");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) return null;
      const data = await res.json();
      return data.url as string;
    } catch {
      return null;
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: PhotoItem[] = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      isLocal: true,
      file,
      uploading: true,
    }));

    setPhotos((prev) => [...prev, ...newItems]);
    setUploadingCount((c) => c + newItems.length);

    // Upload each file
    const uploadedUrls: (string | null)[] = await Promise.all(
      newItems.map((item) => uploadFile(item.file!))
    );

    let failedCount = 0;
    setPhotos((prev) => {
      const updated = [...prev];
      newItems.forEach((item, idx) => {
        const pos = updated.findIndex((p) => p.url === item.url);
        if (pos !== -1) {
          if (uploadedUrls[idx]) {
            updated[pos] = { url: uploadedUrls[idx]!, isLocal: false, uploading: false };
          } else {
            // Mark as failed but keep the preview visible
            updated[pos] = { ...updated[pos], uploading: false, isLocal: true };
            failedCount++;
          }
        }
      });
      return updated;
    });

    setUploadingCount((c) => c - newItems.length);

    if (failedCount > 0) {
      setError(`Falha ao enviar ${failedCount} foto${failedCount > 1 ? "s" : ""}. Verifique se o arquivo tem menos de 5MB e tente novamente.`);
    }

    // Reset file input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      const item = prev[index];
      if (item.isLocal && item.url.startsWith("blob:")) {
        URL.revokeObjectURL(item.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  }

  function handleUrlPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    // Let default paste behavior work — URLs will be picked up on submit
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    // Check if any photos are still uploading
    if (uploadingCount > 0) {
      setError("Aguarde o upload das fotos terminar.");
      return;
    }

    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    // Build photosText from the photos array, filtering out broken/empty URLs
    const photosText = photos
      .filter((p) => !p.broken && p.url)
      .map((p) => p.url)
      .join("\n");
    payload.photosText = photosText;

    const response = await fetch(
      isEdit ? `/api/admin/properties/${propertyId}` : "/api/admin/properties",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      // A API devolve details.fieldErrors (Zod) — mostra o campo específico
      // em vez de só "Dados inválidos", pra pessoa saber o que corrigir.
      const fieldErrors = data?.details?.fieldErrors as
        | Record<string, string[]>
        | undefined;
      if (fieldErrors) {
        const msgs = Object.entries(fieldErrors)
          .filter(([, errs]) => errs && errs.length)
          .map(([field, errs]) => `${FIELD_LABELS[field] ?? field}: ${errs[0]}`);
        setError(msgs.join(" · ") || data.error || "Dados inválidos.");
      } else {
        setError(data.error ?? "Erro ao salvar imóvel.");
      }
      setLoading(false);
      return;
    }

    router.push("/admin/imoveis");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-cal-claro border border-carvao/12 rounded-md p-6 space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Código (ex: FSA-0142)"
          name="codigo"
          defaultValue={initial.codigo}
          required
        />
        <div className="space-y-1.5">
          <label className={adminLabel}>Status</label>
          <select name="status" defaultValue={initial.status} className={adminInput}>
            <option value="DISPONIVEL">Disponível</option>
            <option value="RESERVADO">Reservado</option>
            <option value="ALUGADO">Alugado</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={adminLabel}>Tipo</label>
        <select name="type" defaultValue={initial.type} className={adminInput}>
          <option value="CASA">Casa</option>
          <option value="APARTAMENTO">Apartamento</option>
        </select>
      </div>

      <Field label="Título" name="title" defaultValue={initial.title} required />
      <div className="space-y-1.5">
        <label className={adminLabel}>Descrição</label>
        <textarea
          name="description"
          required
          minLength={10}
          rows={3}
          defaultValue={initial.description}
          className={adminTextarea}
        />
      </div>

      <Field label="Endereço" name="address" defaultValue={initial.address} required />
      <div className="grid grid-cols-3 gap-4">
        <Field label="Bairro" name="bairro" defaultValue={initial.bairro} required />
        <Field label="Cidade" name="city" defaultValue={initial.city} required />
        <Field label="UF" name="state" defaultValue={initial.state} required maxLength={2} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field
          label="Aluguel mensal (R$)"
          name="priceMonthly"
          type="number"
          defaultValue={initial.priceMonthly}
          required
        />
        <Field
          label="Condomínio (R$)"
          name="condominio"
          type="number"
          defaultValue={initial.condominio}
        />
        <Field label="IPTU (R$)" name="iptu" type="number" defaultValue={initial.iptu} />
      </div>
      <Field
        label="Caução (R$)"
        name="depositAmount"
        type="number"
        defaultValue={initial.depositAmount}
        required
      />

      <div className="grid grid-cols-4 gap-4">
        <Field
          label="Quartos"
          name="bedrooms"
          type="number"
          defaultValue={initial.bedrooms}
          required
        />
        <Field
          label="Banheiros"
          name="bathrooms"
          type="number"
          defaultValue={initial.bathrooms}
          required
        />
        <Field label="Vagas" name="vagas" type="number" defaultValue={initial.vagas} />
        <Field label="Andar (se apto)" name="andar" type="number" defaultValue={initial.andar} />
      </div>
      <Field
        label="Área (m²)"
        name="areaM2"
        type="number"
        defaultValue={initial.areaM2}
        required
      />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-carvao">
          <input type="checkbox" name="mobiliado" defaultChecked={initial.mobiliado} className="accent-anil" />
          Mobiliado
        </label>
        <label className="flex items-center gap-2 text-sm text-carvao">
          <input type="checkbox" name="aceitaPet" defaultChecked={initial.aceitaPet} className="accent-anil" />
          Aceita pet
        </label>
      </div>

      <div className="space-y-1.5">
        <label className={adminLabel}>Corretor responsável</label>
        <select name="brokerId" defaultValue={initial.brokerId} className={adminInput}>
          <option value="">Nenhum</option>
          {brokers.map((broker) => (
            <option key={broker.id} value={broker.id}>
              {broker.name}
            </option>
          ))}
        </select>
      </div>

      <Field
        label="URL da planta baixa (opcional)"
        name="floorPlanUrl"
        type="url"
        defaultValue={initial.floorPlanUrl}
      />

      {/* Seção de fotos com upload por arquivo */}
      <div className="space-y-3">
        <label className={adminLabel}>Fotos do imóvel</label>

        {/* Botão de selecionar arquivos */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-anil border border-anil/30 rounded hover:bg-anil/5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Escolher fotos do dispositivo
          </button>
          <span className="text-xs text-grafite">JPG, PNG ou WebP · máx. 5MB cada</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Preview das fotos */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {photos.map((photo, index) => (
              <div key={`${photo.url || 'broken'}-${index}`} className="relative group aspect-square rounded overflow-hidden border border-carvao/10 bg-grafite/5">
                {photo.broken ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-amber-50 text-amber-800 p-2 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>
                    <span className="text-xs font-medium">Foto antiga</span>
                    <span className="text-[10px]">Remova e suba novamente</span>
                  </div>
                ) : (
                  <img
                    src={photo.url}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
                {photo.uploading && (
                  <div className="absolute inset-0 bg-carvao/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  title="Remover foto"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {uploadingCount > 0 && (
          <p className="text-xs text-anil">
            Enviando {uploadingCount} foto{uploadingCount > 1 ? "s" : ""}…
          </p>
        )}

        {/* Campo opcional de URLs manuais */}
        <details className="text-sm">
          <summary className="cursor-pointer text-grafite hover:text-carvao select-none">
            Ou cole URLs manualmente (uma por linha)
          </summary>
          <textarea
            name="photosText"
            rows={2}
            defaultValue=""
            placeholder={"https://exemplo.com/foto1.jpg\nhttps://exemplo.com/foto2.jpg"}
            className={`${adminTextarea} mt-2`}
            onChange={() => {}}
            onBlur={(e) => {
              // Merge manual URLs into photos array on blur
              const manualUrls = e.target.value
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean);
              if (manualUrls.length > 0) {
                setPhotos((prev) => {
                  const existingUrls = new Set(prev.map((p) => p.url));
                  const newFromManual = manualUrls
                    .filter((u) => !existingUrls.has(u))
                    .map((url) => ({ url, isLocal: false }));
                  return [...prev, ...newFromManual];
                });
                e.target.value = "";
              }
            }}
          />
        </details>

        {/* Hidden field to carry photosText — managed via state in handleSubmit */}
        <input type="hidden" name="photosTextManaged" value={photos.map((p) => p.url).join("\n")} />
      </div>

      {error && <p className="text-sm text-alerta">{error}</p>}

      <button type="submit" disabled={loading || uploadingCount > 0} className={`${adminBtnPrimary} w-full disabled:opacity-50`}>
        {loading ? "Salvando…" : uploadingCount > 0 ? "Aguarde o upload…" : isEdit ? "Salvar alterações" : "Cadastrar imóvel"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  maxLength,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  defaultValue?: string | number;
}) {
  return (
    <div className="space-y-1.5">
      <label className={adminLabel}>{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        defaultValue={defaultValue}
        className={adminInput}
      />
    </div>
  );
}