import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getBusinessSettings } from "@/lib/business-settings";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Condições de uso do site e do atendimento consultivo da imobiliária.",
};

export default async function TermosPage() {
  const business = await getBusinessSettings();
  const atualizado = new Date().toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <LegalPage
      eyebrow="Institucional"
      title="Termos de Uso"
      updatedAt={atualizado}
      intro={
        <>
          Ao navegar neste site e solicitar atendimento à {business.name}, você
          concorda com as condições descritas abaixo.
        </>
      }
    >
      <h2>Natureza das informações</h2>
      <p>
        Os imóveis apresentados compõem uma curadoria e têm caráter informativo.
        A disponibilidade, as condições e os valores são apresentados de forma
        reservada, mediante atendimento consultivo, e podem sofrer alterações
        sem aviso prévio.
      </p>

      <h2>Intermediação imobiliária</h2>
      <p>
        A {business.name} atua na intermediação de locação de imóveis, com
        registro profissional ativo (CRECI {business.creci}). Nenhuma informação
        deste site constitui oferta vinculante ou proposta contratual.
      </p>

      <h2>Uso do site</h2>
      <p>Você se compromete a:</p>
      <ul>
        <li>fornecer informações verdadeiras ao solicitar atendimento;</li>
        <li>não utilizar o site para fins ilícitos ou que violem direitos de terceiros;</li>
        <li>
          não reproduzir, sem autorização, textos, imagens e demais conteúdos
          aqui publicados.
        </li>
      </ul>

      <h2>Propriedade intelectual</h2>
      <p>
        A marca, o conteúdo e os materiais deste site pertencem à{" "}
        {business.name} ou a seus licenciadores, sendo vedada a utilização sem
        autorização expressa.
      </p>

      <h2>Limitação de responsabilidade</h2>
      <p>
        Empregamos nosso melhor esforço para manter as informações corretas e
        atualizadas, mas não garantimos a ausência de eventuais imprecisões. As
        condições definitivas de cada imóvel são formalizadas por escrito no
        momento da contratação.
      </p>

      <h2>Privacidade</h2>
      <p>
        O tratamento dos seus dados segue a nossa{" "}
        <a href="/politica-de-privacidade">Política de Privacidade</a>.
      </p>

      <h2>Contato</h2>
      <p>
        Dúvidas sobre estes termos podem ser encaminhadas à {business.name} pelo
        telefone{" "}
        <a href={`tel:+${business.whatsapp}`}>{business.phoneDisplay}</a>.
      </p>

      <p>
        <strong>Aviso:</strong> este texto é um modelo inicial e deve ser
        revisado por assessoria jurídica antes da publicação definitiva.
      </p>
    </LegalPage>
  );
}
