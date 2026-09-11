import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useApp } from "@/context/AuthContext";
import { DashboardShell, PageHeader } from "@/layouts/DashboardLayout";
import {
  Card,
  Button,
  Badge,
  statusTone,
  EmptyState,
  useMockLoad,
  TableSkeleton,
} from "@/components/ui-kit";
import {
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Circle,
  FileText,
  ArrowRight,
} from "lucide-react";

export function StudentApplications() {
  const { applications } = useApp();
  const loading = useMockLoad(450);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <DashboardShell role="student">
      <PageHeader
        eyebrow="Application Tracking"
        title="My Applications"
        subtitle="Live status updates, recruiter screenings and interview timeline milestones."
      />

      {loading ? (
        <TableSkeleton rows={4} />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications submitted yet"
          body="Browse vetted internships and submit your verified skill profile with one click."
          action={
            <Link to="/student/opportunities">
              <Button>
                Explore Opportunities <ArrowRight className="size-4" />
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const isExpanded = expandedId === app.id;
            return (
              <Card key={app.id} className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold sm:text-lg">{app.title}</h2>
                      <Badge tone={statusTone(app.status)}>{app.status}</Badge>
                    </div>
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <Building2 className="size-3.5" /> {app.org} · Applied on {app.appliedOn}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/student/opportunities/$opportunityId"
                      params={{ opportunityId: app.opportunityId }}
                    >
                      <Button variant="outline" size="sm">
                        View Role
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(app.id)}
                      className="text-xs"
                    >
                      {isExpanded ? (
                        <>
                          Hide Timeline <ChevronUp className="size-3.5" />
                        </>
                      ) : (
                        <>
                          Track Timeline <ChevronDown className="size-3.5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expandable Timeline Stepper */}
                {isExpanded ? (
                  <div className="mt-6 border-t border-border pt-5">
                    <p className="mb-4 text-xs font-bold text-muted-foreground uppercase">
                      Hiring Stage Timeline
                    </p>
                    <div className="space-y-4">
                      {app.timeline?.map((step, idx) => {
                        return (
                          <div key={idx} className="flex items-start gap-3">
                            <span className="mt-0.5 grid size-5 shrink-0 place-items-center">
                              {step.done ? (
                                <CheckCircle2 className="size-4 text-success" />
                              ) : (
                                <Circle className="size-4 text-muted-foreground" />
                              )}
                            </span>
                            <div className="flex flex-1 items-baseline justify-between gap-4 text-xs">
                              <span
                                className={`font-semibold ${
                                  step.done ? "text-foreground" : "text-muted-foreground"
                                }`}
                              >
                                {step.label}
                              </span>
                              <span className="text-muted-foreground">{step.date}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
