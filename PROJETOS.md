# inovaSensor — Mapa de Projetos
> Documento de referência para o site institucional da inovaSensor.
> Última atualização: 2026-06-10

---

## 🏢 A Empresa — inovaSensor

**O que sei:**
- Empresa de tecnologia com foco em **sensoriamento, IA preditiva e consulting estratégico**
- Subtítulo: *Strategic Consulting & Predictive AI*
- Desenvolvedora do app **Palpite Bar** (Play Store package: `com.inovasensor.palpitebar`)
- Associada à **DevEx Soluções** (`gustavo.henrique@devexsolucoes.com.br`)
- Telefone: **(12) 9 8802-8865** — DDD 12 = Região do Vale do Paraíba / São José dos Campos (SP)

**❓ Ainda preciso confirmar:**
- [ ] Nome completo / razão social da empresa
- [ ] CNPJ (opcional para o site)
- [ ] Cidade/estado sede
- [ ] Ano de fundação
- [ ] Logo da inovaSensor (arquivo)
- [ ] Cores e identidade visual da marca
- [ ] Tagline / missão definitiva em 1 frase
- [ ] inovaSensor e DevEx Soluções são a mesma razão social ou parceiras?

---

## 📱 Projeto 1 — Palpite Bar

### O que é
App de gamificação de futebol para bares. Os donos de bares criam salas no app e os clientes fazem palpites (placar, cartões amarelos, faltas, escanteios) pelo celular, competindo em ranking em tempo real.

### Status
✅ **Em produção** — disponível nas lojas

### Dados-chave
| Campo | Valor |
|-------|-------|
| App Store | https://apps.apple.com/br/app/palpitebar/id6744611194 |
| Google Play | https://play.google.com/store/apps/details?id=com.inovasensor.palpitebar |
| Preço | 100% gratuito durante a Copa do Mundo 2026 (11 Jun → 19 Jul 2026) |
| Evento alvo | Copa do Mundo FIFA 2026 (EUA, Canadá e México) |
| Total de jogos | 64 jogos, 48 seleções |

### Funcionalidades do app
- Dono de bar cria sala em 1 minuto
- Clientes entram via QR Code, link ou buscando a sala
- Palpites: placar, cartões amarelos, faltas cometidas, escanteios
- Ranking ao vivo em tempo real
- Sem hardware extra — só smartphone

### Proposta de valor
- **Para o bar:** mais clientes, mais consumo, mais engajamento — bar lotado nos jogos da Copa
- **Para o cliente:** experiência interativa e competição amigável sem sair do bar

### Tecnologia (landing page)
- Frontend: TanStack Start + React 19 + Tailwind v4
- Banco de dados de leads: PostgreSQL (Docker)
- Host: a definir (Vercel/Railway)

### Fontes
- Landing page em `C:\Users\albil\Palpite Bar`
- GitHub: `https://github.com/dvx-solutions/palpite-bar`

---

## 🌿 Projeto 2 — Monitoramento Preditivo de Algas (inovaSensor)

### O que é
Plataforma SaaS cloud B2B/B2G para **monitoramento preditivo de florações de cianobactérias e macrófitas** em grandes reservatórios de água. O sistema entrega alertas antecipados com **72 horas de antecipação** usando fusão de imagens de satélite e modelos de ML.

### Status
🔬 **TRL 4** — validado em ambiente controlado. Piloto em preparação com a CASAL.

### O Problema
| Dor | Dado |
|-----|------|
| Amostragem manual de barco | A cada 15–30 dias — sem capacidade preditiva |
| Custo do método atual | R$ 100k–R$ 300k/ano por reservatório |
| Tratamento reativo (crise) | 10x mais caro — R$ milhões |
| Satélites padrão | Falham em dias nublados — problema crítico no Brasil tropical |
| Legislação | Resolução ANA 188/2024 exige automonitoramento contínuo |

### A Solução

**Proposta central:**
> "72 horas de antecipação para agir antes que a floração se torne uma crise."

**Como funciona:**
1. Fusão de Sentinel-3 + Sentinel-2 (satélites ESA gratuitos — zero hardware para o cliente)
2. Algoritmo proprietário **Gap Filling** — reconstrói imagens em dias nublados
3. Modelo preditivo de ML detecta padrões pré-floração (temperatura, turbidez, nutrientes)
4. Alerta 72h antes via painel web + notificações

**Tecnologia satélite:**
| Satélite | Resolução | Função |
|----------|-----------|--------|
| Sentinel-3 OLCI | 300m | 21 bandas — banda Oa08 (620nm) detecta **ficocianina** (pigmento exclusivo de cianobactérias) |
| Sentinel-2 MSI | 10m | Alta resolução espacial — delimita contorno e densidade da floração |

### Modelo de Negócio
- **Tipo:** SaaS recorrente mensal por reservatório
- **Preço:** R$ 3.000–R$ 8.000/reservatório/mês
- **ROI para o cliente:** 14x–50x vs. monitoramento manual

### Mercado
| | Valor |
|--|-------|
| TAM | R$ 12 bilhões |
| SAM (Brasil) | R$ 850 milhões |
| SOM (meta 3 anos) | R$ 40M — 120 reservatórios, Sudeste/Sul |

### Clientes-alvo
- Concessionárias de saneamento (CASAL, SABESP, CEDAE, COPASA)
- Indústrias com captação própria
- Usinas hidrelétricas e mineradoras

### Roadmap
| Período | Marco |
|---------|-------|
| Q3 2026 | Parcerias com operadoras de satélite |
| Q4 2026 | Piloto CASAL — validação em campo (>92% accuracy) |
| Q1 2027 | Lançamento comercial |
| Q2 2027 | Escala B2B |

### Equipe
| Nome | Cargo |
|------|-------|
| Marcelo Bilonia | CEO |
| Guilherme Bilonia | CAIO (Chief AI Officer) |
| Vinícius Oliveira | CTO |
| Gustavo Bilonia | CFO |
| Prof. Dr. Marcelo Pompeo (USP) | Conselheiro Científico |

### Investimento
- R$ 50k já investidos em infraestrutura de dados
- R$ 800k FINEP (captação não-dilutiva)

### Fontes
- Documento executivo: fornecido diretamente pelo time
- Skill de conhecimento: `C:\Users\albil\.claude\skills\inovasensor\SKILL.md`

---

## 🧾 Projeto 3 — BPO-AI (Norte / Pulso / Lume — nome em definição)

### O que é
Plataforma B2B2C de gestão de carteira para **contadores**, com assistente de IA via **WhatsApp** para os clientes finais (MEIs, autônomos, pequenas empresas).

**Dois pontos de contato:**
1. **Dashboard do contador** — painel web com visão completa da carteira, alertas proativos e insights de IA
2. **WhatsApp AI** — o cliente final emite NFS-e, registra lançamentos e consulta extratos por mensagem de texto ou áudio. Zero instalação.

### Status
🔴 **Pré-implementação** — docs escritas, código ainda não iniciado

### Proposta de valor
> "Seu cliente resolve tudo pelo WhatsApp. Você acompanha a carteira inteira em um painel — e age antes que o problema apareça."

### Funcionalidades MVP
| Módulo | Descrição |
|--------|-----------|
| Onboarding do contador | Cadastro, plano, pagamento |
| Gestão de clientes | Cadastro, upload certificado A1, ativação |
| WhatsApp AI | Emissão NFS-e, registro AP/AR, extrato |
| Emissão NFS-e | Via Focus NF-e API, certificado A1, retorna PDF |
| AP/AR + categorização | IA auto-categoriza lançamentos |
| Dashboard carteira | Saúde do cliente, alertas proativos, tendências |
| DRE por cliente | Mensal e anual, automático das NFS-e + lançamentos |
| Billing | Cobrança automática via Pagar.me |

### Modelo de negócio
- **Quem paga:** o contador
- **Preço:** R$60 / cliente cadastrado / mês
- **NFS-e inclusas:** 15/mês; overage: R$2/nota
- **Meta MVP:** R$50.000 MRR (~28 contadores de médio porte)
- **Margem bruta estimada:** ~95%

### Tecnologia
| Camada | Tech |
|--------|------|
| Frontend | TanStack Start + shadcn/ui |
| API | Node.js + TypeScript + Fastify |
| DB | PostgreSQL + Drizzle ORM |
| Queue | BullMQ + Redis |
| WhatsApp | Evolution API (self-hosted) |
| NFS-e | Focus NF-e / eNotas |
| IA | Claude API (Haiku em prod, Sonnet em dev) |
| Armazenamento certificados | Cloudflare R2 (criptografado) |
| Billing | Pagar.me |

### Nome — candidatos (ainda em discussão)
| # | Nome | Conceito | Status |
|---|------|----------|--------|
| 🥇 | **Norte** | Orientação, direção, visibilidade | Favorito |
| 🥈 | **Pulso** | Sinal vital, monitoramento proativo | Backup |
| 🥉 | **Lume** | Luz, clareza, iluminar o que estava escuro | Premium/distintivo |

### Atores do sistema
- **Contador** — cliente pagante, acessa dashboard web completo
- **Cliente do contador** (MEI/PJ) — usuário final, interage só via WhatsApp
- **Empresário** — dono/sócio do cliente, acessa Portal do Empresário (login próprio, vê notas e financeiro)

### Fontes
- Docs em `C:\Users\albil\Norte\bpo-ai\docs\`
- Apresentações: `BPO-AI-Contadores.pptx`, `BPO-AI-Socios.pptx`

---

## 📌 Resumo do que preciso para construir o site da inovaSensor

### Sobre a empresa
1. [ ] inovaSensor e DevEx Soluções são a mesma empresa?
2. [ ] Qual a missão / o que a empresa faz em 1 frase (tagline definitiva)?
3. [ ] Cidade/estado sede?
4. [ ] Tem logo da inovaSensor? (arquivo PNG/SVG)
5. [ ] Cores da marca? (hex)

### Sobre o site
6. [ ] O site deve apresentar os 3 projetos juntos ou focar em algum?
7. [ ] Tem referência visual de sites que gosta?
8. [ ] Precisa de formulário de contato / captação de leads?
9. [ ] Domínio já definido? (ex: inovasensor.com.br)
10. [ ] Tem screenshots do dashboard de algas para usar no site?
