# Preferência de Deploy Automático

## Regra
Realizar deploy na Vercel automaticamente toda vez que o usuário pedir para atualizar o código do projeto munizimobiliaria3.

## Motivo
O usuário quer agilidade no ciclo de desenvolvimento e validação visual imediata das alterações em produção/staging sem precisar acionar o deploy manualmente.

## Como aplicar
Após concluir qualquer alteração de código (edição, criação de arquivos, correções), executar o comando de deploy da Vercel (`vercel --prod` ou equivalente) como parte do fluxo de entrega. Confirmar o sucesso do deploy e fornecer o link de preview/produção ao usuário. Se o CLI não estiver autenticado ou instalado, orientar o usuário sobre os passos necessários antes de prosseguir.