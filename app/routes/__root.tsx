import { HeadContent, Outlet, Scripts, createRootRoute, useRouterState } from "@tanstack/react-router";
import "../styles/app.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#05161b" },
    ],
    links: [
      /* Marca oficial sobre o verde da marca. Em PNG porque ela ainda não
         existe em vetor; quando existir, volta a ser um .svg só. */
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/marca/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/marca/favicon-48.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/marca/favicon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?" +
          "family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&" +
          "family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = pathname.startsWith("/en") ? "en" : "pt-BR";

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
