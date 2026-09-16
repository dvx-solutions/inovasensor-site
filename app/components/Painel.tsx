import { useEffect, useRef, useState } from "react";
import { SectionHead } from "~/components/ui/Section";
import { canAnimate, ensureGsap, isCompact } from "~/lib/motion";
import type { Copy } from "~/lib/copy";

/**
 * Bloco 04 — o painel.
 *
 * O bloco 03 explica a lógica com a cena 3D; aqui embaixo vem a prova,
 * que são três passagens reais do mesmo reservatório. O scroll pina a
 * seção e atravessa as três, na mesma mecânica do bloco anterior.
 *
 * Duas regras que vieram de uma tentativa que deu errado: a tela NUNCA
 * fica atrás do texto e NUNCA é cortada. Quando a captura vira fundo,
 * a tipografia do site briga com a do sistema e o corte come justamente
 * o que a pessoa veio ver. Por isso a imagem é `object-contain` com teto
 * de altura — encolhe, nunca recorta — e todo o texto vive abaixo dela.
 *
 * A opacidade é escrita direto no DOM dentro do onUpdate: passar isso
 * por estado do React re-renderizaria a cada quadro do scrub.
 *
 * Imagens em WebP com um `-1x` para telas não-retina; o PNG mestre fica
 * ao lado, em `public/sistema/`, para reexportar quando precisar.
 */

type Shot = Copy["painel"]["telas"]["shots"][number];

function Tela({ s, eager, modo }: { s: Shot; eager: boolean; modo: "pinado" | "lista" }) {
  return (
    <img
      src={`${s.src}.webp`}
      srcSet={`${s.src}-1x.webp 921w, ${s.src}.webp 1842w`}
      sizes="(min-width: 768px) 92vw, 94vw"
      width={1842}
      height={895}
      alt={s.alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={
        modo === "pinado"
          ? /* Pinado a altura é o recurso escasso, então o teto é vertical
               e a largura segue. `object-contain` garante que encolher
               nunca vire recorte. */
            "panel mx-auto block max-h-[40svh] w-auto max-w-full object-contain"
          : /* Na lista há largura de sobra e as imagens abaixo da dobra são
               lazy: `w-full h-auto` deixa o navegador reservar a caixa pela
               proporção antes de carregar. Com `w-auto` elas nascem com 2 px
               e saltam ao carregar. */
            "panel block h-auto w-full"
      }
    />
  );
}

function Leitura({ s, alerta }: { s: Shot; alerta: boolean }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
      <div>
        <span className="label label-cyan readout">{s.date}</span>
        <p className="mt-3 flex items-baseline gap-2">
          <span
            className="text-[2.4rem] leading-none md:text-[2.9rem]"
            style={{
              fontFamily: "var(--font-display)",
              /* Laranja é a cor de alerta do índice, não enfeite: só
                 acende na passagem que de fato estourou a faixa. */
              color: alerta ? "var(--color-flare)" : "var(--color-cyan)",
            }}
          >
            {s.value}
          </span>
          <span className="text-fg-mute text-sm">{s.unit}</span>
        </p>
        <p className="text-fg-dim mt-2 text-sm">
          {s.state} · {s.note}
        </p>
      </div>
      <p className="prose-body max-w-[38rem] text-[1rem]">{s.body}</p>
    </div>
  );
}

export default function Painel({ t }: { t: Copy }) {
  const { caption, shots } = t.painel.telas;
  const section = useRef<HTMLElement>(null);
  const frames = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (!canAnimate() || isCompact()) return;
    const { gsap, ScrollTrigger } = ensureGsap();
    setPinned(true);

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        // Uma viewport de scroll por transição, como no bloco 03.
        end: `+=${(shots.length - 1) * 100}%`,
        pin: ".painel-pin",
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const raw = self.progress * (shots.length - 1);
          frames.current.forEach((el, i) => {
            if (!el) return;
            // Cruzada linear: a vizinha entra na mesma proporção em que a
            // atual sai, então o fundo nunca aparece entre as duas.
            el.style.opacity = String(Math.max(0, 1 - Math.abs(raw - i)));
          });
          setActive(Math.round(raw));
        },
      });
      return () => st.kill();
    }, section);

    return () => {
      ctx.revert();
      setPinned(false);
    };
  }, [shots.length]);

  const atual = shots[active] ?? shots[0];
  const ultima = shots.length - 1;

  return (
    <section ref={section} id="painel" className="rule-top relative">
      <div className="painel-pin relative overflow-hidden">
        <div className="shell flex min-h-[100svh] flex-col justify-center py-14">
          {pinned ? (
            /* Cabeçalho enxuto: pinado, cada linha de texto disputa altura
               com a tela — e é a tela que a pessoa veio ver. A lede volta
               inteira no modo lista, onde há espaço de sobra. */
            <div>
              <div className="flex items-center gap-3">
                <span className="label label-cyan readout">{t.painel.index}</span>
                <span className="h-px w-8 bg-edge" />
                <span className="label">{t.painel.eyebrow}</span>
              </div>
              <h2 className="display-m mt-3">{t.painel.h2}</h2>
            </div>
          ) : (
            <SectionHead
              index={t.painel.index}
              eyebrow={t.painel.eyebrow}
              title={t.painel.h2}
              lede={t.painel.lede}
            />
          )}

          {pinned ? (
            /* ── modo pinado: uma passagem por vez, trocando no scroll ── */
            <>
              <div className="relative mt-8">
                {/* A primeira fica no fluxo e dá altura à pilha; as outras
                    empilham por cima, centralizadas para coincidirem. */}
                {shots.map((s, i) => (
                  <div
                    key={s.src}
                    ref={(el) => {
                      frames.current[i] = el;
                    }}
                    className={
                      i === 0 ? "relative" : "absolute inset-0 flex items-center justify-center"
                    }
                    style={{ opacity: i === 0 ? 1 : 0 }}
                  >
                    <Tela s={s} eager={i === 0} modo={pinned ? "pinado" : "lista"} />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-1.5" role="presentation">
                {shots.map((s, i) => (
                  <span
                    key={s.src}
                    className="h-0.5 flex-1 transition-colors duration-300"
                    style={{
                      background:
                        i <= active
                          ? i === ultima
                            ? "var(--color-flare)"
                            : "var(--color-cyan)"
                          : "var(--color-shelf)",
                    }}
                  />
                ))}
              </div>

              <div className="mt-5">
                <Leitura s={atual} alerta={active === ultima} />
              </div>
            </>
          ) : (
            /* ── modo lista: as três empilhadas, cada uma inteira ── */
            <div className="mt-12 flex flex-col gap-16">
              {shots.map((s, i) => (
                <figure key={s.src} className="reveal">
                  <Tela s={s} eager={i === 0} modo={pinned ? "pinado" : "lista"} />
                  <figcaption className="mt-6">
                    <Leitura s={s} alerta={i === ultima} />
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          {/* Crédito e ressalva numa linha só: pinado, cada parágrafo
              extra rouba altura da tela. */}
          <p className="text-fg-dim mt-7 max-w-[92ch] text-[12.5px] leading-relaxed">
            <span className="label">{caption}</span>
            <span className="mx-2 opacity-40">—</span>
            {t.painel.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
