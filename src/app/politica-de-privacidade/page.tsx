import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getBusinessSettings } from "@/lib/business-settings";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como tratamos e protegemos seus dados pessoais, em conformidade com a LGPD (Lei nº 13.709/2018).",
};

export default async function PoliticaPrivacidadePage() {
  const business = await getBusinessSettings();
  const atualizado = new Date().toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <LegalPage
      eyebrow="Institucional"
      title="Política de Privacidade"
      updatedAt={atualizado}
      intro={
        <>
          A {business.name} respeita a sua privacidade e trata seus dados
          pessoais com sigilo e responsabilidade, em conformidade com a Lei
          Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
        </>
      }
    >
      <h2>Quais dados coletamos</h2>
      <p>
        Coletamos apenas os dados necessários para um atendimento consultivo:
      </p>
      <ul>
        <li>
          <strong>Dados de contato</strong> que você nos informa — nome,
          telefone/WhatsApp e, quando aplicável, e-mail.
        </li>
        <li>
          <strong>Perfil de busca</strong> — preferências de região, tipo de
          imóvel e finalidade que você compartilha conosco.
        </li>
        <li>
          <strong>Dados de navegação</strong> — informações técnicas e de
          utilização do site, usadas de forma agregada para melhorar a sua
          experiência.
        </li>
      </ul>

      <h2>Como utilizamos seus dados</h2>
      <p>
        Utilizamos seus dados exclusivamente para apresentar imóveis adequados
        ao seu perfil, prestar assessoria e manter contato sobre o seu
        atendimento. Não vendemos nem compartilhamos seus dados com terceiros
        para fins publicitários.
      </p>

      <h2>Base legal e consentimento</h2>
      <p>
        O tratamento ocorre mediante o seu consentimento e para a execução das
        tratativas de atendimento solicitadas por você. Você pode revogar o
        consentimento a qualquer momento.
      </p>

      <h2>Seus direitos</h2>
      <p>
        Nos termos da LGPD, você pode solicitar a qualquer momento o acesso, a
        correção, a portabilidade ou a exclusão dos seus dados, bem como
        informações sobre o tratamento realizado.
      </p>

      <h2>Segurança</h2>
      <p>
        Adotamos medidas técnicas e organizacionais para proteger seus dados
        contra acessos não autorizados, perda ou uso indevido.
      </p>

      <h2>Encarregado (DPO) e contato</h2>
      <p>
        Para exercer seus direitos ou tirar dúvidas sobre esta política, fale
        com a {business.name} pelo telefone{" "}
        <a href={`tel:+${business.whatsapp}`}>{business.phoneDisplay}</a>
        {" "}(CRECI {business.creci}, {business.addressCity}/
        {business.addressState}).
      </p>

      <h2>Atualizações desta política</h2>
      <p>
        Esta política pode ser atualizada periodicamente. A versão vigente estará
        sempre disponível nesta página.
      </p>

      <p>
        <strong>Aviso:</strong> este texto é um modelo inicial. Recomendamos
        revisão por assessoria jurídica e o preenchimento dos dados de contato
        do encarregado (DPO) e do endereço completo antes da publicação
        definitiva.
      </p>
    </LegalPage>
  );
}
