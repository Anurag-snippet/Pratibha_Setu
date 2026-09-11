import { useState } from "react";
import { useApp } from "@/context/AuthContext";
import { DashboardShell, PageHeader } from "@/layouts/DashboardLayout";
import { Card, Button, Badge, MatchBadge, SkillTag, Avatar, EmptyState } from "@/components/ui-kit";
import { applicationStatuses } from "@/mockData/mockApplications";
import { Building2, MessageSquare, CheckCircle2, ChevronRight } from "lucide-react";

export function IndustryApplicants() {
  const { postings, applicants, updateApplicant } = useApp();

  const [selectedPostingId, setSelectedPostingId] = useState<string>(postings[0]?.id || "ip-1");

  const selectedPosting = postings.find((p) => p.id === selectedPostingId);
  const applicantList = applicants[selectedPostingId] || [];

  const handleStatusChange = (applicantId: string, nextStatus: string) => {
    updateApplicant(selectedPostingId, applicantId, { status: nextStatus });
  };

  const handleFeedbackChange = (applicantId: string, feedbackText: string) => {
    updateApplicant(selectedPostingId, applicantId, { feedback: feedbackText });
  };

  return (
    <DashboardShell role="industry">
      <PageHeader
        eyebrow="Applicant Tracking System"
        title="Candidate Screening & Shortlisting"
        subtitle="Review verified skill match scores, institution credentials and update applicant hiring status."
      />

      {/* Posting Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {postings.map((p) => {
          const isSelected = p.id === selectedPostingId;
          const count = applicants[p.id]?.length || 0;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPostingId(p.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              <span>{p.title}</span>
              <span
                className={`grid size-5 place-items-center rounded-full text-[10px] font-bold ${
                  isSelected
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Applicant List */}
      <div className="mt-6">
        {selectedPosting ? (
          <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Reviewing applicants for:{" "}
              <strong className="text-foreground">{selectedPosting.title}</strong>
            </span>
            <span>{applicantList.length} candidate profiles available</span>
          </div>
        ) : null}

        {applicantList.length === 0 ? (
          <EmptyState
            title="No applicants for this role yet"
            body="Applications will appear here as students discover and apply with their verified student profiles."
          />
        ) : (
          <div className="space-y-4">
            {applicantList.map((app) => (
              <Card key={app.id} className="p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* Candidate Info */}
                  <div className="flex items-start gap-4">
                    <Avatar initials={app.initials} className="size-12 text-sm" />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-base font-bold">{app.name}</h3>
                        <MatchBadge value={app.match} />
                      </div>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="size-3.5" /> {app.institution}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {app.topSkills?.map((skill: string) => (
                          <SkillTag key={skill} verified>
                            {skill}
                          </SkillTag>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recruiter Evaluation Controls */}
                  <div className="flex flex-col gap-3 sm:w-80">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">Stage:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        aria-label="Application Stage"
                        className="rounded-lg border border-input bg-card px-3 py-1.5 text-xs font-bold focus:border-primary"
                      >
                        {applicationStatuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                        Mentor / Recruiter Note:
                      </span>
                      <input
                        className="w-full rounded-lg border border-input bg-card px-3 py-1.5 text-xs outline-none focus:border-primary"
                        placeholder="Add candidate note (e.g. schedule technical round)..."
                        value={app.feedback || ""}
                        onChange={(e) => handleFeedbackChange(app.id, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
