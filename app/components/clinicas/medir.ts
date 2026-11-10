// Pixel da Meta e a conta da calculadora de faltas, compartilhados entre as seções.
import {useSyncExternalStore} from 'react';

type Fbq = (...a: unknown[]) => void;
const fbq = (...a: unknown[]) => { try { (window as Window & {fbq?: Fbq}).fbq?.(...a); } catch { /* sem pixel */ } };

// Nomes exatos que o CMO lê no Gerenciador de Eventos.
export const EVENTOS = {
  formulario: 'ViewContent',
  passo2: 'AvaliacaoPasso2',
  passo3: 'AvaliacaoPasso3',
  calculadora: 'CalculadoraUsada',
  lead: 'Lead',
  whatsapp: 'WhatsAppAberto',
} as const;

const jaFoi = new Set<string>();
// Cada evento conta uma vez por carregamento da página.
export function medir(evento: (typeof EVENTOS)[keyof typeof EVENTOS], dados: Record<string, unknown> = {}, opcoes?: {eventID: string}) {
  if (evento !== EVENTOS.lead && jaFoi.has(evento)) return;
  jaFoi.add(evento);
  const padrao = evento === 'ViewContent' || evento === 'Lead';
  fbq(padrao ? 'track' : 'trackCustom', evento, dados, ...(opcoes ? [opcoes] : []));
}

export type Calculo = {consultas_dia: number; faltas_pct: number; ticket: number; dias: number; perda_mes: number; resumo: string};

export const reais = (v: number) => v.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL', maximumFractionDigits: 0});

export function calcular(consultas_dia: number, faltas_pct: number, ticket: number, dias: number): Calculo {
  const perda_mes = Math.round(consultas_dia * (faltas_pct / 100) * ticket * dias);
  const resumo = `Calculadora do site: ${consultas_dia} consultas/dia × ${faltas_pct}% de faltas × ${reais(ticket)} de ticket × ${dias} dias = ${reais(perda_mes)} por mês`;
  return {consultas_dia, faltas_pct, ticket, dias, perda_mes, resumo};
}

// A calculadora grava aqui e o formulário lê. Fica na sessão porque o navegador do Instagram recarrega a página.
const CHAVE = 'cl-calculo';
let atual: Calculo | null = null;
let lido = false;
const ouvintes = new Set<() => void>();

function ler() {
  if (!lido && typeof window !== 'undefined') {
    lido = true;
    try { atual = JSON.parse(sessionStorage.getItem(CHAVE) || 'null'); } catch { atual = null; }
  }
  return atual;
}

export function guardarCalculo(c: Calculo) {
  atual = c;
  lido = true;
  try { sessionStorage.setItem(CHAVE, JSON.stringify(c)); } catch { /* armazenamento bloqueado */ }
  ouvintes.forEach(f => f());
}

export function useCalculo() {
  return useSyncExternalStore(f => { ouvintes.add(f); return () => ouvintes.delete(f); }, ler, () => null);
}
