import { createFileRoute } from "@tanstack/react-router";
import { StudentOpportunityDetail } from "@/pages/student/OpportunityDetail";

export const Route = createFileRoute("/academician/opportunities/$opportunityId")({
  head: () => ({
    meta: [
      { title: "Faculty Opportunity Details — Pratibha Setu" },
      { name: "description", content: "Review faculty training and research call requirements." },
    ],
  }),
  component: StudentOpportunityDetail,
});
