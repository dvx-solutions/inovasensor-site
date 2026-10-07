# Algeye — novo site (brief mestre)

Documento de referência para todos os agentes. Leia INTEIRO antes de escrever uma linha. **Régua escolhida pelo Bil (06/10/2026): regras novas, estritas.**

## 0. Fontes, em ordem de autoridade

1. `C:\Users\albil\claude\algeye-produto-validado.md` (02/10/2026): o que o produto comprovadamente faz e o que NÃO pode ser prometido.
2. Skill `algeye-post` (`C:\Users\albil\.claude\skills\synced\5f0d0ee6-bc1b-41db-b7fe-cc192ce9e28f_78e25b4e-fe34-4e5f-bc00-e4774c8edd8b\algeye-post\SKILL.md`): marca, voz, as **14 regras que bloqueiam publicação**, identidade visual. Valem para o site.
3. Site atual (referência de estrutura e do que NÃO repetir): `C:\Users\albil\inovasensor-site` (copy em `app/lib/copy.ts`, ordem em `app/components/Page.tsx`). Ele promete coisas hoje proibidas (14 dias, leitura diária, CASAL, Guarapiranga, 3 m/pixel, NDCI).
4. App (fonte de telas e estados reais): `C:\Users\albil\Algeye\apps\web` e `docs/telas/*.md`.

Somente leitura em todos esses caminhos. Este site é um projeto estático separado.

## 1. Assunto, público e o trabalho da página

- **O que é:** Algeye, um produto **InovaSensor**, reúne imagens de satélite e processamento com IA para apoiar o monitoramento de algas em reservatórios. **A represa é a unidade.** A plataforma reúne mapa das observações, consulta a passagens anteriores (histórico), pontos de interesse, alertas configuráveis, acompanhamento de ocorrências, registro de coletas e relatórios. Zero hardware no cliente.
- **Público:** quem decide e opera água bruta: gerente de ETA e de qualidade da água em concessionárias de saneamento; meio ambiente, licenciamento e operação em hidrelétricas; agências de água e comitês de bacia; aquicultura e indústria com captação. Técnico, cético, compra por confiança e rastreabilidade. Chega por LinkedIn, indicação, evento e Instagram.
- **Trabalho da página:** fazer o comprador pedir uma **avaliação do reservatório** (formulário `#avaliacao`). Saídas secundárias: WhatsApp e "Mande MAPA no direct" no Instagram @alg.eye.
- **Tagline:** "Veja a represa inteira." Propósito: nenhuma represa brasileira cuidada às cegas. Causa: "Toda represa merece ser vista inteira." Slogan, **só no fechamento** do site: "Água limpa não deveria depender de sorte. Deveria depender de dados."
- **Abertura (ideia do Bil):** o site começa **no satélite**, desce até a **represa**, **entra na água** e daí segue o site normal. Hoje isso é feito com ilustração leve; depois vira um voo em vídeo gerado no Higgsfield (seção 7).

## 2. Fatos que PODEM ser usados (comprovados)

- Mapa das observações e consulta a passagens anteriores (histórico); a represa como unidade de acompanhamento.
- Três leituras por passagem (sem nomear índices): uma leitura dos sinais de algas, uma estimativa de concentração e a imagem em cor real. Descrever de forma superficial: "o satélite passa, a IA separa a água e procura sinais de algas; o resultado vira mapa, histórico e alerta".
- Pontos de interesse (não equivalem obrigatoriamente a ponto de coleta).
- Regras de alerta: uma regra acionada na avaliação de uma passagem gera uma **ocorrência**. Na ocorrência: assumir, atribuir responsável, comentar, agendar coleta, resolver. Estados: **Aberta, Em análise, Coleta agendada, Resolvida** (não é sequência obrigatória). O histórico guarda as ações.
- Coletas registram resultados de campo/laboratório e permitem **confrontar** com as estimativas. O produto **complementa** o trabalho de campo.
- Relatórios com emissão e armazenamento (formato HTML; **não** dizer PDF).
- Acervo de passagens anteriores para começar com histórico.
- Zero hardware no cliente.
- **Limites (sempre visíveis em algum ponto da página):** nuvem descarta a data daquela passagem; a frequência de observações úteis depende das passagens e das condições; não distingue espécie nem identifica toxina; turbidez pode inflar o sinal; não certifica potabilidade nem substitui laboratório.
- Maturidade: **TRL 4** (pode). "Incubada em programa com AEB e PNUD" (só essa frase, sem logos).
- Equipe (site atual): Marcelo Bilonia (CEO), Guilherme Bilonia (Chief AI Officer), Vinícius Oliveira (CTO), Gustavo Bilonia (CFO). Fotos em `C:\Users\albil\inovasensor-site\public\team\` (pode copiar para `assets/img/team/`).
- Empresa: Inova Sensor LTDA · CNPJ 47.164.317/0001-27 · Vale do Paraíba / São José dos Campos, SP.
- Contato: WhatsApp (12) 98802-8865 → `https://wa.me/5512988028865?text=Quero%20avaliar%20um%20reservat%C3%B3rio%20com%20o%20Algeye` (`data-cta="whatsapp"`); e-mail gustavo.henrique@devexsolucoes.com.br; Instagram @alg.eye ("Mande MAPA no direct"); LinkedIn InovaSensor `https://www.linkedin.com/company/134694128/`.
- Formulário de avaliação (campos do site atual): nome, organização, cargo, e-mail, reservatório (nome ou município). Retorno: "em até dois dias úteis" está no site atual e **precisa de validação** (`data-validate="true"`). No site estático, o envio abre o e-mail (mailto com corpo montado) e oferece WhatsApp; sem back-end.

## 3. NÃO publicar / não inventar (as 14 regras + validado)

1. **CASAL nunca aparece**, nem estado, região, represa ou imagem que permita reconhecer. **SABESP nunca.** Nenhum cliente, negociação ou piloto citado; nenhum dado de piloto, nem agregado.
2. **Método confidencial:** nunca nome de índice (NDCI, clorofila-a como índice etc.), satélite (Sentinel, Planet…), banda, comprimento de onda, algoritmo (nem "Gap Filling" como nome técnico), limiar numérico ou **resolução** (nada de "3 m/pixel").
3. **Nada de prazo de antecipação** ("14 dias", "72 horas"), acurácia (">92%") ou previsão automática operacional. Previsão não pode ser anunciada.
4. **Proibido:** "tempo real", "sensor", "contínuo", "sem barco", "antes de acontecer", "diário/leitura diária", garantias, escassez, prazos de entrega.
5. **CONAR (Anexo U):** verbos permitidos: ajuda a, contribui para, mostra, apoia a decisão, amplia a visão. Proibidos: protege, salva, preserva, garante, previne, elimina. Sem absolutos ("sempre", "100%"). Nada de "sustentável", "reduz custo", "menos químico" sem número autorizado.
6. **Todo número tem fonte.** Os números do site atual (R$ 100–300 mil/ano, 15 a 30 dias, 10×) **não têm fonte no material**: não usar, ou usar só com `data-validate="true"` e um comentário `<!-- PENDENTE: fonte -->` (preferir formulação qualitativa).
7. **Imagens reais:** telas do sistema só recortadas, sem mapa de fundo, nomes, estradas, marcadores, datas e usuário; nunca o contorno completo. **Guarapiranga nunca nomeada.** Nenhum reservatório identificável associado a floração. Preferir **recriar a interface em HTML/SVG com dados fictícios** e rótulo "Demonstração · dados fictícios".
8. **IA não passa por dado:** toda imagem/vídeo gerado por IA leva o aviso "imagem ilustrativa gerada por IA".
9. **Série temporal sem datas e sem escala de distância:** use "passagem 1, passagem 2…".
10. **Nunca sugerir negligência** de operador, agência ou governo; nem risco à saúde de uma água específica. Sem peixe morto, tragédia ou criança como apelo.
11. **ANA 188/2024:** o plano de marketing reserva o tema até ler a fonte oficial. Se usar, só como menção factual curta, com link para gov.br/ana e `data-validate="true"`; nada de "obrigação para todos".
12. **Sem preço** no site. Sem FINEP. Sem Prof. Pompeo (ausente no site atual; não confirmado para uso público).
13. **Nunca travessão (—)** em texto visível.
14. Nunca dizer que o sistema executa coletas em campo; não chamar o produto de "plataforma completa".

## 4. Voz

- Sábio (confiança técnica) + Cuidador (calor humano). Nunca herói ativista; o vilão nunca é o cliente.
- Preocupação ambiental **sem ativismo**: descreve o risco, propõe uma ação possível. Linguagem de operação: prevenção, rastreabilidade, relatório que dá para entregar ao órgão.
- Precisão silenciosa. Frases curtas, PT-BR impecável. Admitir limites é parte da voz.
- Princípio visual: **vida primeiro, dado depois** (abre com água/paisagem, fecha com mapa); preocupação por contraste, nunca por escuridão; luz natural de manhã; pessoas de costas ou só mãos.

## 5. Design system (tokens em `css/base.css`; NÃO edite base.css, core.js nem shell.html)

- **Cores:** `--ink #0A100F` Grafite (fundo escuro), `--ink-2`, `--ink-3`; `--brand #0E5C4A` Verde Algeye (botões, marca); `--brand-2` (texto verde no claro, AA); `--agua #3FB58E` Verde Água e `--agua-2 #39D0A8` (destaque no escuro); `--menta #BFF0DC`; `--paper #F2F5F3` Névoa (fundo claro); `--areia #D8CCB4`/`--areia-2` (só molduras e fundos, ~6%, nunca título ou botão); `--musgo`; `--sinal #D13D2B` (**só alerta**). Escala de risco do mapa, **sem verde**: `--r-baixo #1F5F72` → `--r-leve #2F8A7A` → `--r-moderado #C9B13A` → `--r-alto #E07A2E` → `--r-critico #D13D2B`; projeção em cinza `--previsao`.
- **Tipografia:** Sora (display, `.h1/.h2`), IBM Plex Sans (corpo), IBM Plex Mono (dados, rótulos, `.mono`, `.eyebrow`).
- **Logo oficial:** olho verde com globo e satélite (`assets/brand/logo-algeye.png` no claro, `logo-algeye-branco.png` no escuro; altura mínima 32 px). "InovaSensor" aparece no máximo uma vez por bloco. Logo InovaSensor: `assets/brand/logo-inova.png`.
- **Componentes e core:** `.wrap`, `.sec`, `.sec-head`, `.eyebrow`, `.h1/.h2/.h3`, `.lead`, `.mono`, `.btn .btn--primary/.btn--ghost/.btn--light/.btn--sm`, `.link-arrow`, `[data-reveal]`, `[data-reveal="stagger"]`. `window.ALG`: `ALG.gsap`, `ALG.ScrollTrigger`, `ALG.lenis`, `ALG.reduced`, `ALG.isMobile()`, `ALG.onVisible(el, cb)`. GSAP + ScrollTrigger + Lenis por CDN; Three.js 0.169 via importmap.

## 6. Contrato técnico (todas as seções)

- Arquivos: `src/sections/NN-<id>.html`, `css/sections/<id>.css`, `js/sections/<id>.js`. Cada agente edita só os seus.
- `<section id="<id>" class="sec sec--<id>" data-theme="dark|light" data-rail="Rótulo">`, CSS 100% escopado em `.sec--<id>`.
- Mobile primeiro (390px) e desktop (1440px). Acessível por teclado, `aria-live` em conteúdo que muda, contraste AA, `prefers-reduced-motion` respeitado, nada quebra sem WebGL/CDN, loops pausam fora da tela.
- CTAs de avaliação: `href="#avaliacao"` com `data-cta="avaliacao"`.
- Demonstrações com rótulo visível "Demonstração · dados fictícios"; ilustrações de IA com "imagem ilustrativa gerada por IA".
- Itens a validar: `data-validate="true"`.
- **Meta de tamanho:** página inteira <= 13.000 px no mobile e <= 10.000 px no desktop.

## 7. A abertura em voo (Higgsfield, depois)

- O hero (`#voo`) é um scroll em 3 batidas: **Órbita** (o satélite passa sobre a Terra) → **Represa** (a câmera desce até uma represa genérica, vista inteira) → **Água** (a câmera rompe a superfície e entra na água; partículas verdes suspensas, sugerindo algas). Depois disso a página segue normal.
- **Agora:** a camada visual é uma ilustração leve (SVG/CSS/canvas 2D ou Three.js simples) com a mesma coreografia, para a página já funcionar.
- **Depois:** a mesma camada é trocada pelo vídeo do skill `scroll-world` (`vendor/scrub-engine.js`, já copiado). O hero precisa expor um contêiner `#voo-stage` (onde o motor monta o vídeo) e os textos das 3 batidas em `[data-beat="orbita|represa|agua"]`, posicionados por progresso de scroll, independentes da camada visual.
- Projeto no Higgsfield: "Algeye · Site · Voo satélite → represa → água" (workspace `e9d77815-a9c7-4158-be03-86bc95828337`, projeto `777fc4c0-a725-448b-9f0f-e3cf515f01c2`). Pastas: 01 Cenas `0300a82f-338b-4cc5-b1dc-0a169333726c`, 02 Rascunho `766dc08b-45fb-4c0a-810f-231b298c6218`, 03 Final desktop `853b6eeb-1750-4ef7-807e-a0e89ab71e2b`, 04 Final mobile `a6cb2fb0-2776-45ed-b257-a5196fad56ea`. Custos medidos: imagem gpt_image_2_5 = 0,25 crédito; clipe 5 s seedance_2_0_mini 720p = 5; seedance_2_0 1080p = 45. Saldo: 868,5 créditos.
- A represa do voo é **genérica e não identificável** (sem contorno real, sem cidade, sem placa), e o vídeo leva "imagem ilustrativa gerada por IA".

## 8. Seções (ordem e tema)

01 voo (dark) · 02 intervalo (light) · 03 como (dark) · 04 painel (light) · 05 operacao (dark) · 06 confianca (light) · 07 avaliacao (dark)
