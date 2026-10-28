"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="font-utility text-[12px] uppercase tracking-[0.12em] text-grafite hover:text-anil transition-colors"
    >
      Sair
    </button>
  );
}
