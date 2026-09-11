import Nav from "~/components/Nav";
import Hero from "~/components/Hero";
import Intervalo from "~/components/Intervalo";
import Nuvens from "~/components/Nuvens";
import Sensoriamento from "~/components/Sensoriamento";
import Painel from "~/components/Painel";
import Operacao from "~/components/Operacao";
import Ana from "~/components/Ana";
import Prova from "~/components/Prova";
import Time from "~/components/Time";
import Avaliacao from "~/components/Avaliacao";
import Rodape from "~/components/Rodape";
import { useSiteMotion } from "~/lib/motion";
import { copy, type Lang } from "~/lib/copy";

/**
 * A página do AlgEye — onze blocos, uma única conversão.
 * A ordem é o argumento: dor, fosso, mecanismo, produto, operação,
 * regulação, prova, time, pedido.
 */
export default function Page({ lang }: { lang: Lang }) {
  const t = copy[lang];
  useSiteMotion();

  return (
    <>
      <Nav t={t} lang={lang} />
      <main id="conteudo">
        <Hero t={t} />
        <Intervalo t={t} />
        <Nuvens t={t} />
        <Sensoriamento t={t} />
        <Painel t={t} />
        <Operacao t={t} />
        <Ana t={t} />
        <Prova t={t} />
        <Time t={t} />
        <Avaliacao t={t} lang={lang} />
      </main>
      <Rodape t={t} lang={lang} />
    </>
  );
}
