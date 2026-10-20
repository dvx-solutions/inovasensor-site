import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/mentoria-ia/privacidade')({
  beforeLoad: () => { throw redirect({ to: '/privacidade', statusCode: 301 }); },
});
