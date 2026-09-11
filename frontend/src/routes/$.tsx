import { createFileRoute } from "@tanstack/react-router";
import { NotFoundPage } from "@/pages/public/NotFound";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Page not found — Pratibha Setu" },
      { name: "description", content: "This Pratibha Setu page could not be found." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotFoundPage,
});
