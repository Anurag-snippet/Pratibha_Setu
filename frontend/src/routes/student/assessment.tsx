import { createFileRoute } from "@tanstack/react-router";
import { StudentAssessment } from "@/pages/student/Assessment";

export const Route = createFileRoute("/student/assessment")({
  head: () => ({
    meta: [
      { title: "Skill Assessment — Pratibha Setu" },
      { name: "description", content: "Take the skill assessment and diagnostic." },
    ],
  }),
  component: StudentAssessment,
});
