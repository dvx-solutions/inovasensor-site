# Mentoria IA — integração no site InovaSensor

A experiência da mentoria está em `/mentoria-ia`, com privacidade em `/mentoria-ia/privacidade`. A home atual do AlgEye e as demais rotas permanecem no projeto. A posição definitiva da mentoria na navegação/home deve ser confirmada na revisão da PR.

## Conteúdo e apresentação

Componentes React em `app/components/mentoria/`, estilos isolados em `.mentoria-site`, fontes e imagens locais em `/mentoria-assets/`. A cena Three.js é carregada sob demanda. A página conserva scroll nativo, quatro etapas visuais de uma demanda, método, responsável, relato Devex, jornada de seis meses e avaliação em seis etapas.

Nome público: Gustavo Bilonia. A página não apresenta preços da mentoria. As faixas de receita são perguntas de qualificação. Exemplos operacionais são ilustrativos; o relato Devex continua sem período/amostra documentados e não é garantia de resultado.

## Onde as avaliações são gravadas

O navegador envia para `POST /api/mentoria/leads` na mesma origem. O handler do servidor valida origem, JSON, tamanho, schema, consentimento e honeypot, e encaminha ao receptor fixo da mentoria já em produção:

`https://inovasensor-mentoria-ia.gustavobilonia.chatgpt.site/api/leads`

O banco D1 existente continua sendo a fonte das avaliações, com cálculo de classificação e idempotência por identificador/e-mail. A interface confirma sucesso somente após receber um recibo válido. O proxy não encaminha cookies, autorização ou identidade do visitante; não exige credencial de bypass.

**Manter o Site receptor ativo, público e com API compatível.** Este PR adapta o frontend e mantém o armazenamento existente; não migra o banco. O painel de consulta e CSV continua restrito em:

`https://inovasensor-mentoria-ia.gustavobilonia.chatgpt.site/admin`

GET/HEAD no novo endpoint não permitem consulta das avaliações. Não há notificações automáticas, CRM ou novo banco configurados por este PR. O fluxo de leads do AlgEye permanece separado.

## Verificação

```text
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test:mentoria
pnpm build
```

Os 15 testes do proxy usam respostas simuladas: validam proteção, encaminhamento, falhas e contrato do recibo sem enviar avaliações à produção. A interface foi conferida em desktop e mobile, com abertura/fechamento do formulário, envio interceptado, privacidade, fontes, imagens e ausência de overflow. Isso não comprova uma nova gravação entre a hospedagem Vercel e o Sites em produção.

## Revisão e publicação

Preview da experiência original: https://inovasensor-mentoria-ia.gustavobilonia.chatgpt.site/

Revisar esta PR antes do merge. Se o preview Vercel bloquear o autor por permissão no time, a publicação deve ser feita por um integrante autorizado; não alterar a autoria para contornar a verificação.

Logo, foto e fontes foram obtidas do domínio oficial da InovaSensor. A distribuição Three.js preserva sua licença MIT junto aos arquivos vendorizados.
