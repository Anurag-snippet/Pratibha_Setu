import { createFileRoute } from "@tanstack/react-router";
import { AcademicianOpportunities } from "@/pages/academician/Opportunities";

export const Route = createFileRoute("/academician/opportunities/")({
  head: () => ({
    meta: [
      { title: "Faculty Opportunities — Pratibha Setu" },
      {
        name: "description",
        content: "Faculty development programmes, attachments and collaborative research calls.",
      },
    ],
  }),
  component: AcademicianOpportunities,
});
