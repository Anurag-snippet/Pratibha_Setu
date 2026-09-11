import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/pages/public/About";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Pratibha Setu — Closing the academia–industry gap" },
      {
        name: "description",
        content:
          "Why Pratibha Setu exists: shared skill language, one opportunity feed and live placement analytics for the entire ecosystem.",
      },
      { property: "og:title", content: "About Pratibha Setu" },
      {
        property: "og:description",
        content: "A government initiative bridging traditional medicine education and industry.",
      },
    ],
  }),
  component: AboutPage,
});
