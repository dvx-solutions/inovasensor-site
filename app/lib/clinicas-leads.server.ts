import {createHash, timingSafeEqual} from 'node:crypto';
import {appendFile, mkdir, readFile} from 'node:fs/promises';
import {get, list, put} from '@vercel/blob';
import {envioSchema, VERSAO_POLITICA, type Lead} from '../components/clinicas/model';

// Cada envio vira um JSON privado no Vercel Blob (leads/<id>.json). O agente CMO,
// num servidor sem acesso público, busca os novos com GET /api/leads?desde=<ISO>.
// Sem BLOB_READ_WRITE_TOKEN fora da Vercel (pnpm dev), grava em .data/leads.jsonl.
const LIMITE = 8_000;
const PREFIXO = 'leads/';
const ARQUIVO_LOCAL = '.data/leads.jsonl';
const MAX_LEADS = 500;
// Margem entre o relógio da Vercel e o do Blob ao filtrar por data de envio.
const FOLGA_MS = 10 * 60_000;

const falha = 'Não conseguimos registrar agora. Suas respostas continuam aqui: tente de novo em instantes.';

export function json(data: unknown, status = 200) {
  return Response.json(data, {status, headers: {'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'}});
}

const usaBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const armazenamentoOk = () => usaBlob() || !process.env.VERCEL;

async function gravar(lead: Lead) {
  if (!usaBlob()) {
    await mkdir('.data', {recursive: true});
    const atuais = await lerLocal();
    if (!atuais.some(l => l.id === lead.id)) await appendFile(ARQUIVO_LOCAL, JSON.stringify(lead) + '\n');
    return;
  }
  try {
    await put(`${PREFIXO}${lead.id}.json`, JSON.stringify(lead), {
      access: 'private', addRandomSuffix: false, allowOverwrite: false, contentType: 'application/json',
    });
  } catch (erro) {
    // Mesmo id já gravado: é o reenvio de quem não viu a confirmação.
    if (erro instanceof Error && /already exists/i.test(erro.message)) return;
    throw erro;
  }
}

async function lerLocal(): Promise<Lead[]> {
  try {
    return (await readFile(ARQUIVO_LOCAL, 'utf8')).split('\n').filter(Boolean).map(l => JSON.parse(l) as Lead);
  } catch {
    return [];
  }
}

async function lerBlob(desde: number): Promise<Lead[]> {
  const achados: {caminho: string; em: number}[] = [];
  let cursor: string | undefined;
  do {
    const pagina = await list({prefix: PREFIXO, cursor, limit: 1000});
    for (const b of pagina.blobs) {
      const em = b.uploadedAt.getTime();
      if (em >= desde - FOLGA_MS) achados.push({caminho: b.pathname, em});
    }
    cursor = pagina.hasMore ? pagina.cursor : undefined;
  } while (cursor);
  // Só baixa o necessário: os mais antigos primeiro, até o limite (com margem da folga).
  const caminhos = achados.sort((a, b) => a.em - b.em).slice(0, MAX_LEADS + 50).map(a => a.caminho);

  const leads: Lead[] = [];
  for (let i = 0; i < caminhos.length; i += 8) {
    const lote = await Promise.all(caminhos.slice(i, i + 8).map(async caminho => {
      const r = await get(caminho, {access: 'private', useCache: false});
      if (!r || r.statusCode !== 200) return null;
      return JSON.parse(await new Response(r.stream).text()) as Lead;
    }));
    for (const l of lote) if (l) leads.push(l);
  }
  return leads;
}

export async function receberLead(request: Request): Promise<Response> {
  const origem = request.headers.get('origin');
  if (origem && origem !== new URL(request.url).origin) return json({error: 'Origem de envio não autorizada.'}, 403);
  if (!request.headers.get('content-type')?.includes('application/json')) return json({error: 'Formato inválido.'}, 415);
  if (Number(request.headers.get('content-length') || 0) > LIMITE) return json({error: 'Formulário muito extenso.'}, 413);
  let envio;
  try {
    const texto = await request.text();
    if (texto.length > LIMITE) return json({error: 'Formulário muito extenso.'}, 413);
    const bruto = JSON.parse(texto);
    // Armadilha preenchida: é robô. Responde como se tivesse gravado e não grava.
    if (bruto && typeof bruto.website === 'string' && bruto.website !== '') {
      return json({recebido: typeof bruto.id === 'string' ? bruto.id.slice(0, 40) : 'ok'}, 201);
    }
    envio = envioSchema.safeParse(bruto);
  } catch {
    return json({error: 'Revise o formulário e tente de novo.'}, 400);
  }
  if (!envio.success) return json({error: 'Revise os campos marcados e tente de novo.'}, 400);
  if (!armazenamentoOk()) return json({error: falha}, 503);

  const {consentimento: _c, website: _w, ...dados} = envio.data;
  const agora = new Date().toISOString();
  const lead: Lead = {...dados, criado_em: agora, consentimento_em: agora, consentimento_versao: VERSAO_POLITICA};
  try {
    await gravar(lead);
  } catch {
    return json({error: falha}, 503);
  }
  return json({recebido: lead.id}, 201);
}

const resumo = (v: string) => createHash('sha256').update(v).digest();

function autorizado(request: Request) {
  const segredo = process.env.SITE_LEADS_TOKEN || '';
  const enviado = /^Bearer (.+)$/.exec(request.headers.get('authorization') || '')?.[1] || '';
  if (segredo.length < 32 || !enviado) return false;
  return timingSafeEqual(resumo(segredo), resumo(enviado));
}

export async function listarLeads(request: Request): Promise<Response> {
  if (!autorizado(request)) return json({error: 'Acesso restrito.'}, 401);
  const parametro = new URL(request.url).searchParams.get('desde') || '1970-01-01T00:00:00Z';
  const desde = Date.parse(parametro);
  if (Number.isNaN(desde)) return json({error: 'Use desde=<data ISO 8601>.'}, 400);
  if (!armazenamentoOk()) return json({error: 'Armazenamento não configurado.'}, 503);
  try {
    const todos = (usaBlob() ? await lerBlob(desde) : await lerLocal())
      .filter(l => Date.parse(l.criado_em) >= desde)
      .sort((a, b) => a.criado_em.localeCompare(b.criado_em));
    const leads = todos.slice(0, MAX_LEADS);
    // mais=true: chame de novo com desde = criado_em do último lead (o leitor descarta id repetido).
    return json({leads, total: leads.length, mais: todos.length > MAX_LEADS});
  } catch {
    return json({error: 'Não foi possível ler os leads agora.'}, 503);
  }
}
