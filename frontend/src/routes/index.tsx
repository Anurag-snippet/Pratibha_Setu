import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/pages/public/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pratibha Setu — Find where your skills meet real opportunity" },
      {
        name: "description",
        content:
          "Skill mapping, internships and placements for students, academicians and industry, on one trusted portal.",
      },
      {
        property: "og:title",
        content: "Pratibha Setu — Find where your skills meet real opportunity",
      },
      {
        property: "og:description",
        content:
          "Assess your skills, discover matched internships and get placed with industry partners.",
      },
    ],
  }),
  component: LandingPage,
});
