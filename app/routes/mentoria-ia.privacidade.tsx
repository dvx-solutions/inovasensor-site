import { createFileRoute } from '@tanstack/react-router';
import Privacy from '../components/mentoria/Privacy';

export const Route = createFileRoute('/mentoria-ia/privacidade')({
  head: () => ({meta:[{title:'Privacidade da avaliação | InovaSensor Mentoria IA'},{name:'robots',content:'noindex'}]}),
  component: Privacy,
});
