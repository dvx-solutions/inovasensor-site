import { createFileRoute } from '@tanstack/react-router';
import Landing from '../components/clinicas/Landing';

const SITE = 'https://www.inovasensor.com.br';
const titulo = 'Menos faltas e buracos na agenda da sua clínica | InovaSensor';
const descricao = 'Cada falta é uma cadeira vazia. Confirmação da véspera, encaixe e retorno de pacientes montados no WhatsApp da sua clínica, com IA e a sua equipe no comando. Calcule a perda e peça a avaliação gratuita.';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {title: titulo},
      {name: 'description', content: descricao},
      {name: 'theme-color', content: '#14070f'},
      {property: 'og:title', content: titulo},
      {property: 'og:description', content: 'Cada falta é uma cadeira vazia. Veja quanto isso custa e como encher a agenda.'},
      {property: 'og:type', content: 'website'},
      {property: 'og:locale', content: 'pt_BR'},
      {property: 'og:url', content: `${SITE}/`},
      {property: 'og:image', content: `${SITE}/clinicas-assets/recepcao-896.webp`},
      {name: 'twitter:card', content: 'summary_large_image'},
    ],
    links: [
      {rel: 'canonical', href: `${SITE}/`},
      {rel: 'preload', as: 'font', type: 'font/woff2', href: '/clinicas-assets/fonts/bricolage-latin.woff2', crossOrigin: 'anonymous'},
      {rel: 'icon', type: 'image/webp', href: '/mentoria-assets/brand/logo-inova.webp'},
    ],
  }),
  component: Landing,
});
