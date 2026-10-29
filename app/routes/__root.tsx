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
      { rel: "icon", type: "image/webp", href: "/mentoria-assets/brand/logo-inova.webp" },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  const pathname = useRouterState({ select: (s: {location: {pathname: string}}) => s.location.pathname });
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
