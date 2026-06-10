import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import "../styles/app.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "inovaSensor — Inteligência Artificial para Desafios Reais" },
      { name: "description", content: "inovaSensor desenvolve plataformas de IA que transformam dados complexos em decisões simples — monitoramento ambiental, gestão contábil e entretenimento." },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/logo.png" },
      { rel: "apple-touch-icon", href: "/logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body className="bg-[#020c1b] text-[#f8fafc] overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
