import { createFileRoute } from "@tanstack/react-router";
import { InstitutionStudentsDirectory } from "@/pages/institution/StudentsDirectory";

export const Route = createFileRoute("/institution/students")({
  head: () => ({
    meta: [
      { title: "Institution Students Directory — Pratibha Setu" },
      { name: "description", content: "Institution students roster and placement outcomes." },
    ],
  }),
  component: InstitutionStudentsDirectory,
});
