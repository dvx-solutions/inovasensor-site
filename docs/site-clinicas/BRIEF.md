# InovaSensor · IA na operação de clínicas (brief mestre)

Todo agente lê este arquivo inteiro antes de construir ou dar nota.

## 0. Fontes, em ordem de autoridade
1. Pedido do Bil de 29/10/2026 (regras abaixo) e o formulário do anúncio em `DEVEX/src/guarda-meta/leads.py` (`PERGUNTAS`).
2. Peças já aprovadas: `DEVEX/docs/mentoria-ia/clinicas/folder-clinicas.png` e `texto-grupo.md` (mesma promessa e mesmos 6 exemplos).
3. Página `/privacidade` (já no ar, PR #10). Não muda.
O site antigo (mentoria de IA para empresas) está desatualizado: nada dele entra como fato.

## 1. Assunto, público e trabalho da página
- **O que é:** a InovaSensor mapeia a operação da clínica, coloca IA nos processos repetitivos e treina o time para usar na rotina. Serviço contínuo, mensal.
- **Público único:** dono(a), sócio(a) ou gestor(a) de clínica pequena ou média (odonto, médica, estética, fisio), chegando do Instagram/Facebook pelo celular.
- **Ângulo:** a recepção é uma pessoa só fazendo tudo. A IA tira o repetitivo das costas dela. Não é robô falando com paciente.
- **Mensagem central:** "IA trabalhando na sua clínica. As pessoas mantêm o comando." (versão para clínicas de "IA trabalhando na sua empresa. As pessoas mantêm o comando.")
- **Ação principal (única):** pedir a avaliação gratuita, no formulário da seção 05 (`#avaliacao`, `data-cta="avaliacao"`). Rótulo único em toda a página: **"Quero a avaliação gratuita"**. Sem WhatsApp como CTA concorrente.
- **Ordem do argumento:** é pra mim (hero) → a dor que ele reconhece (rotina) → o que muda na prática (6 exemplos) → como funciona e por que confiar → formulário.

## 2. Fatos que PODEM ser usados
- Os 6 exemplos, com o detalhe do texto do grupo: agenda sem cadeira vazia (confirmação e lembrete na véspera e no dia, vaga liberada vai para lista de encaixe); paciente sumido de volta (lista de quem não vem há 6 ou 12 meses, com mensagem pronta para limpeza, manutenção ou revisão); orçamento que fecha (orçamento claro a partir das anotações do doutor e acompanhamento de quem não respondeu); pós-consulta (cuidados, lembrete do retorno, pedido de avaliação no Google); respostas prontas no WhatsApp (preço, convênio, endereço, preparo, enviadas pela recepcionista com um clique); números da semana (consultas, faltas, orçamentos em aberto e faturamento num resumo simples, sem planilha).
- Três partes do serviço: mapear a operação, aplicar IA nos processos, capacitar o time na rotina. É contínuo (acompanhamento mensal).
- Preço: **não mostrar valor.** Pode dizer que é um serviço mensal e que o investimento é combinado depois da avaliação, conforme o tamanho da operação.
- Avaliação gratuita, sem compromisso. Depois do envio, a equipe chama no WhatsApp informado para marcar.
- Prova real única: o mesmo método já roda em agências de viagem da primeira turma. **Sem nomes.**
- Quem somos: Gustavo e Guilherme Bilonia, InovaSensor, Parque de Inovação Tecnológica de São José dos Campos.
- Privacidade: não pedimos dados de pacientes (está na política).

## 3. NÃO publicar / não inventar
- Nenhum número de resultado (horas, % de faltas, faturamento), nenhum depoimento, nenhum logo ou nome de cliente.
- Não vender "IA de atendimento", "chatbot", "assistente virtual que conversa com o paciente", "atendimento 24h".
- Não prometer integração com sistema específico de agenda/prontuário, nem prazo de retorno.
- Não citar fornecedor ou modelo de IA.
- Exemplos visuais (respostas prontas, resumo da semana) levam o rótulo "Exemplo" e dados fictícios.
- Nunca "DevEx". A empresa é InovaSensor (parceira da Devex Soluções; não precisa aparecer).

## 4. Voz
Conversa de dono para dono, PT-BR simples, frases curtas, verbos concretos. Sem jargão de IA, sem "revolucionar", "potencializar", "solução", "plataforma", "jornada". Sem travessão (— ou –). Bom: "Confirma a agenda de amanhã sem ninguém parar para ligar." Ruim: "Otimize seus fluxos com inteligência artificial de ponta."

## 5. Design system
- **Design read:** landing de tráfego pago, celular primeiro, clara, humana e confiável; congruente com a peça do anúncio (ameixa + rosa).
- **Dials:** variance 5, motion 3, density 4.
- **Tema único claro.** Fundo `#fbf7f8`, superfície `#ffffff`, tinta `#24101d` (ameixa quase preta), texto secundário `#5c4653`, linha `#ead9e1`. **Um acento:** rosa `#c21e56` (hover `#a3174a`), tom claro `#fbe6ee`. Bloco de ênfase em ameixa `#2a1222` com texto claro (mesmo tema, só um tom mais fundo, como na peça).
- **Tipografia:** Sora (títulos, 600) + IBM Plex Sans (texto), já hospedadas em `/mentoria-assets/fonts`. Mono só para rótulos de exemplo.
- **Forma:** botões em pílula; cartões e campos com raio 14px; chips em pílula. Nada de sombra preta: sombra tingida de ameixa.
- **Imagens:** `/clinicas-assets/recepcao-*.webp` (hero) e `/clinicas-assets/balcao-*.webp` (método), geradas para o site, sem texto. Não representam cliente real.
- **Ícones:** Phosphor (SVG inline copiado do pacote, traço regular), nada desenhado à mão.

## 6. Contrato técnico
- TanStack Start + React 19, rota `/` em `app/routes/index.tsx`, componentes em `app/components/clinicas/`, CSS escopado em `.clinicas`.
- `/privacidade` continua igual. `/mentoria-ia` continua redirecionando para `/`.
- Formulário em 3 passos no próprio fluxo da página (sem modal), perguntas e chaves idênticas ao anúncio, mais nome, WhatsApp, cidade e nome da clínica, consentimento com link para `/privacidade`, honeypot `website`, UTM/fbclid em `origem`.
- `POST /api/leads` grava em Vercel Blob privado (`leads/<id>.json`, sem sobrescrever: reenvio não duplica). `GET /api/leads?desde=<ISO>` com `Authorization: Bearer <SITE_LEADS_TOKEN>` devolve `{leads:[...], total, mais}`, só com criado_em > desde, em ordem crescente.
- Sem bibliotecas de animação. Movimento só por CSS e IntersectionObserver, desligado em `prefers-reduced-motion`. LCP é a foto do hero (pré-carregada, `fetchpriority=high`).
- Celular: alvos de toque ≥ 44px, barra fixa com o CTA que some quando o formulário está na tela, sem rolagem horizontal em 360px.

## 7. Seções (no máximo 5)
01 `inicio` · hero dividido: texto + foto da recepção.
02 `rotina` · "Uma recepcionista. Dez funções.": o que fica com ela e o que a IA prepara.
03 `exemplos` · os 6 exemplos em grade com ritmo (bento de 6 células, 2 com exemplo visual rotulado).
04 `como` · mapear, aplicar, capacitar; mensal; prova das agências; quem somos; o que não fazemos.
05 `avaliacao` · formulário em 3 passos + o que acontece depois + rodapé.
