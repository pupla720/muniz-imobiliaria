"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminBtnGhost } from "@/components/admin/ui";

export function ToggleActiveButton({
  brokerId,
  active,
}: {
  brokerId: string;
  active: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await fetch(`/api/admin/brokers/${brokerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`${adminBtnGhost} shrink-0 disabled:opacity-60`}
    >
      {active ? "Desativar" : "Ativar"}
    </button>
  );
}
