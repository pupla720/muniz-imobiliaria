"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const options = [
  { value: "DISPONIVEL", label: "Disponível" },
  { value: "RESERVADO", label: "Reservado" },
  { value: "ALUGADO", label: "Alugado" },
];

export function StatusSelect({
  propertyId,
  status,
}: {
  propertyId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true);
    await fetch(`/api/admin/properties/${propertyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: event.target.value }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <select
      defaultValue={status}
      onChange={handleChange}
      disabled={loading}
      className="text-xs border border-carvao/20 rounded-md px-2.5 py-1.5 bg-white text-carvao disabled:opacity-60 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-latao"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
