import { createFileRoute } from '@tanstack/react-router';
import { listarLeads, receberLead } from '../lib/clinicas-leads.server';

// POST: envio do formulário de avaliação gratuita.
// GET ?desde=<ISO>: leitura pelo agente CMO, com Authorization: Bearer <SITE_LEADS_TOKEN>.
export const Route = createFileRoute('/api/leads')({
  server: {
    handlers: {
      POST: ({request}: {request: Request}) => receberLead(request),
      GET: ({request}: {request: Request}) => listarLeads(request),
    },
  },
});
