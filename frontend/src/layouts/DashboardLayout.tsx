import { useState, type ReactNode } from "react";
import { Link, Navigate, Outlet, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  LayoutDashboard,
  Briefcase,
  FileText,
  UserCircle,
  Sparkles,
  Users,
  PlusCircle,
  ListChecks,
  BarChart3,
  Menu,
  X,
  Repeat,
  LogOut,
  CheckCircle2,
  Search,
} from "lucide-react";
import { useApp, roleMeta, type Role } from "@/context/AuthContext";
import { notifications as mockNotifications } from "@/mockData/mockApplications";
import { Avatar, Badge, Button } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

const navByRole = {
  student: [
    { label: "Dashboard", to: "/student", icon: LayoutDashboard },
    { label: "Skill assessment", to: "/student/assessment", icon: Sparkles },
    { label: "Opportunities", to: "/student/opportunities", icon: Briefcase },
    { label: "My applications", to: "/student/applications", icon: FileText },
    { label: "My portfolio", to: "/student/portfolio", icon: UserCircle },
  ],
  academician: [
    { label: "Dashboard", to: "/academician", icon: LayoutDashboard },
    { label: "Faculty opportunities", to: "/academician/opportunities", icon: Briefcase },
    { label: "Student progress", to: "/academician/students", icon: Users },
  ],
  industry: [
    { label: "Dashboard", to: "/industry", icon: LayoutDashboard },
    { label: "Post opportunity", to: "/industry/post", icon: PlusCircle },
    { label: "Manage postings", to: "/industry/postings", icon: ListChecks },
    { label: "Applicants", to: "/industry/applicants", icon: Users },
  ],
  institution: [
    { label: "Analytics", to: "/institution", icon: BarChart3 },
    { label: "Students directory", to: "/institution/students", icon: Users },
  ],
} as const;

export function DashboardShell({ role, children }: { role: Role; children?: ReactNode }) {
  const { role: activeRole, user, logout } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notes, setNotes] = useState<typeof mockNotifications>(mockNotifications);

  if (!activeRole) return <Navigate to="/login" />;
  if (activeRole !== role) return <Navigate to={roleMeta[activeRole].home} />;

  const items = navByRole[role];
  const unread = notes.filter((n: { unread: boolean }) => n.unread).length;

  const sidebar = (
    <div className="flex h-full flex-col gap-6 border-r border-sidebar-border bg-sidebar px-4 py-5">
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/logo.png"
          alt="Pratibha Setu"
          className="h-10 w-auto max-w-[200px] object-contain"
        />
      </Link>

      <nav className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            activeOptions={{ exact: item.to === roleMeta[role].home }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            activeProps={{ className: "bg-sidebar-accent text-primary font-semibold" }}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-2 border-t border-sidebar-border pt-4">
        <p className="px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Demo controls
        </p>
        <button
          onClick={() => navigate({ to: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-muted"
        >
          <Repeat className="size-4" /> Switch role
        </button>
        <button
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{sidebar}</aside>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72">{sidebar}</div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
          <button
            className="rounded-lg p-2 hover:bg-muted lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <div className="hidden max-w-sm flex-1 items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 sm:flex">
            <Search className="size-4 text-muted-foreground" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search opportunities, students, skills"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Badge tone="primary" className="hidden sm:inline-flex">
              {roleMeta[role].label} view
            </Badge>

            <div className="relative">
              <button
                onClick={() => setBellOpen((v) => !v)}
                className="relative rounded-full p-2 hover:bg-muted"
                aria-label="Notifications"
              >
                <Bell className="size-5" />
                {unread > 0 ? (
                  <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {unread}
                  </span>
                ) : null}
              </button>
              {bellOpen ? (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-popover p-2 shadow-hover">
                  <div className="flex items-center justify-between px-2 py-1">
                    <p className="text-sm font-bold">Notifications</p>
                    <button
                      className="text-xs font-semibold text-primary hover:underline"
                      onClick={() => setNotes((prev) => prev.map((n) => ({ ...n, unread: false })))}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 space-y-1 overflow-y-auto">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className={cn(
                          "rounded-xl p-3",
                          note.unread ? "bg-primary-soft/60" : "hover:bg-muted",
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold">{note.title}</p>
                          <span className="text-[11px] text-muted-foreground">{note.time}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{note.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pr-3 pl-1">
              <Avatar initials={user?.initials ?? "PS"} className="size-8 text-xs" />
              <span className="hidden text-sm font-semibold sm:block">{user?.name}</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-1.5 text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function SuccessNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-success/10 p-4 text-sm text-success">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export { Button };
