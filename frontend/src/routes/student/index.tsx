import { createFileRoute } from "@tanstack/react-router";
import { StudentDashboard } from "@/pages/student/Dashboard";

export const Route = createFileRoute("/student/")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — Pratibha Setu" },
      {
        name: "description",
        content: "Student competency mapping and recommended opportunities.",
      },
    ],
  }),
  component: StudentDashboard,
});
