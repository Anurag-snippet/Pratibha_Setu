import { createFileRoute } from "@tanstack/react-router";
import { InstitutionAnalytics } from "@/pages/institution/Analytics";

export const Route = createFileRoute("/institution/")({
  head: () => ({
    meta: [
      { title: "Institution Analytics — Pratibha Setu" },
      {
        name: "description",
        content: "National repository institutional analytics and placement trends.",
      },
    ],
  }),
  component: InstitutionAnalytics,
});
