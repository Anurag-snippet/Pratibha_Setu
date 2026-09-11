import { createFileRoute } from "@tanstack/react-router";
import { IndustryDashboard } from "@/pages/industry/Dashboard";

export const Route = createFileRoute("/industry/")({
  head: () => ({
    meta: [
      { title: "Industry Dashboard — Pratibha Setu" },
      {
        name: "description",
        content: "Industry talent acquisition, recruitment funnel and candidate pipeline.",
      },
    ],
  }),
  component: IndustryDashboard,
});
