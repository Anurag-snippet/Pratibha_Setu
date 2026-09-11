import { createFileRoute } from "@tanstack/react-router";
import { StudentApplications } from "@/pages/student/Applications";

export const Route = createFileRoute("/student/applications")({
  head: () => ({
    meta: [
      { title: "My Applications — Pratibha Setu" },
      {
        name: "description",
        content: "Track application statuses, screening and interview timeline.",
      },
    ],
  }),
  component: StudentApplications,
});
