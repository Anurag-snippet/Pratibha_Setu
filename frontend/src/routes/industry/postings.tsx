import { createFileRoute } from "@tanstack/react-router";
import { IndustryManagePostings } from "@/pages/industry/ManagePostings";

export const Route = createFileRoute("/industry/postings")({
  head: () => ({
    meta: [
      { title: "Manage Postings — Pratibha Setu" },
      { name: "description", content: "Review and manage published opportunities." },
    ],
  }),
  component: IndustryManagePostings,
});
