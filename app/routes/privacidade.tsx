import { createFileRoute } from '@tanstack/react-router';
import Privacy from '../components/mentoria/Privacy';

export const Route = createFileRoute('/privacidade')({
  head: () => ({meta:[{title:'Política de privacidade | InovaSensor'},{name:'robots',content:'noindex'}]}),
  component: Privacy,
});
