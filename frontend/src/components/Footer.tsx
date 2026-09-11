import { Link } from "@tanstack/react-router";

const groups = [
  {
    title: "For students",
    links: [
      { label: "Browse opportunities", to: "/student/opportunities" },
      { label: "Skill assessment", to: "/student/assessment" },
      { label: "My portfolio", to: "/student/portfolio" },
      { label: "My applications", to: "/student/applications" },
    ],
  },
  {
    title: "For academia",
    links: [
      { label: "Faculty opportunities", to: "/academician/opportunities" },
      { label: "Student progress", to: "/academician/students" },
      { label: "Institution analytics", to: "/institution" },
      { label: "Students directory", to: "/institution/students" },
    ],
  },
  {
    title: "For industry",
    links: [
      { label: "Post an opportunity", to: "/industry/post" },
      { label: "Manage postings", to: "/industry/postings" },
      { label: "Applicants", to: "/industry/applicants" },
      { label: "Industry dashboard", to: "/industry" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "About Pratibha Setu", to: "/about" },
      { label: "Sign in", to: "/login" },
      { label: "About the portal", to: "/about" },
      { label: "Help & support", to: "/about" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block">
              <img
                src="/logo.png"
                alt="Pratibha Setu"
                className="h-11 w-auto max-w-[220px] object-contain"
              />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              An academia–industry collaboration portal for skill mapping, internships and placements.
            </p>
          </div>
          {groups.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-bold">{group.title}</p>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>© 2026 Pratibha Setu · Academia–Industry Collaboration Portal. All rights reserved.</p>
          <p>Privacy · Terms · Accessibility</p>
        </div>
      </div>
    </footer>
  );
}
