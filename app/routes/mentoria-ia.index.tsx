import { createFileRoute, redirect } from '@tanstack/react-router';

// A mentoria saiu de /mentoria-ia para a home; o endereço antigo continua valendo.
export const Route = createFileRoute('/mentoria-ia/')({
  beforeLoad: () => { throw redirect({ to: '/', statusCode: 301 }); },
});
