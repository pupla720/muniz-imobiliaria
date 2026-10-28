import { getBusinessSettings } from "@/lib/business-settings";
import { BusinessSettingsForm } from "./business-settings-form";
import { adminHeading } from "@/components/admin/ui";

export default async function AdminBusinessSettingsPage() {
  const settings = await getBusinessSettings();

  return (
    <section className="max-w-2xl">
      <h2 className={`${adminHeading} mb-1`}>Dados da imobiliária</h2>
      <p className="text-sm text-grafite font-light mb-6">
        Essas informações aparecem no cabeçalho, rodapé e nos botões de WhatsApp
        do site — inclusive o mapa do rodapé usa o endereço abaixo.
      </p>
      <BusinessSettingsForm settings={settings} />
    </section>
  );
}
