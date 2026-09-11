import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/pages/public/Login";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in to Pratibha Setu — Student, faculty or industry" },
      {
        name: "description",
        content:
          "Sign in or create an account as a student, academician, industry partner or institution admin.",
      },
      { property: "og:title", content: "Sign in to Pratibha Setu" },
      {
        property: "og:description",
        content: "Choose your role and enter the Pratibha Setu dashboards.",
      },
    ],
  }),
  component: LoginPage,
});
