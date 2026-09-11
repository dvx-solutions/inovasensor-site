import { createServerFn } from "@tanstack/react-start";

/**
 * Recebimento de solicitações de avaliação de viabilidade.
 *
 * Três canais, nesta ordem de importância:
 *
 *   1. E-MAIL     canal principal. Cai na caixa institucional, com
 *                 Reply-To no e-mail do lead — responder vai direto
 *                 para o prospect, sem copiar endereço na mão.
 *   2. WEBHOOK    espelho opcional para Slack / n8n / CRM.
 *   3. ARQUIVO    conveniência de desenvolvimento. É BEST-EFFORT: em
 *                 hospedagem serverless o disco é somente-leitura e
 *                 efêmero, então ele nunca pode derrubar o envio.
 *
 * Variáveis de ambiente:
 *   ALGEYE_RESEND_API_KEY   chave da Resend. Sem ela, o e-mail é pulado.
 *   ALGEYE_MAIL_TO          destinatário (padrão: contato institucional)
 *   ALGEYE_MAIL_FROM        remetente — precisa ser de domínio verificado
 *                           na Resend (padrão: alertas@algeye.com.br)
 *   ALGEYE_LEAD_WEBHOOK     URL que recebe um POST JSON por lead
 *   ALGEYE_LEAD_FILE        caminho do arquivo (padrão: .data/leads.jsonl)
 */

export type LeadInput = {
  name: string;
  org: string;
  role: string;
  email: string;
  reservoir: string;
  lang: string;
};

export type LeadResult = { ok: true } | { ok: false; error: string };

const MAX = 400;
const clean = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, MAX) : "");
const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

const DEFAULT_TO = "gustavo.henrique@devexsolucoes.com.br";
const DEFAULT_FROM = "AlgEye <alertas@algeye.com.br>";

/** Escapa para interpolação segura no corpo HTML do e-mail. */
const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Record_ = LeadInput & { receivedAt: string; source: string };

function buildEmail(r: Record_) {
  const who = r.org || r.name;
  const subject = `AlgEye · avaliação de viabilidade — ${who}`;

  const rows: Array<[string, string]> = [
    ["Nome", r.name],
    ["Organização", r.org || "—"],
    ["Cargo", r.role || "—"],
    ["E-mail", r.email],
    ["Reservatório", r.reservoir],
    ["Idioma da página", r.lang === "en" ? "Inglês" : "Português"],
    ["Recebido em", new Date(r.receivedAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })],
  ];

  const text = [
    "Nova solicitação de avaliação de viabilidade — AlgEye",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    `Responder a este e-mail fala direto com ${r.name}.`,
  ].join("\n");

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0e1d22">
  <p style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#0c7a84;margin:0 0 6px">AlgEye · novo lead</p>
  <h1 style="font-size:22px;line-height:1.25;margin:0 0 20px;color:#0e1d22">Avaliação de viabilidade solicitada</h1>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    ${rows
      .map(
        ([k, v]) => `<tr>
      <td style="padding:9px 0;border-bottom:1px solid #e2eceb;color:#48606a;width:36%;vertical-align:top">${esc(k)}</td>
      <td style="padding:9px 0;border-bottom:1px solid #e2eceb;color:#0e1d22;font-weight:500">${esc(v)}</td>
    </tr>`,
      )
      .join("")}
  </table>
  <p style="font-size:13px;color:#48606a;margin:20px 0 0">
    Responder a este e-mail fala direto com ${esc(r.name)} (${esc(r.email)}).
  </p>
</div>`.trim();

  return { subject, text, html };
}

async function sendEmail(r: Record_): Promise<{ ok: boolean; detail?: string }> {
  const apiKey = process.env.ALGEYE_RESEND_API_KEY;
  if (!apiKey) return { ok: false, detail: "sem ALGEYE_RESEND_API_KEY" };

  const { subject, text, html } = buildEmail(r);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.ALGEYE_MAIL_FROM ?? DEFAULT_FROM,
      to: [process.env.ALGEYE_MAIL_TO ?? DEFAULT_TO],
      reply_to: r.email,
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) return { ok: false, detail: `resend ${res.status}: ${(await res.text()).slice(0, 200)}` };
  return { ok: true };
}

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((raw: LeadInput): LeadInput => {
    const lead: LeadInput = {
      name: clean(raw?.name),
      org: clean(raw?.org),
      role: clean(raw?.role),
      email: clean(raw?.email),
      reservoir: clean(raw?.reservoir),
      lang: clean(raw?.lang) || "pt",
    };
    if (!lead.name) throw new Error("name required");
    if (!looksLikeEmail(lead.email)) throw new Error("valid email required");
    if (!lead.reservoir) throw new Error("reservoir required");
    return lead;
  })
  .handler(async ({ data }): Promise<LeadResult> => {
    const record: Record_ = { ...data, receivedAt: new Date().toISOString(), source: "algeye-site" };

    let durable = false; // algum canal que sobrevive a um restart?

    // ── 1. e-mail ────────────────────────────────────────────
    try {
      const mail = await sendEmail(record);
      if (mail.ok) durable = true;
      else console.warn("[algeye] e-mail não enviado:", mail.detail);
    } catch (err) {
      console.error("[algeye] falha ao enviar e-mail", err);
    }

    // ── 2. webhook ───────────────────────────────────────────
    const webhook = process.env.ALGEYE_LEAD_WEBHOOK;
    if (webhook) {
      try {
        const res = await fetch(webhook, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(record),
        });
        if (res.ok) durable = true;
        else console.warn("[algeye] webhook respondeu", res.status);
      } catch (err) {
        console.error("[algeye] webhook falhou", err);
      }
    }

    // ── 3. arquivo (best-effort) ─────────────────────────────
    // Em serverless isto falha por design: o disco é somente-leitura.
    // Por isso não entra na conta do que torna a entrega confiável e
    // nunca devolve erro para quem preencheu o formulário.
    let fileOk = false;
    try {
      const { mkdir, appendFile } = await import("node:fs/promises");
      const path = await import("node:path");
      const file = process.env.ALGEYE_LEAD_FILE ?? path.join(process.cwd(), ".data", "leads.jsonl");
      await mkdir(path.dirname(file), { recursive: true });
      await appendFile(file, `${JSON.stringify(record)}\n`, "utf8");
      fileOk = true;
    } catch {
      // silencioso: esperado em produção serverless
    }

    if (!durable && !fileOk) {
      console.error("[algeye] LEAD PERDIDO — nenhum canal de entrega funcionou", record);
      return { ok: false, error: "delivery" };
    }

    if (!durable) {
      console.warn(
        "[algeye] lead gravado apenas em disco. Configure ALGEYE_RESEND_API_KEY " +
          "ou ALGEYE_LEAD_WEBHOOK antes de publicar.",
      );
    }

    return { ok: true };
  });
