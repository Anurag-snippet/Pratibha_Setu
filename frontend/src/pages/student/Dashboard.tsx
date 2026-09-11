import { useApp } from "@/context/AuthContext";
import { DashboardShell, PageHeader } from "@/layouts/DashboardLayout";
import {
  StatCard,
  Card,
  SectionHeading,
  Button,
  useMockLoad,
  CardsSkeleton,
  TableSkeleton,
  EmptyState,
} from "@/components/ui-kit";
import { OpportunityCard } from "@/components/OpportunityCard";
import { opportunities } from "@/mockData/mockOpportunities";
import { skillRadar } from "@/mockData/mockSkills";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Briefcase,
  FileText,
  UserCircle,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export function StudentDashboard() {
  const { user, applications, skillScores } = useApp();
  const loading = useMockLoad(500);

  // Application counts
  const totalApps = applications.length;
  const shortlisted = applications.filter((a) => a.status === "Shortlisted").length;
  const selected = applications.filter((a) => a.status === "Selected").length;
  const applied = applications.filter((a) => a.status === "Applied").length;

  // Chart data: use student's assessed skill scores if available, else benchmark/default
  const radarData = skillRadar.map((item) => {
    const assessed = skillScores?.find((s) => s.skill.toLowerCase() === item.skill.toLowerCase());
    return {
      skill: item.skill,
      score: assessed ? assessed.score : item.score,
      benchmark: item.benchmark,
    };
  });

  // Recommended opportunities sorted by match desc
  const recommended = opportunities
    .filter((op) => op.audience === "student")
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);

  return (
    <DashboardShell role="student">
      <PageHeader
        eyebrow="Student Portal"
        title={`Namaste, ${user?.name || "Student"} 👋`}
        subtitle="Track your skill progress, check recommended internships and manage applications."
        action={
          <Link to="/student/assessment">
            <Button>
              <Sparkles className="size-4" /> Take skill assessment
            </Button>
          </Link>
        }
      />

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Applications"
          value={totalApps}
          hint="Submitted on portal"
          icon={<FileText className="size-5" />}
        />
        <StatCard
          label="Under Review"
          value={applied}
          hint="Awaiting screening"
          icon={<Clock className="size-5 text-warning-foreground" />}
        />
        <StatCard
          label="Shortlisted"
          value={shortlisted}
          hint="Interview rounds"
          icon={<TrendingUp className="size-5 text-info" />}
        />
        <StatCard
          label="Offers / Selected"
          value={selected}
          hint="Industry placements"
          icon={<CheckCircle2 className="size-5 text-success" />}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Radar Chart */}
        <div className="lg:col-span-2">
          <Card className="flex h-full flex-col">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">Competency Profile</h2>
                <p className="text-xs text-muted-foreground">
                  Your skill score vs. industry hiring benchmark
                </p>
              </div>
              <Link
                to="/student/assessment"
                className="text-xs font-semibold text-primary hover:underline"
              >
                {skillScores ? "Retake assessment" : "Take full assessment →"}
              </Link>
            </div>

            {loading ? (
              <div className="flex h-72 items-center justify-center">
                <TableSkeleton rows={4} />
              </div>
            ) : (
              <div className="mt-4 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                    />
                    <Radar
                      name="Your Score"
                      dataKey="score"
                      stroke="var(--color-primary, #059669)"
                      fill="var(--color-primary, #059669)"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name="Industry Benchmark"
                      dataKey="benchmark"
                      stroke="#94a3b8"
                      fill="#94a3b8"
                      fillOpacity={0.15}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="mt-auto flex items-center justify-center gap-6 border-t border-border pt-4 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-primary" /> Your assessed score
              </span>
              <span className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-muted-foreground/40" /> Industry benchmark
              </span>
            </div>
          </Card>
        </div>

        {/* Quick actions & Profile status */}
        <div className="space-y-4">
          <Card className="bg-primary-soft/40 p-6">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Award className="size-5" />
            </span>
            <h3 className="mt-3 text-base font-bold">Complete your Digital Portfolio</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Verified clinical certifications and project records boost your match score by up to
              25%.
            </p>
            <Link to="/student/portfolio" className="mt-4 inline-block">
              <Button size="sm" variant="primary">
                Update Portfolio <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </Card>

          <Card className="space-y-3 p-5">
            <h3 className="text-sm font-bold">Quick Navigation</h3>
            <div className="space-y-2">
              <Link
                to="/student/opportunities"
                className="flex items-center justify-between rounded-xl border border-border p-3 text-sm font-medium transition hover:bg-muted"
              >
                <span className="flex items-center gap-2.5">
                  <Briefcase className="size-4 text-primary" /> Explore Opportunities
                </span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
              <Link
                to="/student/applications"
                className="flex items-center justify-between rounded-xl border border-border p-3 text-sm font-medium transition hover:bg-muted"
              >
                <span className="flex items-center gap-2.5">
                  <FileText className="size-4 text-primary" /> My Applications
                </span>
                <span className="text-xs font-bold text-primary">{applications.length}</span>
              </Link>
              <Link
                to="/student/portfolio"
                className="flex items-center justify-between rounded-xl border border-border p-3 text-sm font-medium transition hover:bg-muted"
              >
                <span className="flex items-center gap-2.5">
                  <UserCircle className="size-4 text-primary" /> CV & Credentials
                </span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Recommended Opportunities */}
      <div className="mt-10">
        <SectionHeading
          eyebrow="Tailored matching"
          title="Recommended for you"
          subtitle="Opportunities aligned with your assessed competency profile."
          action={
            <Link to="/student/opportunities">
              <Button variant="outline" size="sm">
                View all opportunities <ArrowRight className="size-4" />
              </Button>
            </Link>
          }
        />

        <div className="mt-6">
          {loading ? (
            <CardsSkeleton count={3} />
          ) : recommended.length === 0 ? (
            <EmptyState
              title="No recommendations yet"
              body="Take the skill assessment to get personalized opportunity recommendations."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommended.map((op) => (
                <OpportunityCard key={op.id} op={op} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
