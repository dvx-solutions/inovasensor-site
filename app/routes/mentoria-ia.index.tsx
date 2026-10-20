import { createFileRoute } from '@tanstack/react-router';
import Landing from '../components/mentoria/Landing';

export const Route = createFileRoute('/mentoria-ia/')({
  head: () => ({
    meta: [
      {title:'Mentoria de IA para empresas | InovaSensor'},
      {name:'description',content:'Implementação de IA, treinamento da equipe e acompanhamento individual com Gustavo Bilonia. Conheça a mentoria e avalie as prioridades da sua empresa.'},
      {name:'theme-color',content:'#141419'},
      {property:'og:title',content:'Mentoria de IA para empresas | InovaSensor'},
      {property:'og:description',content:'Implementação, treinamento e acompanhamento para colocar IA na rotina da empresa.'},
      {property:'og:type',content:'website'},
      {property:'og:locale',content:'pt_BR'},
      {name:'twitter:card',content:'summary'},
    ],
    links:[{rel:'icon',type:'image/webp',href:'/mentoria-assets/brand/logo-inova.webp'}],
  }),
  component: Landing,
});
