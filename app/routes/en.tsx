import { createFileRoute } from "@tanstack/react-router";
import Page from "~/components/Page";
import { copy } from "~/lib/copy";

export const Route = createFileRoute("/en")({
  head: () => ({
    meta: [
      { title: copy.en.meta.title },
      { name: "description", content: copy.en.meta.description },
      { property: "og:title", content: copy.en.meta.title },
      { property: "og:description", content: copy.en.meta.description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "alternate", hrefLang: "pt-BR", href: "/" },
      { rel: "alternate", hrefLang: "en", href: "/en" },
      { rel: "alternate", hrefLang: "x-default", href: "/" },
    ],
  }),
  component: () => <Page lang="en" />,
});
