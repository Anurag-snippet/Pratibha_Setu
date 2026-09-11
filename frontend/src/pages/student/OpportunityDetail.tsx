import { useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { useApp } from "@/context/AuthContext";
import { DashboardShell, PageHeader } from "@/layouts/DashboardLayout";
import {
  Card,
  Button,
  Badge,
  SkillTag,
  MatchBadge,
  Modal,
  SectionHeading,
  EmptyState,
} from "@/components/ui-kit";
import { OpportunityCard } from "@/components/OpportunityCard";
import { opportunities } from "@/mockData/mockOpportunities";
import {
  MapPin,
  Clock,
  IndianRupee,
  Users,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Share2,
  Check,
} from "lucide-react";

export function StudentOpportunityDetail() {
  const params = useParams({ strict: false }) as { opportunityId?: string; id?: string };
  const opportunityId = params.opportunityId || params.id;
  const { applications, applyTo } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const opportunity = opportunities.find((o) => o.id === opportunityId);

  if (!opportunity) {
    return (
      <DashboardShell role="student">
        <EmptyState
          title="Opportunity not found"
          body="The opportunity you are looking for may have been closed or removed."
          action={
            <Link to="/student/opportunities">
              <Button>
                <ArrowLeft className="size-4" /> Back to Opportunities
              </Button>
            </Link>
          }
        />
      </DashboardShell>
    );
  }

  const isApplied = applications.some((a) => a.opportunityId === opportunity.id);

  const handleApply = () => {
    applyTo({ id: opportunity.id, title: opportunity.title, org: opportunity.org });
    setModalOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find similar opportunities (sharing at least one skill, not current one)
  const similarOpportunities = opportunities
    .filter(
      (o) =>
        o.id !== opportunity.id &&
        o.audience === "student" &&
        o.skills.some((s) => opportunity.skills.includes(s)),
    )
    .slice(0, 3);

  return (
    <DashboardShell role="student">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/student/opportunities"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Back to all opportunities
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-muted"
        >
          {copied ? <Check className="size-3 text-success" /> : <Share2 className="size-3" />}
          {copied ? "Link copied!" : "Share"}
        </button>
      </div>

      {/* Main Role Banner */}
      <Card className="border-primary/20 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary-soft text-xl font-bold text-primary">
              {opportunity.logo}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge tone="primary">{opportunity.type}</Badge>
                <Badge tone="neutral">{opportunity.mode}</Badge>
                <MatchBadge value={opportunity.match} />
              </div>
              <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{opportunity.title}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-base font-semibold text-muted-foreground">
                <Building2 className="size-4" /> {opportunity.org}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <Button
              size="lg"
              variant={isApplied ? "outline" : "primary"}
              disabled={isApplied}
              onClick={handleApply}
              className="w-full sm:w-auto"
            >
              {isApplied ? (
                <>
                  <CheckCircle2 className="size-4 text-success" /> Application Submitted
                </>
              ) : (
                "Apply with Profile"
              )}
            </Button>
            {isApplied ? (
              <Link
                to="/student/applications"
                className="text-center text-xs text-primary hover:underline"
              >
                Track status in My Applications →
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Location</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-bold">
              <MapPin className="size-3.5 text-primary" /> {opportunity.location}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Duration</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-bold">
              <Clock className="size-3.5 text-primary" /> {opportunity.duration}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Stipend / Support</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-bold">
              <IndianRupee className="size-3.5 text-primary" />
              {opportunity.stipend
                ? `₹${opportunity.stipend.toLocaleString("en-IN")}/mo`
                : "Funded / Free"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Application Deadline</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-bold">
              <Calendar className="size-3.5 text-primary" /> {opportunity.deadline}
            </p>
          </div>
        </div>
      </Card>

      {/* Role Details */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Description */}
          <Card className="p-6">
            <h2 className="text-lg font-bold">About the Role</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {opportunity.description}
            </p>

            <h3 className="mt-6 text-base font-bold">Key Responsibilities</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
              {opportunity.responsibilities?.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Required Skills & Diagnostic */}
          <Card className="p-6">
            <h2 className="text-lg font-bold">Required Competencies</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Matched automatically against your student assessment records.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {opportunity.skills.map((skill) => (
                <SkillTag key={skill} verified>
                  {skill}
                </SkillTag>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-bold">Application Overview</h3>
            <div className="mt-4 space-y-3 text-xs text-muted-foreground">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span>Total Candidates Applied</span>
                <span className="font-bold text-foreground">{opportunity.applicants}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span>Your Skill Match</span>
                <span className="font-bold text-success">{opportunity.match}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Eligibility</span>
                <span className="font-bold text-foreground">BAMS / MD Students</span>
              </div>
            </div>
            <Button
              variant={isApplied ? "outline" : "primary"}
              className="mt-6 w-full"
              disabled={isApplied}
              onClick={handleApply}
            >
              {isApplied ? "Application Submitted" : "Submit Application"}
            </Button>
          </Card>
        </div>
      </div>

      {/* Similar Opportunities */}
      {similarOpportunities.length > 0 ? (
        <div className="mt-12">
          <SectionHeading
            eyebrow="Related openings"
            title="Similar Opportunities"
            subtitle="Other postings looking for similar skillsets."
          />
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {similarOpportunities.map((op) => (
              <OpportunityCard key={op.id} op={op} />
            ))}
          </div>
        </div>
      ) : null}

      {/* Confirmation Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Application Submitted Successfully!"
        description={`Your verified competency profile has been submitted to ${opportunity.org}.`}
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Stay on page
            </Button>
            <Link to="/student/applications">
              <Button>
                View Applications <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        }
      >
        <div className="rounded-xl bg-success/10 p-4 text-sm text-success">
          <p className="font-semibold">
            ✓ Application reference: AP-{Date.now().toString().slice(-6)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            The employer will review your verified portfolio and skill benchmarks.
          </p>
        </div>
      </Modal>
    </DashboardShell>
  );
}
