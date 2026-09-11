import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  GraduationCap,
  Building2,
  Menu,
  X,
  Sparkles,
  ClipboardList,
  Users,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

type MenuItem = { label: string; desc: string; to: string; icon: React.ElementType };

const menus: { id: string; label: string; items: MenuItem[] }[] = [
  {
    id: "opportunities",
    label: "Opportunities",
    items: [
      {
        label: "Internships",
        desc: "Paid industry internships across wellness and research units",
        to: "/student/opportunities",
        icon: Briefcase,
      },
      {
        label: "Jobs",
        desc: "Full-time roles in research, QC and wellness",
        to: "/student/opportunities",
        icon: ClipboardList,
      },
      {
        label: "Workshops & FDPs",
        desc: "Short programmes for students and faculty",
        to: "/academician/opportunities",
        icon: BookOpen,
      },
    ],
  },
  {
    id: "skills",
    label: "Skills",
    items: [
      {
        label: "Skill assessment",
        desc: "15-question profile with instant gap analysis",
        to: "/student/assessment",
        icon: Sparkles,
      },
      {
        label: "Portfolio builder",
        desc: "Verified skills, certifications and projects",
        to: "/student/portfolio",
        icon: GraduationCap,
      },
    ],
  },
  {
    id: "partners",
    label: "For partners",
    items: [
      {
        label: "Post an opportunity",
        desc: "Reach matched talent in minutes",
        to: "/industry/post",
        icon: Building2,
      },
      {
        label: "Track your students",
        desc: "Faculty view of skill growth and placements",
        to: "/academician/students",
        icon: Users,
      },
      {
        label: "Institution analytics",
        desc: "Placement and participation dashboards",
        to: "/institution",
        icon: BarChart3,
      },
    ],
  },
];

export function Navbar() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 py-2">
          <img
            src="/logo-transparent.png"
            alt="Pratibha Setu"
            className="h-13 w-auto max-w-[260px] object-contain sm:h-15 sm:max-w-[320px]"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="relative"
              onMouseEnter={() => setOpen(menu.id)}
              onMouseLeave={() => setOpen(null)}
            >
              <button
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  open === menu.id ? "bg-primary-soft text-primary" : "hover:bg-muted",
                )}
              >
                {menu.label}
              </button>
              {open === menu.id ? (
                <div className="absolute top-full left-0 w-[26rem] pt-2">
                  <div className="rounded-2xl border border-border bg-popover p-2 shadow-hover">
                    {menu.items.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-muted"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                          <item.icon className="size-4" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold">{item.label}</span>
                          <span className="block text-xs text-muted-foreground">{item.desc}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
          <Link
            to="/about"
            className="rounded-full px-4 py-2 text-sm font-semibold hover:bg-muted"
            activeProps={{ className: "bg-primary-soft text-primary" }}
          >
            About
          </Link>
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/login">
            <Button size="sm">Get started</Button>
          </Link>
        </div>

        <button
          className="ml-auto rounded-lg p-2 hover:bg-muted lg:hidden"
          onClick={() => setMobile((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobile ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobile ? (
        <div className="border-t border-border bg-background px-4 pb-6 lg:hidden">
          {menus.map((menu) => (
            <div key={menu.id} className="py-3">
              <p className="eyebrow">{menu.label}</p>
              <div className="mt-2 space-y-1">
                {menu.items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMobile(false)}
                    className="block rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link to="/about" onClick={() => setMobile(false)} className="block py-2 font-semibold">
            About
          </Link>
          <Link to="/login" onClick={() => setMobile(false)} className="mt-3 block">
            <Button className="w-full">Sign in</Button>
          </Link>
        </div>
      ) : null}
    </header>
  );
}
