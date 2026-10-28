import { getContractTemplate } from "@/lib/contract-template";
import { ContractTemplateForm } from "./contract-template-form";
import { adminHeading } from "@/components/admin/ui";

export default async function AdminContractPage() {
  const template = await getContractTemplate();

  return (
    <section>
      <h2 className={`${adminHeading} mb-1`}>Modelo do contrato de locação</h2>
      <p className="text-sm text-grafite font-light mb-5 max-w-2xl">
        Estes campos são usados para gerar o contrato de todas as reservas.
        Dados do imóvel, do locatário e da caução são preenchidos
        automaticamente — aqui você edita apenas as condições gerais.
      </p>
      <p className="text-xs bg-latao/10 text-latao-escuro border border-latao/30 rounded-md p-3 mb-6 max-w-2xl">
        Recomendamos que o texto das cláusulas gerais seja revisado por um
        advogado antes de ser usado em contratos reais.
      </p>
      <div className="bg-cal-claro border border-carvao/12 rounded-md p-6 max-w-2xl">
        <ContractTemplateForm
          defaultLandlordName={template.landlordName}
          defaultRentDueDay={template.rentDueDay}
          defaultTermsText={template.termsText}
        />
      </div>
    </section>
  );
}
