import { createFileRoute } from "@tanstack/react-router";
import { IndustryPostOpportunity } from "@/pages/industry/PostOpportunity";

export const Route = createFileRoute("/industry/post")({
  head: () => ({
    meta: [
      { title: "Post Opportunity — Pratibha Setu" },
      {
        name: "description",
        content: "Create and publish a new internship, job or workshop.",
      },
    ],
  }),
  component: IndustryPostOpportunity,
});
