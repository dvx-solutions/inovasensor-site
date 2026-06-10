import { createFileRoute } from "@tanstack/react-router";
import Navbar from "~/components/Navbar";
import Hero from "~/components/Hero";
import Sobre from "~/components/Sobre";
import Produtos from "~/components/Produtos";
import Equipe from "~/components/Equipe";
import Contato from "~/components/Contato";
import Footer from "~/components/Footer";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Sobre />
      <Produtos />
      <Equipe />
      <Contato />
      <Footer />
    </main>
  );
}
