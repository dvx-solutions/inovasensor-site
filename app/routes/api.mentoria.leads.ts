import { createFileRoute } from '@tanstack/react-router';
import { forwardMentoriaLead, mentoriaJson } from '../lib/mentoria-leads.server';

export const Route = createFileRoute('/api/mentoria/leads')({
  server: {
    handlers: {
      POST: ({request}: {request: Request}) => forwardMentoriaLead(request),
      GET: () => mentoriaJson({error:'Acesso restrito.'},403),
      HEAD: () => new Response(null,{status:403,headers:{'Cache-Control':'no-store'}}),
    },
  },
});
