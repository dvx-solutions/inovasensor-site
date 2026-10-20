import { programFaqs, programIncludes, readiness } from "./data";
import ProgramJourney from '../../motion/ProgramJourney';
import "./programa.css";

type ProgramaProps = {
  onApply: () => void;
};

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4.5 12h14M12.5 5.5 19 12l-6.5 6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Programa({ onApply }: ProgramaProps) {
  return (
    <section className="sec sec--programa" id="programa" aria-labelledby="programa-title">
      <div className="programa-journey">
        <div className="wrap">
          <header className="programa-heading">
            <div>
              <p className="eyebrow">O programa · acompanhamento individual</p>
              <h2 className="section-title" id="programa-title">
                Seis meses de aplicação.<br />
                <span>Uma nova rotina de trabalho.</span>
              </h2>
            </div>
            <p className="programa-intro">
              Seis meses para sair da intenção, aplicar IA em um processo prioritário
              e acompanhar a mudança na rotina.
            </p>
          </header>

          <ProgramJourney />

          <div className="programa-investment" aria-labelledby="programa-investment-title">
            <div className="programa-investment-copy">
              <p className="eyebrow">Mentoria IA · InovaSensor</p>
              <h3 id="programa-investment-title">
                Estrutura para implementar.<br /><span>Acompanhamento para evoluir.</span>
              </h3>
              <div className="programa-includes">
                {programIncludes.map((item) => (
                  <div className="programa-include" key={item.title}>
                    <span className="programa-check" aria-hidden="true">✓</span>
                    <div><strong>{item.title}</strong><p>{item.text}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="programa-proposal">
              <p className="eyebrow">Uma decisão com contexto</p>
              <h3>O primeiro passo é entender sua empresa.</h3>
              <ol className="programa-proposal-steps">
                <li><span>01</span><div><strong>Avaliação inicial</strong><p>Compartilhe a realidade da equipe e o processo que precisa melhorar.</p></div></li>
                <li><span>02</span><div><strong>Conversa de diagnóstico</strong><p>Aprofundamos a prioridade e avaliamos a aplicação da mentoria.</p></div></li>
                <li><span>03</span><div><strong>Proposta para sua operação</strong><p>Você avalia o escopo, as responsabilidades e as condições antes de decidir.</p></div></li>
              </ol>
              <button type="button" className="button button--primary" data-cta="avaliacao" onClick={onApply}>
                Avaliar minha empresa <Arrow />
              </button>
              <p className="programa-proposal-reassurance">
                Avaliação gratuita. Sem contratação automática.
              </p>
              <p className="programa-license-note">
                Inclui 1 licença S360 OS Max. Licenças adicionais da equipe são contratadas à parte.
              </p>
            </div>
          </div>

          <p className="programa-scope-note">
            O diagnóstico define o processo, as entregas e as integrações.
            Novas frentes ou desenvolvimento sob medida precisam de escopo próprio.
          </p>
        </div>
      </div>

      <div className="programa-readiness" aria-labelledby="programa-ready-title">
        <div className="wrap">
          <div className="programa-readiness-header">
            <p className="eyebrow">O momento certo</p>
            <h2 className="section-title" id="programa-ready-title">
              Não precisa dominar IA.<br />Precisa estar pronto para aplicar.
            </h2>
          </div>
          <div className="programa-readiness-list">
            {readiness.map((item) => (
              <article className="programa-readiness-item" key={item.number}>
                <span className="programa-readiness-number" aria-hidden="true">{item.number}</span>
                <div><h3>{item.title}</h3><p>{item.text}</p></div>
              </article>
            ))}
          </div>
          <div className="programa-readiness-foot">
            <p>A avaliação considera seu contexto, não apenas o tamanho da empresa ou o faturamento.</p>
            <button type="button" className="programa-text-cta" data-cta="avaliacao" onClick={onApply}>
              Entender se faz sentido para mim <Arrow />
            </button>
          </div>
        </div>
      </div>

      <div className="programa-faq" id="duvidas" aria-labelledby="programa-faq-title">
        <div className="wrap programa-faq-layout">
          <header>
            <p className="eyebrow">Antes de dar o próximo passo</p>
            <h2 className="section-title" id="programa-faq-title">Boas perguntas.<br />Respostas diretas.</h2>
            <p>Uma decisão sobre sua operação merece clareza desde o início.</p>
          </header>
          <div className="programa-faq-list">
            {programFaqs.map((faq, index) => (
              <details className="programa-faq-item" key={faq.question}>
                <summary>
                  <span className="programa-faq-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span>{faq.question}</span>
                  <span className="programa-faq-toggle" aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
