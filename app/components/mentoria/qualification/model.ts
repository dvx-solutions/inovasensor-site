import {z} from 'zod';

export const choices={

segment:['Serviços B2B','Comércio / e-commerce','Indústria','Turismo / hospitalidade','Saúde / educação','Outro'],

team:['Só eu','2 a 5 pessoas','6 a 15 pessoas','16 a 50 pessoas','51 a 100 pessoas','Mais de 100'],

role:['Sou dono(a) / sócio(a)','Sou gestor(a)','Faço parte da equipe'],

decision:['Decido este investimento','Decido com um sócio / diretor','Posso envolver quem decide','Ainda não tenho acesso ao decisor'],

manager:['Eu concentro a gestão','Tenho gestores responsáveis','Dividimos entre sócios','Ainda não há um responsável claro'],

ai:['ChatGPT','Claude','Gemini','Copilot','S360 OS','Outra IA','Ainda não uso'],

teamAi:['Ainda não usa','Algumas pessoas usam por conta própria','Usa com frequência, sem padrão','Já tem processos e regras de uso','Não sei dizer'],

systems:['ERP / CRM','Gestor de tarefas / projetos','Planilhas','WhatsApp / e-mail','Outro sistema','Sem sistema definido'],

process:['Atendimento e demandas','Propostas e acompanhamento comercial','Rotinas administrativas','Gestão e indicadores','Outro processo'],

frequency:['Todos os dias','Toda semana','Ocasionalmente','Ainda não sei'],

impact:['Atrasos e cobrança constante','Retrabalho e erros','Perda de oportunidades','Falta de visão para decidir','Ainda preciso identificar'],

revenue:['Até R$30 mil','R$30 mil a R$60 mil','R$60 mil a R$100 mil','R$100 mil a R$300 mil','R$300 mil a R$1 milhão','Acima de R$1 milhão','Prefiro conversar sobre isso'],

budget:['Podemos avaliar uma proposta após o diagnóstico','Precisamos planejar o investimento','Ainda estamos pesquisando possibilidades','Não há previsão de investimento agora'],

owner:['Eu vou conduzir internamente','Tenho um gestor para conduzir','Posso definir alguém','Hoje não temos quem conduza'],

time:['Sim, consigo reservar esse tempo','Preciso reorganizar a agenda','Não consigo neste momento'],

start:['Nos próximos 30 dias','Entre 1 e 3 meses','Depois de 3 meses','Estou conhecendo as possibilidades']

} as const;

export type Answers={company:string;segment:string;team:string;role:string;decision:string;manager:string;ai:string[];aiOther:string;teamAi:string;systems:string[];process:string;detail:string;frequency:string;impact:string;revenue:string;budget:string;owner:string;time:string;start:string};

export const emptyAnswers:Answers={company:'',segment:'',team:'',role:'',decision:'',manager:'',ai:[],aiOther:'',teamAi:'',systems:[],process:'',detail:'',frequency:'',impact:'',revenue:'',budget:'',owner:'',time:'',start:''};

export const answerSchema=z.object({company:z.string().trim().min(2).max(100),segment:z.enum(choices.segment),team:z.enum(choices.team),role:z.enum(choices.role),decision:z.enum(choices.decision),manager:z.enum(choices.manager),ai:z.array(z.enum(choices.ai)).min(1).max(7),aiOther:z.string().trim().max(120),teamAi:z.enum(choices.teamAi),systems:z.array(z.enum(choices.systems)).min(1).max(6),process:z.enum(choices.process),detail:z.string().trim().min(12).max(1000),frequency:z.enum(choices.frequency),impact:z.enum(choices.impact),revenue:z.enum(choices.revenue),budget:z.enum(choices.budget),owner:z.enum(choices.owner),time:z.enum(choices.time),start:z.enum(choices.start)}).strict().refine(a=>!a.ai.includes('Ainda não uso')||a.ai.length===1,{message:'Selecione as ferramentas ou a opção ainda não uso.'}).refine(a=>!a.systems.includes('Sem sistema definido')||a.systems.length===1,{message:'Revise os sistemas selecionados.'}).refine(a=>!a.ai.includes('Outra IA')||a.aiOther.trim().length>=2,{message:'Informe qual outra IA utiliza.'});

export const leadSchema=z.object({id:z.string().uuid(),answers:answerSchema,name:z.string().trim().min(2).max(100),email:z.string().trim().email().max(150),phone:z.string().regex(/^\+?[0-9 ()-]{10,22}$/).refine(v=>{const n=v.replace(/\D/g,'');return n.length>=10&&n.length<=15},'Telefone inválido'),consent:z.literal(true),website:z.string().max(0),source:z.record(z.string().max(160)).default({})}).strict();

export function classify(a:Answers){

let score=0;const flags:string[]=[];

score+=a.detail.trim().length>=12?15:0;score+=a.frequency==='Todos os dias'?10:a.frequency==='Toda semana'?7:2;

score+=a.impact==='Ainda preciso identificar'?3:15;

score+=a.budget===choices.budget[0]?25:a.budget===choices.budget[1]?15:a.budget===choices.budget[2]?5:0;

score+=a.decision==='Decido este investimento'?15:a.decision==='Decido com um sócio / diretor'?12:a.decision==='Posso envolver quem decide'?7:0;

score+=['Eu vou conduzir internamente','Tenho um gestor para conduzir'].includes(a.owner)?10:a.owner==='Posso definir alguém'?5:0;

score+=a.time==='Sim, consigo reservar esse tempo'?10:a.time==='Preciso reorganizar a agenda'?5:0;

flags.push('Escopo, condições e capacidade de investimento devem ser confirmados na proposta; não houve preço informado nesta avaliação.');

if(a.revenue==='Até R$30 mil')flags.push('Entender prioridades e disponibilidade de recursos antes de propor o escopo.');

if(a.revenue==='Prefiro conversar sobre isso')flags.push('Faturamento não informado; confirmar capacidade de investimento na conversa.');

if(a.team==='Só eu')flags.push('Operação solo: avaliar benefício e esforço antes de recomendar o programa.');

if(a.manager==='Ainda não há um responsável claro')flags.push('Definir responsável pelo processo.');

if(a.teamAi==='Não sei dizer')flags.push('Mapear uso de IA pela equipe.');

if(a.start==='Depois de 3 meses'||a.start==='Estou conhecendo as possibilidades')flags.push('Prazo exploratório: alinhar momento de início.');

let route:'conversa'|'alinhar'|'preparar'='conversa';

if(a.budget===choices.budget[3]||a.owner==='Hoje não temos quem conduza'||a.time==='Não consigo neste momento')route='preparar';

else if(a.owner===choices.owner[2]||score<75||a.budget!==choices.budget[0]||a.decision==='Ainda não tenho acesso ao decisor'||a.time!=='Sim, consigo reservar esse tempo')route='alinhar';

return {score,route,flags};

}

export const outcomes={conversa:{title:'Sua avaliação foi recebida.',text:'Você identificou uma prioridade e disponibilidade para conversar. Vamos analisar o contexto antes de recomendar a mentoria. Escopo e condições comerciais serão apresentados em uma proposta após o diagnóstico.',next:'Separe um exemplo recente da demanda que descreveu e envolva o responsável pelo processo.'},alinhar:{title:'Vamos analisar o momento da sua empresa.',text:'Suas respostas foram recebidas. Vamos avaliar as prioridades e os pontos de decisão, agenda ou planejamento que precisam ser alinhados antes de uma proposta.',next:'Converse com quem decide e com quem acompanharia a implementação. Uma prioridade definida ajuda a preparar o diagnóstico.'},preparar:{title:'Suas respostas vão orientar os próximos passos.',text:'Pelo contexto informado, pode ser necessário organizar tempo, recursos ou um responsável antes de iniciar. A avaliação passa por análise humana e não determina, sozinha, a contratação.',next:'Identifique uma rotina prioritária e quem pode acompanhar a mudança. Esse contexto ajuda a avaliar o momento adequado para começar.'}};

