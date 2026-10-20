export const programStages = [
  {
    period: "Mês 01",
    title: "Entender. Aplicar. Ajustar.",
    description:
      "Mapeamos a operação, escolhemos o processo prioritário e começamos a implantação com treinamento da equipe.",
    cadence: "1 encontro por semana",
    detail: "Diagnóstico no primeiro encontro",
    months: [1],
  },
  {
    period: "Meses 02 — 04",
    title: "Fazer virar rotina.",
    description:
      "Acompanhamos o uso, as dificuldades da equipe e os indicadores para melhorar o processo dentro do escopo definido.",
    cadence: "2 encontros por mês",
    detail: "Demandas, adoção e indicadores",
    months: [2, 3, 4],
  },
  {
    period: "Meses 05 — 06",
    title: "Consolidar. Dar autonomia.",
    description:
      "Revisamos o que mudou na operação e o que precisa continuar. Uma nova área pode ser o próximo ciclo.",
    cadence: "1 encontro por mês",
    detail: "Resultados e próximos passos",
    months: [5, 6],
  },
] as const;

export const programIncludes = [
  {
    title: "Implementação acompanhada",
    text: "Diagnóstico, aplicação, treinamento e acompanhamento individual.",
  },
  {
    title: "Um processo como prioridade",
    text: "Processo, entregas e integrações combinados no diagnóstico.",
  },
  {
    title: "S360 OS no plano Max",
    text: "Uma licença incluída durante os seis meses do programa.",
  },
  {
    title: "Gestão acompanhada",
    text: "Encontros de 1 hora para revisar adoção, demandas e indicadores.",
  },
] as const;

export const readiness = [
  {
    number: "01",
    title: "Uma operação real",
    text: "Demandas recorrentes, uma equipe para envolver e um processo que merece funcionar melhor.",
  },
  {
    number: "02",
    title: "Alguém para conduzir",
    text: "Você ou um gestor disponível para decidir, acompanhar e abrir espaço para a equipe aplicar.",
  },
  {
    number: "03",
    title: "Prioridade para implementar",
    text: "Disposição para avaliar uma proposta e planejar os recursos necessários após o diagnóstico.",
  },
] as const;

export const programFaqs = [
  {
    question: "Nunca usei IA. Essa mentoria é para mim?",
    answer:
      "Pode ser. Você não precisa chegar sabendo usar IA. O diagnóstico identifica onde começar, e o treinamento parte da realidade da sua equipe. O mais importante é ter uma operação ativa, um problema concreto e disponibilidade para colocar as mudanças em prática.",
  },
  {
    question: "Minha equipe já usa ChatGPT ou outra IA. Ainda faz sentido?",
    answer:
      "Sim, se o uso ainda é isolado, depende de algumas pessoas ou não está ligado a um processo e a indicadores. Na avaliação, vamos entender o que vocês já utilizam e o que falta para transformar esse uso em uma rotina de trabalho.",
  },
  {
    question: "O sistema está incluído? E as licenças da equipe?",
    answer:
      "O programa inclui uma licença do S360 OS no plano Max. Se outras pessoas da equipe também precisarem de acesso individual, as licenças adicionais são contratadas separadamente. Outras ferramentas e integrações necessárias são avaliadas no diagnóstico.",
  },
  {
    question: "Quanto tempo preciso dedicar?",
    answer:
      "Reserve cerca de 1 hora por semana para o acompanhamento no início. Os encontros duram 1 hora: são semanais no primeiro mês, dois por mês do segundo ao quarto e um por mês no quinto e no sexto. Além dos encontros, você ou um gestor precisa apoiar decisões, e a equipe precisa de tempo para aplicar o que for combinado.",
  },
  {
    question: "Existe garantia de resultado?",
    answer:
      "Não prometemos um percentual de ganho ou aumento de faturamento. Os resultados dependem do processo escolhido, dos dados disponíveis e da adoção pela equipe. Definimos o escopo e os indicadores para acompanhar a evolução; a experiência da Devex é uma referência, não uma garantia do mesmo resultado.",
  },
  {
    question: "O que acontece depois que eu envio a avaliação?",
    answer:
      "Suas respostas ajudam a entender o momento da empresa e as prioridades. A avaliação é gratuita e passa por análise humana. Se houver alinhamento, o próximo passo é uma conversa de diagnóstico. Depois, você recebe uma proposta com escopo, responsabilidades e condições comerciais. Enviar o formulário não contrata a mentoria.",
  },
] as const;
