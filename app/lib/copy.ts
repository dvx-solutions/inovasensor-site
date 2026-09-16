/**
 * Conteúdo do site em PT-BR e EN.
 *
 * Regras de conteúdo travadas com o time (10 set 2026):
 *  - Venda consultiva: nenhum preço do AlgEye aparece em tela.
 *  - Nada de "dados de satélite gratuitos" — o custo de operação é alto.
 *    O que se afirma é "zero hardware / zero capex para o cliente".
 *  - Piloto: a CASAL pode ser nomeada (confirmado pelo time em 11 set 2026).
 *  - Sem alegação de captação FINEP — não existe.
 *  - Acurácia é META de validação (>92%), não resultado medido. TRL 4.
 *  - Janela de antecipação: 14 DIAS (confirmado pelo time em 11/09/2026).
 *  - Resolução: 3 m por pixel. O FORNECEDOR DE IMAGEM NÃO É CITADO —
 *    decisão do time: falar de resolução, nunca de quem a fornece.
 *  - Sem alegação de ficocianina/620 nm. O índice operacional é o NDCI,
 *    como mostra o painel do produto.
 */

export type Lang = "pt" | "en";

export const LANGS: Lang[] = ["pt", "en"];

export const routeFor = (lang: Lang) => (lang === "pt" ? "/" : "/en");

const pt = {
  meta: {
    title: "AlgEye — alerta de floração em reservatórios, 14 dias antes",
    description:
      "O AlgEye monitora reservatórios por satélite a 3 metros por pixel e alerta o operador 14 dias antes da floração virar crise. Qualquer reservatório, sem barco, sem sonda, sem hardware.",
    htmlLang: "pt-BR",
  },

  nav: {
    links: [
      { label: "O problema", href: "#intervalo" },
      { label: "Como funciona", href: "#sensoriamento" },
      { label: "Painel", href: "#painel" },
      { label: "Prova", href: "#prova" },
    ],
    cta: "Avaliar meu reservatório",
    switchTo: "EN",
    skip: "Pular para o conteúdo",
  },

  /* 00 ─────────────────────────────────────────────────────── */
  hero: {
    eyebrow: "Monitoramento preditivo de florações",
    h1a: "A floração começa",
    h1b: "quatorze dias antes",
    h1c: "de você ver.",
    lede:
      "O AlgEye lê a água do seu reservatório por satélite, a 3 metros por pixel, e avisa 14 dias antes da crise. Sem barco, sem sonda, sem hardware instalado.",
    ctaPrimary: "Avaliar meu reservatório",
    ctaSecondary: "Como funciona",
    proof: ["3 metros por pixel", "Qualquer reservatório, qualquer tamanho", "Piloto com a CASAL"],
    scroll: "Role",
  },

  /* 01 ─────────────────────────────────────────────────────── */
  intervalo: {
    index: "01",
    eyebrow: "O procedimento que falha",
    h2: "Entre uma coleta e a próxima, ninguém está olhando.",
    lede:
      "A amostragem manual de barco entrega uma fotografia a cada 15 a 30 dias. A floração não espera o próximo agendamento — ela cresce no intervalo, e o operador só descobre quando o problema já está na captação.",
    timeline: {
      caption: "Ciclo de amostragem manual · 30 dias",
      sample: "Coleta",
      gap: "Sem leitura",
      bloomLabel: "Floração instalada",
      dayLabel: "Dia",
    },
    facts: [
      { k: "R$ 100–300 mil", v: "por ano, por reservatório, no método manual" },
      { k: "15 a 30 dias", v: "entre duas leituras — o resto é ponto cego" },
      { k: "10×", v: "o custo de tratar na crise contra tratar na antecipação" },
    ],
    kicker: "Com leitura diária, o mesmo mês tem trinta pontos de dado em vez de um.",
  },

  /* 02 ─────────────────────────────────────────────────────── */
  nuvens: {
    index: "02",
    eyebrow: "Por que satélite comum não resolve",
    h2: "Satélite todo mundo tem. Ver através da nuvem, não.",
    lede:
      "No Brasil tropical o céu não colabora. Uma série temporal de satélite sem tratamento chega esburacada: dias inteiros perdidos justamente na estação quente, que é quando a floração acontece. É aí que a maioria das soluções de sensoriamento remoto para de funcionar — e é exatamente esse o problema que o Gap Filling resolve.",
    /* TODO(time): substituir por % medido de dias inutilizáveis por nuvem na região do piloto. */
    before: { label: "Série bruta", note: "dias perdidos por cobertura de nuvem" },
    after: { label: "Com Gap Filling", note: "série reconstruída, leitura contínua" },
    drag: "Mesma série, antes e depois do Gap Filling",
    kicker:
      "O Gap Filling é proprietário e é o motivo pelo qual o AlgEye continua entregando alerta na semana em que o operador mais precisa dele.",
  },

  /* 03 ─────────────────────────────────────────────────────── */
  sensoriamento: {
    index: "03",
    eyebrow: "A cadeia de sensoriamento",
    h2: "Como o AlgEye enxerga",
    lede: "Quatro camadas sobre o mesmo espelho d'água, do pixel grosso ao alerta datado.",
    beats: [
      {
        n: "01",
        tag: "Imagem de alta resolução · 3 m",
        title: "Três metros por pixel",
        body:
          "Boa parte do sensoriamento remoto de água trabalha com pixels de centenas de metros — o bastante para ver um grande lago, longe do suficiente para ver um reservatório de abastecimento. A três metros o espelho inteiro aparece: braços, enseadas e a faixa perto da captação, que é justamente onde a floração começa.",
        readout: [
          ["Pixel", "3 m"],
          ["Cobertura", "Espelho inteiro"],
          ["Limite de tamanho", "Nenhum"],
        ],
      },
      {
        n: "02",
        tag: "NDCI · índice por pixel",
        title: "A água classificada, ponto a ponto",
        body:
          "Cada pixel do espelho recebe um valor de NDCI e cai numa faixa operacional: baixo, moderado, alto ou crítico. O painel mostra quanto por cento da superfície está acima de moderado — a diferença entre saber que há um problema e saber onde mandar a equipe.",
        readout: [
          ["Índice", "NDCI"],
          ["Crítico", "≥ 0,28"],
          ["Saída", "Classe por pixel"],
        ],
      },
      {
        n: "03",
        tag: "Gap Filling · proprietário",
        title: "A nuvem passa, a leitura continua",
        body:
          "Quando a cobertura de nuvem interrompe a passagem, o algoritmo reconstrói o campo a partir do histórico e das bandas disponíveis. A série não abre buraco — e a estação chuvosa, que é quando o risco sobe, deixa de ser um vão no gráfico.",
        readout: [
          ["Entrada", "Série com lacuna"],
          ["Método", "Reconstrução"],
          ["Saída", "Série contínua"],
        ],
      },
      {
        n: "04",
        tag: "Modelo preditivo",
        title: "Quatorze dias",
        body:
          "Temperatura, turbidez e carga de nutrientes entram como camadas junto da série histórica do índice. O modelo reconhece o padrão que antecede a floração e devolve uma janela de duas semanas: tempo real para remanejar captação, ajustar tratamento, programar coleta e avisar a vigilância — antes, não depois.",
        readout: [
          ["Janela", "14 dias"],
          ["Entrega", "Painel + notificação"],
          ["Ação", "Preventiva"],
        ],
      },
    ],
  },

  /* 04 ─────────────────────────────────────────────────────── */
  painel: {
    index: "04",
    eyebrow: "O produto",
    h2: "O alerta chega assim.",
    lede:
      "Um painel por reservatório: estado atual, série histórica do índice, mapa de calor da mancha e o alerta com data e hora. Sem instalar nada, sem estação em campo, acessível de qualquer navegador.",
    telas: {
      caption:
        "Represa de Guarapiranga, São Paulo · três passagens do mesmo reservatório",
      shots: [
        {
          src: "/sistema/guarapiranga-moderada",
          alt: "Painel do AlgEye em 11 de maio de 2026: manchas alaranjadas nas margens do espelho da Guarapiranga.",
          date: "11/05/2026",
          state: "Moderado",
          value: "10,6",
          unit: "% do espelho acima de moderado",
          note: "NDCI médio 0,077 · 100% visível",
          body:
            "A mancha aparece primeiro nas margens, onde a água fica parada. Nada que se enxergue da estrada, e nada que uma coleta pontual no meio do espelho fosse encontrar.",
        },
        {
          src: "/sistema/guarapiranga-limpa",
          alt: "Painel do AlgEye em 14 de maio de 2026: o espelho da Guarapiranga quase todo em azul, índice na faixa baixa.",
          date: "14/05/2026",
          state: "Dentro da faixa",
          value: "3,8",
          unit: "% do espelho acima de moderado",
          note: "NDCI médio 0,007 · 91% visível",
          body:
            "Três dias depois o índice despenca e o espelho volta ao azul. Uma campanha de coleta marcada para esta data teria voltado ao laboratório dizendo que estava tudo bem.",
        },
        {
          src: "/sistema/guarapiranga-critica",
          alt: "Painel do AlgEye em 22 de junho de 2026: o espelho da Guarapiranga quase todo em laranja e vermelho, com alerta crítico.",
          date: "22/06/2026",
          state: "Alerta crítico",
          value: "84,7",
          unit: "% do espelho acima de moderado",
          note: "NDCI médio 0,288 · 100% visível",
          body:
            "Trinta e nove dias depois, 84,7% do espelho acima de moderado e mais da metade em crítico. Entre uma coleta e a próxima, é esta a curva que ninguém estava vendo.",
        },
      ],
    },
    disclaimer:
      "Telas reais do AlgEye, sem edição. Guarapiranga é reservatório público; o usuário na barra superior é de uma conta de teste.",
  },

  /* 05 ─────────────────────────────────────────────────────── */
  operacao: {
    index: "05",
    eyebrow: "O que muda na operação",
    h2: "Mesma equipe, outro tempo de reação.",
    lede:
      "O AlgEye não substitui o laboratório: ele decide para onde o laboratório vai. Abaixo, o método atual e o monitoramento contínuo lado a lado.",
    table: {
      head: ["", "Amostragem manual", "AlgEye"],
      rows: [
        ["Frequência de leitura", "A cada 15–30 dias", "Diária"],
        ["Antecipação", "Nenhuma — detecta o que já ocorreu", "Janela de 14 dias"],
        ["Cobertura do espelho d'água", "Pontos de coleta isolados", "Superfície inteira, a 3 m"],
        ["Dias nublados", "Coleta remarcada", "Série reconstruída"],
        ["Equipe embarcada", "Barco e técnico por campanha", "Nenhuma"],
        ["Capex do cliente", "Sonda, barco, logística", "Zero — nada instalado"],
        ["Conformidade ANA 188/2024", "Depende da campanha", "Registro contínuo"],
      ],
    },
    anchor: {
      value: "R$ 100–300 mil",
      unit: "por ano, por reservatório",
      note: "é o que custa hoje manter a amostragem manual de um único reservatório. O AlgEye é contratado por assinatura mensal, dimensionada por reservatório — o número é definido na conversa técnica.",
    },
  },

  /* 06 ─────────────────────────────────────────────────────── */
  ana: {
    index: "06",
    eyebrow: "Regulação",
    h2: "Automonitoramento deixou de ser boa prática.",
    body:
      "A Resolução ANA nº 188/2024 estabelece o automonitoramento como obrigação para operadores de reservatórios. Deixar de registrar não é mais uma escolha de gestão: expõe a operação a multa e a embargo, e transfere para o operador o ônus de provar o que não mediu.",
    footnote: "Consulte o texto integral da resolução no portal da Agência Nacional de Águas e Saneamento Básico.",
    link: "Resolução ANA 188/2024",
    linkHref: "https://www.gov.br/ana/pt-br",
  },

  /* 07 ─────────────────────────────────────────────────────── */
  prova: {
    index: "07",
    eyebrow: "Onde estamos",
    h2: "TRL 4, com piloto em campo e validação em curso.",
    lede:
      "Somos transparentes sobre a maturidade: o AlgEye está validado em ambiente controlado e entrando em validação de campo. Nada nesta página é apresentado como resultado que ainda não medimos.",
    items: [
      {
        k: "Piloto",
        v: "CASAL",
        note: "Companhia de Saneamento de Alagoas. Acordo assinado, validação em campo em curso.",
      },
      {
        k: "Maturidade",
        v: "TRL 4",
        note: "Validado em ambiente controlado. Meta de acurácia da validação de campo: acima de 92%.",
      },
    ],
  },

  /* 08 ─────────────────────────────────────────────────────── */
  time: {
    index: "08",
    eyebrow: "Quem opera",
    h2: "As pessoas por trás da leitura.",
    members: [
      { name: "Marcelo Bilonia", role: "CEO", photo: "/team/marcelo.jpg" },
      { name: "Guilherme Bilonia", role: "Chief AI Officer", photo: "/team/guilherme.jpg" },
      { name: "Vinícius Oliveira", role: "CTO", photo: "/team/vinicius.jpg" },
      { name: "Gustavo Bilonia", role: "CFO", photo: "/team/gustavo.jpeg" },
    ],
  },

  /* 09 ─────────────────────────────────────────────────────── */
  avaliacao: {
    index: "09",
    eyebrow: "Conversa técnica",
    h2: "Qualquer reservatório, de qualquer tamanho.",
    lede:
      "A três metros por pixel não existe espelho d'água pequeno demais — represa de abastecimento, lagoa de indústria, reservatório de hidrelétrica. Diga qual é o seu e, numa conversa de trinta minutos, mostramos o que o AlgEye enxerga nele e como o alerta chegaria à sua operação.",
    fields: {
      name: "Nome",
      org: "Organização",
      role: "Cargo",
      email: "E-mail corporativo",
      reservoir: "Nome ou coordenada do reservatório",
      namePh: "Como devemos te chamar",
      orgPh: "Concessionária, indústria, órgão",
      rolePh: "Sua função",
      emailPh: "voce@organizacao.com.br",
      reservoirPh: "Ex.: Represa de Guarapiranga  ou  -23.71, -46.73",
    },
    submit: "Agendar conversa",
    sending: "Enviando…",
    successTitle: "Recebido.",
    successBody: "Vamos preparar a leitura do seu reservatório e retornar em até dois dias úteis com um horário.",
    errorBody: "Não foi possível enviar agora. Tente de novo ou fale direto com a gente pelo WhatsApp.",
    privacy: "Usamos seus dados apenas para responder a esta solicitação.",
    locating: "Localizando",
    located: "Ponto localizado",
    notLocated: "Vamos localizar na conversa",
  },

  /* 10 ─────────────────────────────────────────────────────── */
  rodape: {
    tagline: "Monitoramento preditivo de florações de cianobactérias em reservatórios.",
    contact: "Contato",
    email: "gustavo.henrique@devexsolucoes.com.br",
    phone: "(12) 9 8802-8865",
    phoneHref: "5512988028865",
    whatsapp: "WhatsApp",
    location: "Vale do Paraíba · São Paulo · Brasil",
    legalTitle: "Legal",
    /* TODO(time): o formulário coleta dado pessoal — o AlgEye precisa da
       própria política de privacidade (LGPD). A rota existente é do FIEMS
       Conecta, outro produto, e não serve aqui. */
    entity: "Operado por Inova Sensor LTDA",
    cnpj: "CNPJ 47.164.317/0001-27",
    rights: "Todos os direitos reservados.",
  },
};

const en: typeof pt = {
  meta: {
    title: "AlgEye — reservoir bloom alerts, 14 days ahead",
    description:
      "AlgEye monitors reservoirs from orbit at 3 metres per pixel and warns operators 14 days before a bloom becomes a crisis. Any reservoir, no boats, no probes, no hardware.",
    htmlLang: "en",
  },

  nav: {
    links: [
      { label: "The problem", href: "#intervalo" },
      { label: "How it works", href: "#sensoriamento" },
      { label: "Dashboard", href: "#painel" },
      { label: "Evidence", href: "#prova" },
    ],
    cta: "Check my reservoir",
    switchTo: "PT",
    skip: "Skip to content",
  },

  hero: {
    eyebrow: "Predictive bloom monitoring",
    h1a: "The bloom starts",
    h1b: "fourteen days before",
    h1c: "you can see it.",
    lede:
      "AlgEye reads your reservoir from orbit at 3 metres per pixel and warns you 14 days ahead of the crisis. No boats, no probes, no hardware installed.",
    ctaPrimary: "Check my reservoir",
    ctaSecondary: "How it works",
    proof: ["3 metres per pixel", "Any reservoir, any size", "Pilot with CASAL, Brazil"],
    scroll: "Scroll",
  },

  intervalo: {
    index: "01",
    eyebrow: "The procedure that fails",
    h2: "Between one sample and the next, nobody is watching.",
    lede:
      "Manual boat sampling delivers a snapshot every 15 to 30 days. A bloom does not wait for the next scheduled campaign — it grows in the gap, and the operator finds out once the problem has already reached the intake.",
    timeline: {
      caption: "Manual sampling cycle · 30 days",
      sample: "Sample",
      gap: "No reading",
      bloomLabel: "Bloom established",
      dayLabel: "Day",
    },
    facts: [
      { k: "R$ 100–300k", v: "per year, per reservoir, under manual sampling" },
      { k: "15 to 30 days", v: "between readings — the rest is a blind spot" },
      { k: "10×", v: "the cost of treating in crisis versus treating early" },
    ],
    kicker: "With daily readings, the same month holds thirty data points instead of one.",
  },

  nuvens: {
    index: "02",
    eyebrow: "Why ordinary satellite falls short",
    h2: "Everyone has satellites. Seeing through the cloud is the hard part.",
    lede:
      "In tropical Brazil the sky does not cooperate. An untreated satellite time series arrives full of holes — entire days lost precisely in the warm season, which is when blooms happen. That is where most remote sensing solutions stop working, and exactly the problem Gap Filling solves.",
    before: { label: "Raw series", note: "days lost to cloud cover" },
    after: { label: "With Gap Filling", note: "series reconstructed, reading continues" },
    drag: "Same series, before and after Gap Filling",
    kicker:
      "Gap Filling is proprietary, and it is why AlgEye keeps delivering alerts in the very week an operator needs them most.",
  },

  sensoriamento: {
    index: "03",
    eyebrow: "The sensing chain",
    h2: "How AlgEye sees",
    lede: "Four layers over the same water surface, from coarse pixel to dated alert.",
    beats: [
      {
        n: "01",
        tag: "High-resolution imagery · 3 m",
        title: "Three metres per pixel",
        body:
          "Much of water remote sensing works with pixels hundreds of metres wide — enough to see a great lake, nowhere near enough to see a drinking-water reservoir. At three metres the whole surface appears: arms, coves and the strip near the intake, which is exactly where a bloom starts.",
        readout: [
          ["Pixel", "3 m"],
          ["Coverage", "Whole surface"],
          ["Size limit", "None"],
        ],
      },
      {
        n: "02",
        tag: "NDCI · per-pixel index",
        title: "The water classified, point by point",
        body:
          "Every pixel of the surface gets an NDCI value and falls into an operational band: low, moderate, high or critical. The dashboard shows what share of the surface sits above moderate — the difference between knowing there is a problem and knowing where to send the crew.",
        readout: [
          ["Index", "NDCI"],
          ["Critical", "≥ 0.28"],
          ["Output", "Class per pixel"],
        ],
      },
      {
        n: "03",
        tag: "Gap Filling · proprietary",
        title: "The cloud passes, the reading holds",
        body:
          "When cloud cover interrupts the overpass, the algorithm reconstructs the field from the historical series and the bands still available. The series does not break — and the rainy season, when risk climbs, stops being a void in the chart.",
        readout: [
          ["Input", "Series with gaps"],
          ["Method", "Reconstruction"],
          ["Output", "Continuous series"],
        ],
      },
      {
        n: "04",
        tag: "Predictive model",
        title: "Fourteen days",
        body:
          "Temperature, turbidity and nutrient load enter as layers alongside the index history. The model recognises the pattern that precedes a bloom and returns a two-week window: real time to shift the intake, tune treatment, schedule sampling and notify public health — before, not after.",
        readout: [
          ["Window", "14 days"],
          ["Delivery", "Dashboard + alert"],
          ["Action", "Preventive"],
        ],
      },
    ],
  },

  painel: {
    index: "04",
    eyebrow: "The product",
    h2: "This is how the alert arrives.",
    lede:
      "One dashboard per reservoir: current state, index history, heat map of the patch, and the alert with a date and time. Nothing to install, no field station, reachable from any browser.",
    telas: {
      caption:
        "Guarapiranga reservoir, São Paulo · three overpasses of the same water body",
      shots: [
        {
          src: "/sistema/guarapiranga-moderada",
          alt: "AlgEye dashboard on 11 May 2026: orange patches along the margins of the Guarapiranga surface.",
          date: "11 May 2026",
          state: "Moderate",
          value: "10.6",
          unit: "% of the surface above moderate",
          note: "mean NDCI 0.077 · 100% visible",
          body:
            "The patch shows up first along the margins, where the water sits still. Nothing you would see from the road, and nothing a spot sample in the middle of the reservoir would have found.",
        },
        {
          src: "/sistema/guarapiranga-limpa",
          alt: "AlgEye dashboard on 14 May 2026: the Guarapiranga surface almost entirely blue, index in the low band.",
          date: "14 May 2026",
          state: "Within range",
          value: "3.8",
          unit: "% of the surface above moderate",
          note: "mean NDCI 0.007 · 91% visible",
          body:
            "Three days later the index collapses and the surface is blue again. A sampling campaign scheduled for this date would have gone back to the lab reporting that all was well.",
        },
        {
          src: "/sistema/guarapiranga-critica",
          alt: "AlgEye dashboard on 22 June 2026: the Guarapiranga surface almost entirely orange and red, critical alert raised.",
          date: "22 June 2026",
          state: "Critical alert",
          value: "84.7",
          unit: "% of the surface above moderate",
          note: "mean NDCI 0.288 · 100% visible",
          body:
            "Thirty-nine days later, 84.7% of the surface above moderate and more than half of it critical. Between one campaign and the next, this is the curve nobody was watching.",
        },
      ],
    },
    disclaimer:
      "Real AlgEye screens, unedited. Guarapiranga is a public reservoir; the user in the top bar belongs to a test account.",
  },

  operacao: {
    index: "05",
    eyebrow: "What changes operationally",
    h2: "Same team, a different reaction time.",
    lede:
      "AlgEye does not replace the laboratory: it decides where the laboratory goes. Below, the current method and continuous monitoring side by side.",
    table: {
      head: ["", "Manual sampling", "AlgEye"],
      rows: [
        ["Reading frequency", "Every 15–30 days", "Daily"],
        ["Lead time", "None — detects what already happened", "14-day window"],
        ["Water surface coverage", "Isolated sampling points", "Entire surface, at 3 m"],
        ["Cloudy days", "Campaign rescheduled", "Series reconstructed"],
        ["Crew on the water", "Boat and technician per campaign", "None"],
        ["Client capex", "Probe, boat, logistics", "Zero — nothing installed"],
        ["ANA 188/2024 compliance", "Depends on the campaign", "Continuous record"],
      ],
    },
    anchor: {
      value: "R$ 100–300k",
      unit: "per year, per reservoir",
      note: "is what manual sampling costs today for a single reservoir. AlgEye is a monthly subscription scoped per reservoir — the figure is set in the technical conversation.",
    },
  },

  ana: {
    index: "06",
    eyebrow: "Regulation",
    h2: "Self-monitoring is no longer good practice. It is the rule.",
    body:
      "Brazilian regulation ANA 188/2024 establishes self-monitoring as an obligation for reservoir operators. Failing to record is no longer a management choice: it exposes the operation to fines and shutdown orders, and puts the burden of proving what was never measured on the operator.",
    footnote: "The full text of the resolution is published by the Brazilian National Water Agency.",
    link: "ANA Resolution 188/2024",
    linkHref: "https://www.gov.br/ana/pt-br",
  },

  prova: {
    index: "07",
    eyebrow: "Where we are",
    h2: "TRL 4, with a field pilot and validation under way.",
    lede:
      "We are explicit about maturity: AlgEye is validated in a controlled environment and entering field validation. Nothing on this page is presented as a result we have not yet measured.",
    items: [
      {
        k: "Pilot",
        v: "CASAL",
        note: "Alagoas state water utility, Brazil. Agreement signed, field validation under way.",
      },
      {
        k: "Maturity",
        v: "TRL 4",
        note: "Validated in a controlled environment. Field validation accuracy target: above 92%.",
      },
    ],
  },

  time: {
    index: "08",
    eyebrow: "Who runs it",
    h2: "The people behind the reading.",
    members: [
      { name: "Marcelo Bilonia", role: "CEO", photo: "/team/marcelo.jpg" },
      { name: "Guilherme Bilonia", role: "Chief AI Officer", photo: "/team/guilherme.jpg" },
      { name: "Vinícius Oliveira", role: "CTO", photo: "/team/vinicius.jpg" },
      { name: "Gustavo Bilonia", role: "CFO", photo: "/team/gustavo.jpeg" },
    ],
  },

  avaliacao: {
    index: "09",
    eyebrow: "Technical conversation",
    h2: "Any reservoir, of any size.",
    lede:
      "At three metres per pixel there is no water surface too small — a drinking-water dam, an industrial pond, a hydropower reservoir. Tell us which one is yours and, in a thirty-minute conversation, we will show what AlgEye sees in it and how the alert would reach your operation.",
    fields: {
      name: "Name",
      org: "Organisation",
      role: "Role",
      email: "Work email",
      reservoir: "Reservoir name or coordinates",
      namePh: "What we should call you",
      orgPh: "Utility, industry, agency",
      rolePh: "Your role",
      emailPh: "you@organisation.com",
      reservoirPh: "e.g. Guarapiranga Reservoir  or  -23.71, -46.73",
    },
    submit: "Book the call",
    sending: "Sending…",
    successTitle: "Received.",
    successBody: "We will prepare a reading of your reservoir and come back within two business days with a time.",
    errorBody: "We could not send that right now. Try again, or reach us directly on WhatsApp.",
    privacy: "We use your details only to answer this request.",
    locating: "Locating",
    located: "Point located",
    notLocated: "We will locate it in the conversation",
  },

  rodape: {
    tagline: "Predictive monitoring of cyanobacteria blooms in reservoirs.",
    contact: "Contact",
    email: "gustavo.henrique@devexsolucoes.com.br",
    phone: "+55 12 98802-8865",
    phoneHref: "5512988028865",
    whatsapp: "WhatsApp",
    location: "Vale do Paraíba · São Paulo · Brazil",
    legalTitle: "Legal",
    entity: "Operated by Inova Sensor LTDA",
    cnpj: "CNPJ 47.164.317/0001-27",
    rights: "All rights reserved.",
  },
};

export const copy = { pt, en };
export type Copy = typeof pt;
