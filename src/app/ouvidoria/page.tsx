import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { getBusinessSettings } from "@/lib/business-settings";

export const metadata: Metadata = {
  title: "Ouvidoria",
  description:
    "Canal direto para elogios, sugestões e reclamações, com tratamento sigiloso e resposta formal.",
};

export default async function OuvidoriaPage() {
  const business = await getBusinessSettings();

  return (
    <LegalPage
      eyebrow="Institucional"
      title="Ouvidoria"
      intro={
        <>
          A Ouvidoria é o canal direto com a diretoria da {business.name} para
          elogios, sugestões e reclamações. Toda manifestação é tratada com
          sigilo e recebe retorno formal.
        </>
      }
    >
      <h2>Quando acionar a Ouvidoria</h2>
      <p>
        Use este canal quando quiser registrar uma manifestação que não foi
        resolvida no atendimento comum, ou falar diretamente com a diretoria
        sobre a qualidade do nosso serviço.
      </p>

      <h2>Como funciona</h2>
      <ul>
        <li>Registre sua manifestação pelos contatos abaixo.</li>
        <li>O registro é analisado pela diretoria, com confidencialidade.</li>
        <li>Você recebe um retorno formal com o encaminhamento dado.</li>
      </ul>

      <h2>Canais de contato</h2>
      <p>
        Telefone:{" "}
        <a href={`tel:+${business.whatsapp}`}>{business.phoneDisplay}</a>
        {" "}· CRECI {business.creci} · {business.addressCity}/
        {business.addressState}.
      </p>

      <div className="pt-2">
        <WhatsAppLink
          message={`Olá! Gostaria de registrar uma manifestação na Ouvidoria da ${business.name}.`}
          origin="ouvidoria"
          phone={business.whatsapp}
          className="inline-flex items-center justify-center rounded-md min-h-12 px-6 text-sm uppercase tracking-[0.12em] bg-latao text-[#20170a] hover:bg-latao-claro transition-colors duration-300"
        >
          Falar com a Ouvidoria
        </WhatsAppLink>
      </div>

      <p>
        <strong>Aviso:</strong> complete o endereço do escritório e, se desejar,
        um e-mail dedicado de ouvidoria em <strong>/admin/empresa</strong> para
        reforçar a credibilidade do canal.
      </p>
    </LegalPage>
  );
}
