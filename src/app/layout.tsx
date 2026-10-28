import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { getBusinessSettings } from "@/lib/business-settings";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloatButton } from "@/components/whatsapp-float-button";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

// Todo o site depende de dados vivos do banco (imóveis, corretores, dados
// da empresa, sessão do admin) — nada aqui deve virar HTML estático gerado
// no build. Sem isso, a Vercel tenta acessar o banco durante o build (onde
// não há garantia de rede/variáveis de ambiente) em vez de a cada request.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessSettings();

  return {
    metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
    title: {
      default: `${business.name} — Curadoria imobiliária de alto padrão em ${business.addressCity}`,
      template: `%s — ${business.name}`,
    },
    description: `Curadoria de imóveis de alto padrão em ${business.addressCity}, com assessoria jurídica própria, sigilo absoluto e atendimento exclusivo. Disponibilidade sob consulta.`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const business = await getBusinessSettings();

  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsAppFloatButton businessName={business.name} whatsapp={business.whatsapp} />
      </body>
    </html>
  );
}
