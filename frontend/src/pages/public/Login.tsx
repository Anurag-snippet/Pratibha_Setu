import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, BookOpen, Building2, Landmark, ShieldCheck, Loader2 } from "lucide-react";
import { Button, Card, Field, inputClass } from "@/components/ui-kit";
import { roleMeta, useApp, type Role } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const roles: { id: Role; label: string; icon: React.ElementType; blurb: string }[] = [
  {
    id: "student",
    label: "Student",
    icon: GraduationCap,
    blurb: "Assess skills, apply to internships, build a portfolio.",
  },
  {
    id: "academician",
    label: "Academician",
    icon: BookOpen,
    blurb: "Mentor students and access FDPs, training and research calls.",
  },
  {
    id: "industry",
    label: "Industry",
    icon: Building2,
    blurb: "Post openings and review matched applicants.",
  },
  {
    id: "institution",
    label: "Institution Admin",
    icon: Landmark,
    blurb: "Track skill distribution and placement outcomes.",
  },
];

export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const enter = (name?: string, token?: string, userData?: any) => {
    login(role, name, token, userData);
    navigate({ to: roleMeta[role].home });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: { name?: string; email?: string; password?: string; general?: string } = {};
    if (mode === "signup" && !form.name.trim()) next.name = "Please enter your full name";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6) next.password = "Use at least 6 characters";
    setErrors(next);

    if (Object.keys(next).length > 0) return;

    setIsLoading(true);
    try {
      const backendRole = role === "institution" ? "institution_admin" : role;
      if (mode === "signup") {
        const res = await api.auth.signup({
          name: form.name,
          email: form.email,
          password: form.password,
          role: backendRole,
        });
        if (res.data?.token) {
          enter(res.data.user.name, res.data.token, res.data.user);
        } else {
          enter(form.name);
        }
      } else {
        const res = await api.auth.login({
          email: form.email,
          password: form.password,
        });
        if (res.data?.token) {
          enter(res.data.user.name, res.data.token, res.data.user);
        } else {
          enter(form.name);
        }
      }
    } catch (err: any) {
      setErrors({ general: err.message || "Authentication failed. Please check your credentials." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hero-blob hidden flex-col justify-between border-r border-border p-12 lg:flex">
        <Link to="/" className="inline-block">
          <img
            src="/logo-transparent.png"
            alt="Pratibha Setu"
            className="h-16 w-auto max-w-[300px] object-contain"
          />
        </Link>
        <div className="max-w-md">
          <p className="eyebrow">Academia–industry portal</p>
          <h1 className="mt-3 text-4xl font-extrabold">
            One sign-in for students, faculty and industry
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Access unified skill assessments, internships, faculty development programs, and verified candidate placements.
          </p>
        </div>
        <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" /> Secure Collaboration Portal
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-block lg:hidden">
            <img
              src="/logo-transparent.png"
              alt="Pratibha Setu"
              className="h-12 w-auto max-w-[240px] object-contain"
            />
          </Link>

          <div className="flex rounded-full border border-border bg-card p-1">
            {(["signin", "signup"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setMode(option)}
                className={cn(
                  "flex-1 rounded-full py-2 text-sm font-semibold transition-colors",
                  mode === option ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                {option === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <p className="mt-8 text-sm font-semibold">I am signing in as</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {roles.map((option) => (
              <button
                key={option.id}
                onClick={() => setRole(option.id)}
                className={cn(
                  "rounded-xl border p-3 text-left transition-colors",
                  role === option.id
                    ? "border-primary bg-primary-soft"
                    : "border-border bg-card hover:bg-muted",
                )}
              >
                <span
                  className={cn(
                    "inline-flex items-center gap-2 text-sm font-bold",
                    role === option.id && "text-primary",
                  )}
                >
                  <option.icon className="size-4" /> {option.label}
                </span>
                <span className="mt-1 block text-xs leading-snug text-muted-foreground">
                  {option.blurb}
                </span>
              </button>
            ))}
          </div>

          <Card className="mt-6">
            <form onSubmit={submit} className="space-y-4" noValidate>
              {errors.general ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive font-medium">
                  {errors.general}
                </div>
              ) : null}
              {mode === "signup" ? (
                <Field label="Full name" error={errors.name}>
                  <input
                    className={inputClass}
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </Field>
              ) : null}
              <Field label="Email" error={errors.email}>
                <input
                  className={inputClass}
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Field>
              <Field label="Password" error={errors.password}>
                <input
                  className={inputClass}
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </Field>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    {mode === "signin" ? "Signing in..." : "Creating account..."}
                  </span>
                ) : mode === "signin" ? (
                  "Sign in"
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Pratibha Setu · Secure Role-Based Authentication
          </p>
        </div>
      </div>
    </div>
  );
}
