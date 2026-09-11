import { createFileRoute } from "@tanstack/react-router";
import { StudentPortfolio } from "@/pages/student/Portfolio";

export const Route = createFileRoute("/student/portfolio")({
  head: () => ({
    meta: [
      { title: "My Portfolio — Pratibha Setu" },
      {
        name: "description",
        content: "Student verified competency profile, certificates and projects.",
      },
    ],
  }),
  component: StudentPortfolio,
});
