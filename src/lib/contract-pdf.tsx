import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, lineHeight: 1.5 },
  title: { fontSize: 16, fontWeight: 700, marginBottom: 16, textAlign: "center" },
  section: { marginBottom: 10 },
  label: { fontWeight: 700 },
  signatureBox: { marginTop: 30, borderTop: 1, paddingTop: 10 },
});

export interface ContractData {
  reservationId: string;
  property: {
    title: string;
    address: string;
    city: string;
    state: string;
    priceMonthly: number;
  };
  renter: {
    name: string;
    email: string;
    cpf: string | null;
    phone: string | null;
  };
  depositAmount: number;
  template: {
    landlordName: string;
    rentDueDay: number;
    termsText: string;
  };
  signed?: {
    signerName: string;
    signerCpf: string;
    signerIp: string;
    signedAt: Date;
  };
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ContractDocument({ data }: { data: ContractData }) {
  const { property, renter, depositAmount, template, signed } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>CONTRATO DE LOCAÇÃO RESIDENCIAL</Text>

        <View style={styles.section}>
          <Text>
            <Text style={styles.label}>LOCADOR: </Text>
            {template.landlordName}
          </Text>
          <Text>
            <Text style={styles.label}>LOCATÁRIO: </Text>
            {renter.name} — CPF: {renter.cpf ?? "não informado"} — E-mail:{" "}
            {renter.email} — Telefone: {renter.phone ?? "não informado"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>OBJETO DO CONTRATO</Text>
          <Text>
            Locação do imóvel situado em {property.address}, {property.city} -{" "}
            {property.state}, denominado &quot;{property.title}&quot;.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>VALOR DO ALUGUEL</Text>
          <Text>
            O valor mensal do aluguel é de {formatBRL(property.priceMonthly)},
            com vencimento todo dia {template.rentDueDay} de cada mês.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>CAUÇÃO</Text>
          <Text>
            O locatário pagou, no ato da reserva, o valor de{" "}
            {formatBRL(depositAmount)} a título de caução, a ser devolvido ao
            término da locação, descontadas eventuais despesas de reparo
            previstas em vistoria.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>PRAZO E CONDIÇÕES GERAIS</Text>
          <Text>{template.termsText}</Text>
        </View>

        <View style={styles.signatureBox}>
          {signed ? (
            <>
              <Text style={styles.label}>ASSINADO ELETRONICAMENTE</Text>
              <Text>Nome: {signed.signerName}</Text>
              <Text>CPF: {signed.signerCpf}</Text>
              <Text>
                Data/hora: {signed.signedAt.toLocaleString("pt-BR")} — IP:{" "}
                {signed.signerIp}
              </Text>
              <Text style={{ marginTop: 8, fontSize: 9, color: "#555" }}>
                Este documento foi aceito eletronicamente pelo locatário
                identificado acima, com registro de data, hora e endereço IP,
                nos termos da MP nº 2.200-2/2001.
              </Text>
            </>
          ) : (
            <Text style={{ fontSize: 9, color: "#999" }}>
              RASCUNHO — este contrato ainda não foi assinado.
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
}
