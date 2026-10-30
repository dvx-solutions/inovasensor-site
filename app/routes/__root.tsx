import { useEffect, useRef } from "react";
import { HeadContent, Outlet, Scripts, createRootRoute, useRouterState } from "@tanstack/react-router";
import "../styles/app.css";

// Pixel da Meta "Inova Clínicas Site": mede os anúncios e alimenta o remarketing de quem visitou.
// O envio do formulário dispara o evento Lead (Avaliacao.tsx).
const PIXEL_META = "1758871598561210";
const PIXEL_SCRIPT = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_META}');fbq('track','PageView');`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#05161b" },
    ],
    links: [
      { rel: "icon", type: "image/webp", href: "/mentoria-assets/brand/logo-inova.webp" },
    ],
    scripts: [{ children: PIXEL_SCRIPT }],
  }),
  component: RootLayout,
});

function RootLayout() {
  const pathname = useRouterState({ select: (s: {location: {pathname: string}}) => s.location.pathname });
  const lang = pathname.startsWith("/en") ? "en" : "pt-BR";

  // O script já conta a primeira página; as trocas de rota do app contam aqui.
  const primeira = useRef(true);
  useEffect(() => {
    if (primeira.current) { primeira.current = false; return; }
    (window as Window & {fbq?: (...a: unknown[]) => void}).fbq?.("track", "PageView");
  }, [pathname]);

  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
