import { createFileRoute } from "@tanstack/react-router";
import { IndustryApplicants } from "@/pages/industry/Applicants";

export const Route = createFileRoute("/industry/applicants")({
  head: () => ({
    meta: [
      { title: "Review Applicants — Pratibha Setu" },
      {
        name: "description",
        content: "Screen candidates, evaluate verified scores and manage stages.",
      },
    ],
  }),
  component: IndustryApplicants,
});
