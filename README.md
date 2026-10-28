# Muniz Imobiliária — Site institucional + captação via WhatsApp

Site de locação residencial em Aracaju/SE. O trabalho da página é um só:
fazer a pessoa confiar na imobiliária e sair dali no WhatsApp, com o código
de um imóvel específico. Métrica de sucesso: cliques no botão de WhatsApp.

Stack: Next.js (App Router) + TypeScript + Tailwind v4, Prisma + PostgreSQL.

## Como rodar localmente

Você precisa de um banco Postgres pra desenvolver (não tem mais fallback
SQLite). O jeito mais rápido é criar um banco gratuito em
[neon.com](https://neon.com) ou [supabase.com](https://supabase.com) — ou,
se o projeto já está conectado à Vercel, rodar `vercel env pull .env` (passo
3 do guia de deploy abaixo) pra puxar a conexão de lá.

```bash
npm install
cp .env.example .env     # depois edite DATABASE_URL e DATABASE_URL_UNPOOLED
npx prisma migrate dev   # cria as tabelas no Postgres
npm run db:seed          # corretores reais + 8 imóveis de exemplo em Aracaju
npm run dev
```

Acesse http://localhost:3000.

Login do painel administrativo criado pelo seed:
- E-mail: `admin@munizimoveis.com`
- Senha: `admin123`

**Troque essa senha antes de ir para produção.** Ainda não existe uma tela
no admin pra isso — se precisar, me avise que eu construo. Por ora, é um
ajuste manual no banco.

## Variáveis de ambiente (`.env`)

| Variável | Para que serve |
| --- | --- |
| `DATABASE_URL` | Conexão **pooled** do Postgres — usada pela aplicação |
| `DATABASE_URL_UNPOOLED` | Conexão **direta** (sem pooler) — usada só pelo Prisma CLI (migrations) |
| `APP_URL` | URL pública do site — usada em metadata, OG e JSON-LD |
| `AUTH_SECRET` | Segredo do cookie de sessão do admin — gerar com `openssl rand -hex 32` |
| `MERCADOPAGO_ACCESS_TOKEN` | Só necessário se o fluxo de reserva/pagamento online (`/reservas`) for reativado — ver nota abaixo |

## Deploy na Vercel, passo a passo

### 1. Subir o código pra um repositório Git
Se ainda não fez isso, crie um repositório no GitHub e suba os arquivos do
projeto (o `.gitignore` já exclui `node_modules`, `.next` etc.).

### 2. Criar o projeto na Vercel
[vercel.com](https://vercel.com) → **Add New → Project** → importe o
repositório. Não precisa mexer em nenhuma configuração de build — a Vercel
detecta Next.js automaticamente.

### 3. Criar o banco Postgres
Dentro do projeto na Vercel:
1. Aba **Storage** → **Create Database** → escolha **Postgres**.
2. Depois de criado, em **Connect Project**, selecione este projeto e marque
   os ambientes Production, Preview e Development.
3. Isso já cria sozinho as variáveis `DATABASE_URL` (pooled) e
   `DATABASE_URL_UNPOOLED` (direta) no projeto — não precisa copiar nada
   manualmente.

### 4. Configurar as outras variáveis de ambiente
Em **Settings → Environment Variables**, adicione:
- **`AUTH_SECRET`** — gere com `openssl rand -hex 32` no seu terminal e
  cole o valor. Não deixe o padrão de desenvolvimento.
- **`APP_URL`** — a URL que a Vercel te dá depois do primeiro deploy (ex:
  `https://muniz-imobiliaria.vercel.app`). Pode voltar aqui e preencher
  depois do passo 6.
- **`MERCADOPAGO_ACCESS_TOKEN`** — opcional, só se for usar o fluxo de
  pagamento online (`/reservas`). Pode deixar em branco.

### 5. Aplicar as migrations e popular o banco de produção
A Vercel builda e sobe o site, mas **não roda migration nem seed sozinha**.
Isso você faz uma vez, do seu computador:

```bash
npm install -g vercel     # se ainda não tiver a CLI da Vercel
vercel link               # conecta esta pasta ao projeto que você criou na Vercel
vercel env pull .env      # baixa as variáveis reais (banco incluso) pro .env local
npx prisma migrate deploy # cria as tabelas no banco de produção
npm run db:seed           # cadastra os corretores reais e os imóveis de exemplo
```

### 6. Deploy
Se o repositório já está conectado, a Vercel já fez o primeiro deploy
sozinha assim que você importou o projeto. Todo `git push` na branch
principal a partir de agora dispara um novo deploy automaticamente.

### 7. Testar no ar
Abra a URL que a Vercel deu pro projeto, depois `/admin/login` com
`admin@munizimoveis.com` / `admin123`.

**Atenção:** o upload de foto de corretor/depoimento no admin ainda salva
em disco local (`public/uploads/`) — na Vercel isso **não persiste** entre
deploys (mesmo problema que expliquei sobre SQLite, mas agora só afeta
fotos, já que o banco está resolvido). Pra corrigir isso — trocar por um
bucket externo tipo Cloudflare R2 — é só pedir.

## Estrutura do site público

1. **Home (`/`)** — hero, busca (bairro/quartos/preço), vitrine de destaques,
   caução sem fiador, como funciona, time, depoimentos, captação de
   proprietário, footer com CRECI/endereço/mapa.
2. **Catálogo (`/imoveis`)** — filtro por bairro/quartos/preço **refletido na
   URL** (`/imoveis?bairro=Jardins&quartos=2&max=1500`), pra corretor poder
   mandar link já filtrado pelo WhatsApp.
3. **Ficha do imóvel (`/imoveis/[codigo]`)** — galeria, planta baixa,
   composição de custo completa (aluguel + condomínio + IPTU = total mensal,
   e caução em destaque), características, mapa do bairro, corretor
   responsável, imóveis semelhantes, CTA fixo (Tenho interesse / Agendar
   visita) e JSON-LD `RealEstateListing`.
4. **Painel administrativo (`/admin`)** — cadastro/edição de imóveis (código,
   tipo, status, bairro, custos, corretor, fotos), **corretores** (nome,
   CRECI, WhatsApp individual, foto — upload direto, sem precisar de URL
   externa), **depoimentos** (publicar/despublicar/excluir), **dados da
   empresa** (nome, CRECI, WhatsApp central, endereço, horário, redes
   sociais — o que aparece no header/footer/mapa do site inteiro), reservas,
   pagamentos e o texto do contrato. **Tudo isso é editável sem mexer em
   código** — a ideia é que o dia a dia da imobiliária não dependa de
   ninguém programando.

## Decisão de arquitetura: WhatsApp é a conversão, não o checkout online

A versão anterior deste projeto foi construída como uma plataforma de
autoatendimento (reserva → pagamento no Mercado Pago → assinatura eletrônica
→ contrato em PDF, tudo pelo site). Essa infraestrutura **continua
funcionando** (`/reservas/*`, `/api/reservations`, `/api/webhooks/mercadopago`,
`/api/contracts/*`, o editor de template de contrato no admin) mas não está
mais linkada a partir da home nem da ficha do imóvel — o objetivo mudou para
um site de captação que manda a pessoa pro WhatsApp com o código do imóvel,
não pra um checkout de R$300 sozinho. Se um dia fizer sentido reativar
autoatendimento (ex: um fluxo interno pós-primeiro-contato), a base já existe.

## O que ainda é placeholder (marcado explicitamente na interface)

Nada foi inventado. Onde falta dado real, a interface mostra um aviso
honesto em vez de conteúdo fabricado:

- **Fotos dos imóveis** — nenhum imóvel tem foto real ainda. Aparece o
  placeholder "Foto em breve" (nunca banco de imagens). Editável em
  `/admin/imoveis/[id]/editar`, campo "URLs das fotos reais".
- **Depoimentos** — nenhum publicado ainda. Cadastrar/publicar em
  `/admin/depoimentos`.
- **Endereço físico, horário de atendimento e redes sociais** — em branco
  até alguém preencher em `/admin/empresa`. Enquanto o endereço (rua/bairro)
  não for preenchido, o rodapé mostra um aviso honesto em vez de inventar
  endereço, e o mapa centraliza só na cidade.
- **WhatsApp individual dos corretores** — os 3 corretores já cadastrados
  (Alan Cabral, Alessandra Alves, Diogo Breda Frota De Almeida, com fotos e
  CRECI reais) usam o WhatsApp central da imobiliária por ora — troque em
  `/admin/corretores` quando cada um tiver número próprio. Nas fichas de
  imóvel, o CTA já usa automaticamente o WhatsApp do corretor responsável
  se um estiver atribuído ao imóvel.
- **Planta baixa** — campo existe (`floorPlanUrl`) mas nenhum imóvel tem
  ainda; aparece "Planta baixa em breve".

## O que falta revisar antes de ir ao ar

- **Texto do contrato** (editável em `/admin/contrato`): revisar com
  advogado antes de usar em contratos reais (Lei do Inquilinato).
- **Upload de fotos**: hoje salva em `public/uploads/` no disco local do
  servidor — funciona bem em um servidor único, mas em hospedagem serverless
  ou com múltiplas instâncias (ex: Vercel) os arquivos não persistem entre
  deploys. Nesse caso, trocar por um bucket (S3/R2) antes de ir ao ar.
- **Senha do admin**: ainda não tem tela pra trocar — só existe a criada
  pelo seed. Pedir pra eu adicionar antes de dar a senha pra alguém de
  verdade usar.
- **`next.config.ts`**: quando fotos reais forem hospedadas externamente,
  adicionar o domínio em `images.remotePatterns`.
- **Analytics**: `src/lib/analytics.ts` já dispara `view_property` e
  `click_whatsapp` pro `dataLayer` — falta só plugar GTM/GA4 (nenhum pixel
  instalado ainda, de propósito).
- **LGPD**: revisar política de privacidade, já que o site guarda dados de
  quem reserva pelo fluxo antigo (CPF, telefone).
