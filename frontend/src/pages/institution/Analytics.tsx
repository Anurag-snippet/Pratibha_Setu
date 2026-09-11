import { useApp } from "@/context/AuthContext";
import { DashboardShell, PageHeader } from "@/layouts/DashboardLayout";
import {
  StatCard,
  Card,
  SectionHeading,
  Button,
  useMockLoad,
  TableSkeleton,
} from "@/components/ui-kit";
import {
  platformStats,
  skillDistribution,
  participationTrend,
  placementOutcomes,
} from "@/mockData/mockAnalytics";
import { Link } from "@tanstack/react-router";
import {
  Landmark,
  GraduationCap,
  Briefcase,
  Users,
  TrendingUp,
  Award,
  PieChart as PieIcon,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function InstitutionAnalytics() {
  const { user } = useApp();
  const loading = useMockLoad(500);

  const pieColors = ["#059669", "#0ea5e9", "#f59e0b", "#94a3b8"];

  return (
    <DashboardShell role="institution">
      <PageHeader
        eyebrow="Institution Administration"
        title={`Institutional Analytics — ${user?.name || "NIA Jaipur"} 🏛️`}
        subtitle="Ecosystem performance indicators, skill supply distributions, monthly participation trends and placement outcomes."
        action={
          <Link to="/institution/students">
            <Button>
              <Users className="size-4" /> Students Directory
            </Button>
          </Link>
        }
      />

      {/* Platform & Institution Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {platformStats.map((stat, i) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            hint="National Registry"
            icon={
              i === 0 ? (
                <Briefcase className="size-5" />
              ) : i === 1 ? (
                <GraduationCap className="size-5 text-success" />
              ) : i === 2 ? (
                <Landmark className="size-5 text-primary" />
              ) : (
                <Users className="size-5 text-info" />
              )
            }
          />
        ))}
      </div>

      {/* Analytics Charts Row 1: Skill Distribution & Placement Outcomes */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Skill Supply Distribution Bar Chart */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold">Student Skill Distribution</h2>
                <p className="text-xs text-muted-foreground">
                  Number of evaluated students across core domains
                </p>
              </div>
            </div>

            <div className="mt-6 h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={skillDistribution}
                  margin={{ top: 10, right: 20, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="skill"
                    angle={-20}
                    textAnchor="end"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="students"
                    name="Students Assessed"
                    fill="var(--color-primary, #059669)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Placement Outcomes Pie Chart */}
        <div>
          <Card className="flex h-full flex-col justify-between p-6">
            <div>
              <h2 className="text-base font-bold">Placement & Career Outcomes</h2>
              <p className="text-xs text-muted-foreground">Graduating cohort distribution</p>
            </div>

            <div className="my-auto h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={placementOutcomes}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {placementOutcomes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-border pt-4 text-xs">
              {placementOutcomes.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: pieColors[idx % pieColors.length] }}
                  />
                  <span className="truncate text-muted-foreground">{item.name}:</span>
                  <strong className="text-foreground">{item.value}</strong>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Analytics Charts Row 2: Participation Trends */}
      <div className="mt-8">
        <Card className="p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold">Internship & Workshop Participation Trend</h2>
              <p className="text-xs text-muted-foreground">
                Monthly student participation growth across partner industries
              </p>
            </div>
          </div>

          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={participationTrend}
                margin={{ top: 10, right: 30, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="internships"
                  name="Industry Internships"
                  stroke="var(--color-primary, #059669)"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="workshops"
                  name="Workshops / FDPs"
                  stroke="#0ea5e9"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
