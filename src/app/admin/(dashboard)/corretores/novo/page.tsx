import { BrokerForm } from "../broker-form";

export default function NewBrokerPage() {
  return (
    <section className="max-w-xl">
      <h2 className="font-display font-medium text-2xl tracking-tight text-carvao mb-6">
        Cadastrar corretor
      </h2>
      <BrokerForm />
    </section>
  );
}
