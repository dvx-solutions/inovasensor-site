import {z} from 'zod';

// Mesmas perguntas e chaves do formulário do anúncio (guarda-meta/leads.py,
// PERGUNTAS). O CMO lê as chaves; o texto é só para a tela.
export const perguntas = {
  tipo_clinica: {titulo: 'Qual é o tipo da sua clínica?', opcoes: [
    ['odonto', 'Odontológica'], ['medica', 'Médica'], ['estetica', 'Estética'], ['fisio', 'Fisioterapia'], ['outra', 'Outra'],
  ]},
  papel: {titulo: 'Você é:', opcoes: [
    ['dono', 'Dono(a) ou sócio(a)'], ['gestor', 'Gestor(a)'], ['recepcao', 'Recepção'], ['outro', 'Outro'],
  ]},
  profissionais: {titulo: 'Quantos profissionais atendem na clínica?', opcoes: [
    ['p1', '1'], ['p2_4', '2 a 4'], ['p5_10', '5 a 10'], ['p10', 'Mais de 10'],
  ]},
  recepcao: {titulo: 'Quantas pessoas trabalham na recepção?', opcoes: [
    ['r1', '1'], ['r2', '2'], ['r3', '3 ou mais'],
  ]},
  dor: {titulo: 'O que mais pesa hoje?', opcoes: [
    ['faltas', 'Faltas e agenda com buracos'], ['orcamento', 'Orçamento que não fecha'],
    ['sumido', 'Paciente que sumiu'], ['recepcao', 'Recepção sobrecarregada'], ['numeros', 'Não enxergo os números'],
  ]},
  quando: {titulo: 'Quando quer começar?', opcoes: [
    ['agora', 'Agora'], ['30d', 'Em até 30 dias'], ['pesquisando', 'Só estou pesquisando'],
  ]},
} as const;

export type Pergunta = keyof typeof perguntas;
export const ordemPerguntas = Object.keys(perguntas) as Pergunta[];

const opcao = <K extends Pergunta>(k: K) =>
  z.enum(perguntas[k].opcoes.map(o => o[0]) as unknown as [string, ...string[]]);

const telefone = z.string().trim().regex(/^\+?[0-9 ()-]{10,22}$/)
  .refine(v => {const n = v.replace(/\D/g, ''); return n.length >= 10 && n.length <= 13;}, 'WhatsApp inválido');

// O que o navegador envia. `id` vem do navegador para o reenvio não duplicar.
export const envioSchema = z.object({
  id: z.string().uuid(),
  tipo_clinica: opcao('tipo_clinica'),
  papel: opcao('papel'),
  profissionais: opcao('profissionais'),
  recepcao: opcao('recepcao'),
  dor: opcao('dor'),
  quando: opcao('quando'),
  nome: z.string().trim().min(2).max(100),
  whatsapp: telefone,
  cidade: z.string().trim().min(2).max(80),
  clinica: z.string().trim().min(2).max(120),
  consentimento: z.literal(true),
  website: z.string().max(0),
  origem: z.record(z.string().max(160)).default({}),
}).strict();

export type Envio = z.infer<typeof envioSchema>;

// O que fica guardado e o que GET /api/leads devolve.
export type Lead = Omit<Envio, 'consentimento' | 'website'> & {criado_em: string};
