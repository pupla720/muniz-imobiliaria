import Link from "next/link";
import { LogoutButton } from "./logout-button";

const navItems = [
  { href: "/admin/imoveis", label: "Imóveis" },
  { href: "/admin/corretores", label: "Corretores" },
  { href: "/admin/depoimentos", label: "Depoimentos" },
  { href: "/admin/reservas", label: "Reservas" },
  { href: "/admin/pagamentos", label: "Pagamentos" },
  { href: "/admin/contrato", label: "Contrato" },
  { href: "/admin/empresa", label: "Empresa" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cal">
      <header className="border-b border-carvao/12 bg-cal-claro">
        <div className="mx-auto max-w-6xl px-7 py-5 flex items-center justify-between gap-4">
          <div className="leading-none">
            <p className="font-display text-xl font-semibold tracking-[0.05em] text-anil">
              Muniz Imobiliária
            </p>
            <p className="font-utility text-[10.5px] uppercase tracking-[0.28em] text-grafite mt-1.5">
              Painel administrativo
            </p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-7">
        <nav className="flex gap-1 flex-wrap border-b border-carvao/12">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-3 font-utility text-[12px] uppercase tracking-[0.12em] text-grafite hover:text-anil border-b-2 border-transparent hover:border-latao transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <main className="mx-auto max-w-6xl px-7 py-10">{children}</main>
    </div>
  );
}
