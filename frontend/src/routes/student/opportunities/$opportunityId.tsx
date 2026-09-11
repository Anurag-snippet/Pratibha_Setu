import { createFileRoute } from "@tanstack/react-router";
import { StudentOpportunityDetail } from "@/pages/student/OpportunityDetail";

export const Route = createFileRoute("/student/opportunities/$opportunityId")({
  head: () => ({
    meta: [
      { title: "Opportunity Details — Pratibha Setu" },
      {
        name: "description",
        content: "Review requirements and apply with your verified competency profile.",
      },
    ],
  }),
  component: StudentOpportunityDetail,
});
