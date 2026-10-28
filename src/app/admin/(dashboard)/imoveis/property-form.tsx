"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminLabel,
  adminInput,
  adminTextarea,
  adminBtnPrimary,
} from "@/components/admin/ui";

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
  city: "Aracaju",
  state: "SE",
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

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
      setError(data.error ?? "Erro ao salvar imóvel.");
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
          label="Código (ex: AJU-0142)"
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

      <div className="space-y-1.5">
        <label className={adminLabel}>
          URLs das fotos reais (uma por linha, opcional — sem fotos, aparece o
          placeholder &quot;foto em breve&quot;)
        </label>
        <textarea
          name="photosText"
          rows={3}
          defaultValue={initial.photosText}
          placeholder={"https://exemplo.com/foto1.jpg\nhttps://exemplo.com/foto2.jpg"}
          className={adminTextarea}
        />
      </div>

      {error && <p className="text-sm text-alerta">{error}</p>}

      <button type="submit" disabled={loading} className={`${adminBtnPrimary} w-full`}>
        {loading ? "Salvando…" : isEdit ? "Salvar alterações" : "Cadastrar imóvel"}
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
