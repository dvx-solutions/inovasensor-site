# InovaSensor · IA na operação de clínicas (brief mestre v2)

Todo agente lê este arquivo inteiro antes de construir ou dar nota.

## Por que existe a v2
A v1 foi reprovada pelo Bil: "sem vida, morto, horroroso". Era uma landing clara, bege, estática, com foto + texto + cartões. **A v2 tem de parecer viva**: a página mostra a IA trabalhando, em movimento, atrás da recepção. Quem abre do Instagram tem de pensar "olha isso funcionando" nos primeiros 3 segundos. Nada de seção que é só título + parágrafo + 3 cartões iguais.

## 0. Fontes, em ordem de autoridade
1. Pedido do Bil (regras abaixo) e o formulário do anúncio em `DEVEX/src/guarda-meta/leads.py` (`PERGUNTAS`).
2. Peças já aprovadas: `DEVEX/docs/mentoria-ia/clinicas/folder-clinicas.png` e `texto-grupo.md` (mesma promessa e mesmos 6 exemplos).
3. Página `/privacidade` (já no ar). Não muda.
O site antigo (mentoria de IA para empresas) e a v1 não são fonte de fato.

## 1. Assunto, público e trabalho da página
- **O que é:** a InovaSensor mapeia a operação da clínica, coloca IA nos processos repetitivos e treina o time para usar na rotina. Serviço contínuo, mensal.
- **Público único:** dono(a), sócio(a) ou gestor(a) de clínica pequena ou média (odonto, médica, estética, fisio), chegando do Instagram/Facebook pelo celular.
- **Ângulo:** a recepção é uma pessoa só fazendo tudo. A IA prepara o repetitivo por trás; a recepcionista revisa e aprova com um clique. **Não é robô falando com paciente.**
- **Mensagem central:** "IA trabalhando na sua clínica. As pessoas mantêm o comando."
- **Ação principal (única):** pedir a avaliação gratuita no formulário da seção 05 (`#avaliacao`). Rótulo único em toda a página: **"Quero a avaliação gratuita"**, com `data-cta="avaliacao"` e `data-cta-pos="<onde>"`. Sem WhatsApp como CTA concorrente.
- **Ordem do argumento:** é pra mim + veja funcionando (hero vivo) → o dia caótico que ele reconhece e o que muda (antes/depois) → os 6 exemplos clicáveis → como funciona e por que confiar → formulário.

## 2. Fatos que PODEM ser usados
- Os 6 exemplos: **agenda sem cadeira vazia** (confirmação e lembrete na véspera e no dia; vaga liberada vai para a lista de encaixe); **paciente sumido de volta** (lista de quem não vem há 6 ou 12 meses, com mensagem pronta para limpeza, manutenção ou revisão); **orçamento que fecha** (orçamento claro a partir das anotações do doutor e acompanhamento de quem não respondeu); **pós-consulta** (cuidados, lembrete do retorno, pedido de avaliação no Google, prontos para a recepção enviar); **respostas prontas no WhatsApp** (preço, convênio, endereço, preparo, enviadas pela recepcionista com um clique); **números da semana** (consultas, faltas, orçamentos em aberto e faturamento num resumo simples, sem planilha).
- Três partes do serviço: mapear a operação, aplicar IA nos processos, capacitar o time na rotina. É contínuo (acompanhamento mensal).
- Preço: **não mostrar valor.** Pode dizer que é serviço mensal e que o valor é combinado depois da avaliação, conforme o tamanho da operação.
- Avaliação gratuita, sem compromisso, uns 2 minutos para pedir. Depois do envio, a equipe chama no WhatsApp informado para marcar.
- Prova real única: o mesmo método já roda no dia a dia de agências de viagem que atendemos (primeira turma). **Sem nomes, sem números.**
- Quem somos: Gustavo e Guilherme Bilonia, InovaSensor, Parque de Inovação Tecnológica de São José dos Campos.
- Privacidade: não pedimos dados de pacientes.

## 3. NÃO publicar / não inventar
- Nenhum número de resultado (horas, % de faltas, faturamento, "x tarefas por dia"), nenhum depoimento, nenhum logo ou nome de cliente, nenhuma "avaliação 5 estrelas".
- Não vender "IA de atendimento", "chatbot", "assistente virtual que conversa com o paciente", "atendimento 24h", "responde sozinha". Em toda demo, **quem envia é a pessoa** (botão "Enviar" / "Aprovar" clicado pela recepção; a IA só "preparou").
- Não prometer integração com sistema específico de agenda/prontuário, nem prazo de retorno.
- Não citar fornecedor ou modelo de IA.
- Toda demo animada leva o rótulo visível **"Demonstração · dados fictícios"** e usa nomes de paciente claramente fictícios e primeiro nome só (ex.: "Ana", "Marcos").
- Nunca "DevEx". A empresa é InovaSensor.

## 4. Voz
Conversa de dono para dono, PT-BR simples, frases curtas, verbos concretos. Sem jargão de IA, sem "revolucionar", "potencializar", "solução", "plataforma", "jornada", "inovador". **Sem travessão (— ou –)** em nenhum texto visível. Bom: "Confirma a agenda de amanhã sem ninguém parar para ligar." Ruim: "Otimize seus fluxos com inteligência artificial de ponta."

## 5. Design system (v2: viva)
- **Design read:** landing de tráfego pago, celular primeiro, com energia de produto: interfaces vivas animadas sobre fundo ameixa profundo, rosa vibrante como luz. Congruente com a peça do anúncio (ameixa + rosa), mas com contraste e movimento.
- **Dials:** variance 7, motion 7, density 5.
- **Ritmo de temas (obrigatório):** 01 escuro · 02 claro (com o "depois" virando escuro) · 03 escuro · 04 claro · 05 escuro com brilho rosa. Costuras sem linha dura (gradiente ou curva).
- **Tokens (em `app/components/clinicas/base.css`, NÃO redefinir nas seções):**
  - escuro: `--noite #14070f` (fundo), `--noite-2 #1f0d18` (superfície), `--noite-3 #2c1424` (cartão), `--noite-linha rgba(255,255,255,.10)`, texto `--luz #fbeff4`, secundário `--luz-2 #c9aebb`.
  - claro: `--papel #fbf5f7`, `--papel-2 #ffffff`, `--tinta #1f0a17`, `--tinta-2 #5a4350`, `--papel-linha #ecdbe3`.
  - acento: `--rosa #ff2d78` (luz, brilho, destaques em fundo escuro), `--rosa-forte #d4145a` (botões e texto em fundo claro, contraste AA), `--rosa-claro #ffe3ee`, `--coral #ff8a5c` (só em gradiente com o rosa), `--ok #2fd38a` (check de "aprovado/enviado").
  - `--raio 18px`, `--raio-sm 12px`, sombras tingidas de ameixa ou brilho rosa (`--brilho`).
- **Tipografia:** display **Bricolage Grotesque Variable** (`--f-display`, peso 600–800, letter-spacing negativo, títulos GRANDES: h1 até 76px no desktop, 40–44px no celular); texto **IBM Plex Sans** (`--f-texto`); **Plex Mono** (`--f-mono`) só em rótulos de demo, horários e chips.
- **Forma:** botões em pílula com gradiente rosa→coral sutil e brilho no hover; cartões de interface com vidro escuro (`backdrop-filter` com fallback sólido); chips em pílula.
- **Imagens:** `/clinicas-assets/recepcao-*.webp` (recepcionista no balcão) e `/clinicas-assets/balcao-*.webp`. Podem ser recortadas, escurecidas, com cartões de interface flutuando por cima. Não representam cliente real. Foto do Gustavo em `/mentoria-assets/brand/gustavo.webp`.
- **Ícones:** só os de `app/components/clinicas/icons.tsx` (Phosphor como path). Precisa de outro? copie o path do Phosphor regular (MIT) para lá e avise no relatório.
- **Movimento:** GSAP 3.13 (+ ScrollTrigger) já instalado; use `import {gsap, ScrollTrigger} from '../motion'` (registra uma vez). Tudo dentro de `useEffect` com `gsap.context(..., ref)` e `ctx.revert()` no cleanup. Com `prefers-reduced-motion: reduce`: sem loops, sem pin, estado final estático e completo. Animação nunca esconde conteúdo se o JS falhar (o HTML inicial já é legível; o JS só anima a partir dele, ou usa `gsap.from` com `immediateRender` dentro do contexto).
- **Composição:** assimétrica, nada de "3 cartões iguais lado a lado". Cada seção tem uma peça viva que só ela tem.

## 6. Contrato técnico
- TanStack Start + React 19. Rota `/` em `app/routes/index.tsx` renderiza `Landing` (`app/components/clinicas/Landing.tsx`: topo, rodapé, barra fixa do celular, ordem das seções). Não edite rotas.
- **Cada seção = 2 arquivos próprios** em `app/components/clinicas/secoes/`: `<Nome>.tsx` (export default) + `<nome>.css` (importado pelo próprio tsx). CSS **100% escopado** no seletor da seção (`.s-<id> ...`). Construtor só edita os seus 2 arquivos (o da seção 05 edita também `Avaliacao.tsx`, só a marcação/estilo, nunca a lógica de validação/envio).
- `<section id="<id>" className="s-<id>" data-tema="escuro|claro" aria-labelledby="<id>-titulo">`.
- `/privacidade` continua igual. `/api/leads` (POST/GET) e `model.ts` não mudam.
- Formulário: 3 passos (Sua clínica · Sua prioridade · Para onde a gente responde), perguntas e chaves idênticas ao anúncio, nome, WhatsApp, cidade, clínica, consentimento com link `/privacidade`, honeypot `website`. Já implementado em `Avaliacao.tsx` (trava de toque duplo, rascunho sem dados pessoais, erros com foco, timeout). Mantém tudo isso.
- **3D (pedido explícito do Bil: "o site precisa ter 3D, elementos fodas e diferenciados"):** Three.js 0.170 instalado (`import * as THREE from 'three'`). Carregue a cena com `import()` dinâmico dentro do `useEffect` (nunca no SSR), um contexto WebGL por cena, `renderer.setPixelRatio(Math.min(devicePixelRatio, celular ? 1.5 : 2))`, render pausado fora da tela e com `document.hidden`, `dispose()` de geometrias/materiais/renderer no cleanup, resize por `ResizeObserver`. Sem WebGL ou com reduced-motion: fallback 2D bonito e completo (SVG/CSS), nunca tela vazia. Mira de 60fps em notebook comum e celular médio: poucas centenas de objetos, materiais simples (`MeshPhysicalMaterial` só em poucos objetos grandes), sem sombras em tempo real.
- Performance: LCP é o título do hero (texto, não o canvas). Sem vídeo. Animações em `transform/opacity`. Loops pausam fora da tela (IntersectionObserver ou ScrollTrigger `toggleActions`) e com `document.hidden`.
- Celular: alvos de toque ≥ 44px, sem rolagem horizontal em 360px, pin de ScrollTrigger só em `min-width: 900px` (no celular, versão vertical sem pin), barra fixa com o CTA que some quando o formulário está na tela.
- Acessibilidade: demos animadas com `aria-hidden` no enfeite e um resumo em texto real para leitor de tela; abas com `role=tablist`; contraste AA; foco visível.

## 7. Seções (no máximo 5)
01 `inicio` · **escuro**. "A recepção ao vivo", com **cena 3D**. Esquerda: título enorme ("IA trabalhando na sua clínica." / "As pessoas mantêm o comando." em rosa), uma frase, CTA, garantia curta. Direita (no celular, atrás/abaixo do texto, ~380px): **Three.js**: um núcleo luminoso rosa (a IA: esfera com anel/halo, pulsando devagar) e ao redor **cartões de vidro 3D** (caixas finas arredondadas com ícone/rótulo em textura de canvas: WhatsApp, Agenda, Orçamento, Retorno, Pós-consulta, Resumo da semana) girando em órbitas bagunçadas = o caos da recepção. A cada ~4 s um cartão é "puxado" pelo núcleo, passa por ele e sai **arrumado** numa pilha organizada à frente, com um selo verde "Aprovado pela recepção" (o humano no comando). Mouse/toque inclina a cena (lerp); clique/tap num cartão (raycaster) o traz para frente e mostra legenda mono do que a IA preparou. Por cima, um **cartão 2D vivo** (HTML) em loop: mensagem chega ("Tem horário amanhã de manhã?") → "IA preparou a resposta" digitando → toque em "Enviar" → "Enviado pela Júlia" com check verde. Rótulo "Demonstração · dados fictícios". Entrada: palavras do h1 sobem em sequência. Fallback sem WebGL: composição SVG/CSS estática dos cartões ao redor do núcleo.
02 `rotina` · **claro**. "Uma recepcionista. Dez funções." Um dia na recepção: relógio que avança (07:58 → 18:40) com as coisas caindo em cima dela (telefone, WhatsApp, paciente no balcão, orçamento, falta, retorno, planilha), empilhando de forma caótica. Um controle **"Sem IA / Com IA por trás"** (toggle grande) reorganiza a bagunça numa fila arrumada: "Continua com ela" (falar com o paciente, decidir, acolher) × "A IA prepara" (rascunhos, listas, lembretes, resumo). Desktop pode usar pin + scrub; celular, sequência vertical que anima ao entrar. Fecha com: "Não é robô falando com paciente. É a IA preparando o trabalho para a sua equipe."
03 `exemplos` · **escuro**. "O que sai das costas da recepção". **Explorador 3D**: os 6 exemplos são 6 nós (ícones em discos/cápsulas de vidro) num anel inclinado ao redor de um núcleo, ligados por linhas com pulsos de luz. Arrastar gira o anel; clique num nó (raycaster) gira o anel até trazê-lo à frente e ele cresce. Sincronizado com um **painel interativo**: abas (Agenda · Pacientes sumidos · Orçamentos · Pós-consulta · Respostas prontas · Números da semana) e, ao lado, uma mini-tela que se anima ao trocar de aba (lista de confirmações sendo marcadas, lista de sumidos com "mensagem pronta", orçamento montado a partir da anotação do doutor, sequência pós-consulta, chips de resposta rápida virando mensagem, resumo da semana com barras). Todas com "Demonstração · dados fictícios". Avança sozinho devagar só enquanto visível e sem interação; parar ao tocar. Celular: canvas menor (~300px) em cima, abas em chips roláveis, tela embaixo. Fallback sem WebGL: anel SVG 2D com os mesmos 6 botões.
Seções 02 e 04 não usam WebGL (no máximo 2 contextos na página), mas têm profundidade: CSS 3D (`perspective`, cartões que inclinam com o mouse/scroll, camadas em parallax), trilha SVG desenhada no scroll.
04 `como` · **claro**. "Como funciona": Mapear a operação → Aplicar IA nos processos → Capacitar o time, ligados por uma trilha SVG que se desenha no scroll e fecha em laço "todo mês a gente acompanha e ajusta". Linha de preço (serviço mensal, valor combinado depois da avaliação). Bloco de confiança: prova das agências de viagem + Gustavo e Guilherme Bilonia (foto do Gustavo), Parque de Inovação Tecnológica de São José dos Campos. "O que a gente não faz" (não troca sua equipe, não fala com paciente no lugar dela, não pede dados de pacientes, não amarra você a sistema novo).
05 `avaliacao` · **escuro com brilho rosa**. "Veja o que dá para tirar das costas da sua recepção". Texto curto + os 3 passos do depois + o formulário (`<Avaliacao />`) num cartão claro de alto contraste que salta do fundo escuro. Rodapé fica no Landing.
