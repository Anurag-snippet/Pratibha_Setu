import { createFileRoute } from "@tanstack/react-router";
import { AcademicianStudentProgress } from "@/pages/academician/StudentProgress";

export const Route = createFileRoute("/academician/students")({
  head: () => ({
    meta: [
      { title: "Student Progress Directory — Pratibha Setu" },
      {
        name: "description",
        content: "Student mentee progress, skills and placements directory.",
      },
    ],
  }),
  component: AcademicianStudentProgress,
});
