import { useEffect } from 'react';
import './motion.css';

/** Progressive enhancement: all content is visible before this controller loads. */
export default function ScrollExperience() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & {connection?: {saveData?: boolean}}).connection;
    const animations = new Set<Animation>();
    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || seen.has(entry.target)) continue;
        seen.add(entry.target);
        observer.unobserve(entry.target);
        if (preference.matches || connection?.saveData) continue;
        const element = entry.target as HTMLElement;
        element.dataset.motionSeen = 'true';
        const chart = element.classList.contains('metodo-chart-bar');
        const animation = element.animate(chart ? [
          {clipPath:'inset(0 96% 0 0)'}, {clipPath:'inset(0 0% 0 0)'}
        ] : [
          {opacity: .12, transform: 'translate3d(0,36px,0)'},
          {opacity: 1, transform: 'translate3d(0,0,0)'}
        ], {duration: chart ? 1150 : 760, easing: 'cubic-bezier(.18,.75,.18,1)', fill: 'none'});
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, {threshold: .08, rootMargin: '0px 0px -24px 0px'});
    const selectors = '.metodo-method-heading,.metodo-panel-copy,.metodo-mentor,.metodo-proof-intro,.metodo-chart-bar,.programa-heading,.programa-investment-copy,.programa-proposal,.programa-readiness-header,.programa-readiness-item,.programa-faq-item,.apply-grid>div';
    document.querySelector(".mentoria-site")?.querySelectorAll(selectors).forEach(element => observer.observe(element));
    const onPreference = () => {
      if (preference.matches) { animations.forEach(a => a.cancel()); animations.clear(); }
    };
    preference.addEventListener('change', onPreference);
    return () => { observer.disconnect(); preference.removeEventListener('change', onPreference); animations.forEach(a => a.cancel()); };
  }, []);
  return null;
}
