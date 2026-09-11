import { useApp } from "@/context/AuthContext";
import { DashboardShell, PageHeader } from "@/layouts/DashboardLayout";
import {
  StatCard,
  Card,
  SectionHeading,
  Button,
  Badge,
  statusTone,
  TableSkeleton,
  useMockLoad,
} from "@/components/ui-kit";
import { OpportunityCard } from "@/components/OpportunityCard";
import { facultyStats } from "@/mockData/mockAnalytics";
import { students } from "@/mockData/mockStudents";
import { opportunities } from "@/mockData/mockOpportunities";
import { Link } from "@tanstack/react-router";
import { Users, GraduationCap, Briefcase, Award, ArrowRight, UserCheck } from "lucide-react";

export function AcademicianDashboard() {
  const { user } = useApp();
  const loading = useMockLoad(500);

  // Faculty opportunities
  const facultyOps = opportunities.filter((op) => op.audience === "faculty").slice(0, 3);
  const recentStudents = students.slice(0, 5);

  return (
    <DashboardShell role="academician">
      <PageHeader
        eyebrow="Academician Portal"
        title={`Welcome, ${user?.name || "Dr. Venkatesan"} 🎓`}
        subtitle="Review cohort competency benchmarks, mentor placement candidates and browse faculty attachments."
        action={
          <Link to="/academician/students">
            <Button>
              <Users className="size-4" /> View Full Student Roster
            </Button>
          </Link>
        }
      />

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {facultyStats.map((stat, i) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            hint="Department cohort"
            icon={
              i === 0 ? (
                <Users className="size-5" />
              ) : i === 1 ? (
                <GraduationCap className="size-5 text-success" />
              ) : i === 2 ? (
                <Briefcase className="size-5 text-primary" />
              ) : (
                <Award className="size-5 text-info" />
              )
            }
          />
        ))}
      </div>

      {/* Quick Students Summary Table */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Mentees & Student Progress</h2>
            <p className="text-xs text-muted-foreground">
              Recent activity from students assigned to your department.
            </p>
          </div>
          <Link
            to="/academician/students"
            className="text-xs font-semibold text-primary hover:underline"
          >
            View all {students.length} students →
          </Link>
        </div>

        <Card className="mt-4 overflow-x-auto p-0">
          {loading ? (
            <div className="p-5">
              <TableSkeleton rows={4} />
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/50 text-[11px] font-bold text-muted-foreground uppercase">
                <tr>
                  <th className="px-5 py-3.5">Student Name</th>
                  <th className="px-4 py-3.5">Course / Year</th>
                  <th className="px-4 py-3.5">Skill Benchmark</th>
                  <th className="px-4 py-3.5">Top Assessed Skill</th>
                  <th className="px-4 py-3.5">Placement Status</th>
                  <th className="px-4 py-3.5">Assigned Org</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentStudents.map((st) => (
                  <tr key={st.id} className="transition hover:bg-muted/40">
                    <td className="px-5 py-3.5 font-bold">{st.name}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {st.course} ({st.year} Yr)
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-primary">{st.skillScore}%</span>
                    </td>
                    <td className="px-4 py-3.5 font-medium">{st.topSkill}</td>
                    <td className="px-4 py-3.5">
                      <Badge tone={statusTone(st.placement)}>{st.placement}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">{st.company}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      {/* Faculty Opportunities Section */}
      <div className="mt-10">
        <SectionHeading
          eyebrow="Professional development"
          title="Faculty Opportunities & Research Calls"
          subtitle="Ministry-supported FDPs, industrial attachments and collaborative research grants."
          action={
            <Link to="/academician/opportunities">
              <Button variant="outline" size="sm">
                View all faculty openings <ArrowRight className="size-4" />
              </Button>
            </Link>
          }
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {facultyOps.map((op) => (
            <OpportunityCard key={op.id} op={op} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
