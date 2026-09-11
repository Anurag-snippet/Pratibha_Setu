import { createFileRoute } from "@tanstack/react-router";
import { AcademicianDashboard } from "@/pages/academician/Dashboard";

export const Route = createFileRoute("/academician/")({
  head: () => ({
    meta: [
      { title: "Academician Dashboard — Pratibha Setu" },
      {
        name: "description",
        content: "Academic cohort monitoring, mentee tracking and faculty attachments.",
      },
    ],
  }),
  component: AcademicianDashboard,
});
