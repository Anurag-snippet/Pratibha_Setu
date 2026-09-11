import { useApp } from "@/context/AuthContext";
import { DashboardShell, PageHeader } from "@/layouts/DashboardLayout";
import {
  StatCard,
  Card,
  SectionHeading,
  Button,
  Badge,
  statusTone,
  SkillTag,
} from "@/components/ui-kit";
import { industryFunnel } from "@/mockData/mockAnalytics";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  PlusCircle,
  Briefcase,
  Users,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ListChecks,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function IndustryDashboard() {
  const { user, postings, applicants } = useApp();

  // Compute stat card numbers
  const activePostings = postings.filter((p) => p.status === "Active").length;
  const totalPostings = postings.length;

  // Aggregate all applicants across all postings
  const allApplicantLists = Object.values(applicants).flat();
  const totalApplicants = allApplicantLists.length;
  const shortlisted = allApplicantLists.filter((a) => a.status === "Shortlisted").length;
  const selected = allApplicantLists.filter((a) => a.status === "Selected").length;

  const funnelColors = ["#059669", "#10b981", "#34d399", "#6ee7b7"];

  return (
    <DashboardShell role="industry">
      <PageHeader
        eyebrow="Industry Partner Portal"
        title={`Welcome, ${user?.name || "Himalaya Wellness"} 🏭`}
        subtitle="Manage talent recruitment pipelines, review verified competency scores and post openings."
        action={
          <Link to="/industry/post">
            <Button>
              <PlusCircle className="size-4" /> Post New Opportunity
            </Button>
          </Link>
        }
      />

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Postings"
          value={activePostings}
          hint={`${totalPostings} total created`}
          icon={<Briefcase className="size-5" />}
        />
        <StatCard
          label="Total Applicants"
          value={totalApplicants || 444}
          hint="Candidates applied"
          icon={<Users className="size-5 text-primary" />}
        />
        <StatCard
          label="Shortlisted for Interview"
          value={shortlisted || 96}
          hint="Under evaluation"
          icon={<TrendingUp className="size-5 text-info" />}
        />
        <StatCard
          label="Offers Extended"
          value={selected || 34}
          hint="Selected trainees"
          icon={<CheckCircle2 className="size-5 text-success" />}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Recruitment Funnel Chart */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold">Recruitment Funnel</h2>
                <p className="text-xs text-muted-foreground">
                  Candidate progression across application stages
                </p>
              </div>
              <Link
                to="/industry/applicants"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all candidates →
              </Link>
            </div>

            <div className="mt-6 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={industryFunnel}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="stage"
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" name="Candidates" radius={[0, 8, 8, 0]}>
                    {industryFunnel.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={funnelColors[index % funnelColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Quick Actions & Shortlist CTA */}
        <div className="space-y-4">
          <Card className="bg-primary-soft/40 p-6">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <PlusCircle className="size-5" />
            </span>
            <h3 className="mt-3 text-base font-bold">Hiring for New Batch?</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Define required skills (e.g. HPLC, Herbal Formulation) to instantly match with
              top-assessed students.
            </p>
            <Link to="/industry/post" className="mt-4 inline-block">
              <Button size="sm">Create Opportunity</Button>
            </Link>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-bold">Recruiter Shortcuts</h3>
            <div className="mt-3 space-y-2">
              <Link
                to="/industry/postings"
                className="flex items-center justify-between rounded-xl border border-border p-3 text-xs font-medium transition hover:bg-muted"
              >
                <span className="flex items-center gap-2">
                  <ListChecks className="size-4 text-primary" /> Manage Postings
                </span>
                <span className="font-bold text-primary">{postings.length}</span>
              </Link>
              <Link
                to="/industry/applicants"
                className="flex items-center justify-between rounded-xl border border-border p-3 text-xs font-medium transition hover:bg-muted"
              >
                <span className="flex items-center gap-2">
                  <Users className="size-4 text-primary" /> Review Applicants
                </span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Postings List */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <SectionHeading
            eyebrow="Active roles"
            title="Recent Postings"
            subtitle="Current opportunities posted on the portal by your organisation."
          />
          <Link to="/industry/postings">
            <Button variant="outline" size="sm">
              Manage All Postings <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {postings.slice(0, 3).map((p) => (
            <Card key={p.id} hover className="flex flex-col justify-between p-5">
              <div>
                <div className="flex items-center justify-between">
                  <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                  <span className="text-xs text-muted-foreground">Deadline: {p.deadline}</span>
                </div>
                <h3 className="mt-2 text-base font-bold">{p.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {p.location} · ₹{p.stipend.toLocaleString("en-IN")}/mo
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.skills.map((s) => (
                    <SkillTag key={s}>{s}</SkillTag>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-xs">
                <span className="font-semibold text-muted-foreground">
                  <strong>{p.applicants}</strong> applied ({p.shortlisted} shortlisted)
                </span>
                <Link to="/industry/applicants" className="font-bold text-primary hover:underline">
                  Review →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
