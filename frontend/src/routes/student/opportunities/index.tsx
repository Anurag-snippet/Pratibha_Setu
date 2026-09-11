import { createFileRoute } from "@tanstack/react-router";
import { StudentOpportunities } from "@/pages/student/Opportunities";

export const Route = createFileRoute("/student/opportunities/")({
  head: () => ({
    meta: [
      { title: "Student Opportunities — Pratibha Setu" },
      { name: "description", content: "Explore internships, jobs and workshops." },
    ],
  }),
  component: StudentOpportunities,
});
