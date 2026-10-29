// GSAP registrado uma vez para todas as seções. Use dentro de useEffect com gsap.context(..., ref).
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export {gsap, ScrollTrigger};

export const reduzido = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export const celular = () => typeof window !== 'undefined' && matchMedia('(max-width: 760px)').matches;

export function temWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

// Chama cb(true/false) quando o elemento entra/sai da tela e quando a aba some/volta.
export function aoVisivel(el: Element, cb: (visivel: boolean) => void) {
  let naTela = false;
  const avisar = () => cb(naTela && !document.hidden);
  const io = new IntersectionObserver(([e]) => { naTela = e.isIntersecting; avisar(); }, {rootMargin: '100px'});
  io.observe(el);
  document.addEventListener('visibilitychange', avisar);
  return () => { io.disconnect(); document.removeEventListener('visibilitychange', avisar); };
}
