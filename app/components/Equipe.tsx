import { useEffect, useRef } from "react";

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

const members = [
  {
    photo: "/team/gustavo.jpeg",
    initials: "GuB",
    name: "Gustavo Bilonia",
    gradient: "from-amber-500 to-orange-400",
  },
  {
    photo: "/team/guilherme.jpg",
    initials: "GB",
    name: "Guilherme Bilonia",
    gradient: "from-violet-600 to-pink-500",
  },
  {
    photo: "/team/vinicius.jpg",
    initials: "VO",
    name: "Vinícius Oliveira",
    gradient: "from-cyan-600 to-teal-400",
  },
];

export default function Equipe() {
  const headRef = useReveal();

  return (
    <section id="equipe" className="relative py-32 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(225,62,107,0.04),transparent)]" />
      <div className="max-w-7xl mx-auto relative">

        <div ref={headRef} className="reveal text-center mb-16">
          <span className="badge badge-brand mb-4">A equipe</span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            As pessoas que
            <br />
            <span className="gradient-text">constroem o futuro</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {members.map((m, i) => (
            <MemberCard key={i} member={m} delay={i * 120} />
          ))}
        </div>

      </div>
    </section>
  );
}

function MemberCard({ member: m, delay }: { member: typeof members[0]; delay: number }) {
  const ref = useReveal(delay);
  return (
    <div ref={ref} className="reveal group overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] hover:border-[#e13e6b]/30 hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1">
      {/* Photo — tall portrait */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        <img
          src={m.photo}
          alt={m.name}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            const fb = target.nextElementSibling as HTMLElement | null;
            if (fb) fb.style.display = "flex";
          }}
        />
        {/* Gradient fallback */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${m.gradient} items-center justify-center text-white font-bold text-4xl`}
          style={{ display: "none", fontFamily: "var(--font-heading)" }}
        >
          {m.initials}
        </div>
        {/* Bottom fade overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Name only */}
      <div className="px-5 py-4">
        <h3
          className="text-white font-semibold text-lg leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {m.name}
        </h3>
      </div>
    </div>
  );
}
