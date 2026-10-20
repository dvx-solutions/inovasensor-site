import { leadSchema, outcomes } from '../components/mentoria/qualification/model';

// Durable storage remains on the existing Mentoria Site. This is a fixed,
// server-only destination, never taken from the visitor's payload or headers.
const RECEIVER = 'https://inovasensor-mentoria-ia.gustavobilonia.chatgpt.site/api/leads';
const LIMIT = 15_000;
const failure = 'Não foi possível confirmar o recebimento. Suas respostas continuam nesta tela. Tente novamente; o envio não será duplicado.';

export function mentoriaJson(data: unknown, status = 200) {
  return Response.json(data, {status, headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}

export async function forwardMentoriaLead(request: Request, send: typeof fetch = fetch): Promise<Response> {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return mentoriaJson({error:'Origem de envio não autorizada.'},403);
  if (!request.headers.get('content-type')?.includes('application/json')) return mentoriaJson({error:'Formato inválido.'},415);
  if (Number(request.headers.get('content-length') || 0) > LIMIT) return mentoriaJson({error:'Formulário muito extenso.'},413);
  let payload;
  try {
    const text = await request.text();
    if (text.length > LIMIT) return mentoriaJson({error:'Formulário muito extenso.'},413);
    payload = leadSchema.safeParse(JSON.parse(text));
  } catch {
    return mentoriaJson({error:'Revise o formulário e tente novamente.'},400);
  }
  if (!payload.success) return mentoriaJson({error:'Revise os campos obrigatórios, o e-mail e o telefone antes de enviar.'},400);

  try {
    const upstream = await send(RECEIVER, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload.data), redirect:'error', signal:AbortSignal.timeout(20_000),
    });
    if (!upstream.headers.get('content-type')?.includes('application/json')) return mentoriaJson({error:failure},503);
    if (!upstream.ok) {
      const status = [400,409,413,415,429].includes(upstream.status) ? upstream.status : 503;
      const messages: Record<number,string> = {
        400:'Revise os campos obrigatórios antes de enviar.',
        409:'Reabra a avaliação para enviar suas respostas.',
        413:'Formulário muito extenso.',
        415:'Formato inválido.',
        429:'Já recebemos avaliações deste e-mail hoje. Tente novamente amanhã.',
      };
      return mentoriaJson({error:messages[status] || failure},status);
    }
    const saved: unknown = await upstream.json();
    if (![200,201].includes(upstream.status) || !saved || typeof saved !== 'object' ||
      !('receipt' in saved) || saved.receipt !== payload.data.id ||
      !('route' in saved) || typeof saved.route !== 'string' || !Object.hasOwn(outcomes,saved.route)) {
      return mentoriaJson({error:failure},503);
    }
    return mentoriaJson({receipt:saved.receipt,route:saved.route},upstream.status);
  } catch {
    return mentoriaJson({error:failure},503);
  }
}
