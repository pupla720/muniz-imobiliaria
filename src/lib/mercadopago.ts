import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

// Sem token real, cai no token de teste — a rota que cria a preferência de
// pagamento (/api/reservations) já trata a falha da API graciosamente.
// Isso precisa ficar como fallback silencioso (não lançar erro aqui): este
// módulo é avaliado durante o build da Vercel também, que roda com
// NODE_ENV=production — um throw aqui derruba o build inteiro.
export const mercadopago = new MercadoPagoConfig({
  accessToken: accessToken ?? "TEST-0000000000000000-000000-00000000000000000000000000000000-000000000",
});

export const mpPreference = new Preference(mercadopago);
export const mpPayment = new Payment(mercadopago);
