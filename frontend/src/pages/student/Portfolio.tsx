import { useState } from "react";
import { useApp } from "@/context/AuthContext";
import { DashboardShell, PageHeader } from "@/layouts/DashboardLayout";
import {
  Card,
  Button,
  Avatar,
  ProgressBar,
  Badge,
  SkillTag,
  Modal,
  Field,
  inputClass,
  SectionHeading,
} from "@/components/ui-kit";
import {
  Award,
  BookOpen,
  Plus,
  Eye,
  CheckCircle2,
  Calendar,
  Building2,
  FileCheck,
  FolderGit2,
  Sparkles,
} from "lucide-react";

export function StudentPortfolio() {
  const { portfolio, addPortfolioItem } = useApp();

  const [previewRecruiter, setPreviewRecruiter] = useState(false);
  const [modalType, setModalType] = useState<"certifications" | "projects" | "achievements" | null>(
    null,
  );

  // Form states
  const [certForm, setCertForm] = useState({ name: "", issuer: "", year: "2026" });
  const [projForm, setProjForm] = useState({ name: "", summary: "", tags: "" });
  const [achieveForm, setAchieveForm] = useState({ text: "" });

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.name) return;
    addPortfolioItem("certifications", {
      id: `c-${Date.now()}`,
      name: certForm.name,
      issuer: certForm.issuer || "QCI",
      year: certForm.year,
    });
    setCertForm({ name: "", issuer: "", year: "2026" });
    setModalType(null);
  };

  const handleAddProj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projForm.name) return;
    addPortfolioItem("projects", {
      id: `p-${Date.now()}`,
      name: projForm.name,
      summary: projForm.summary,
      tags: projForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setProjForm({ name: "", summary: "", tags: "" });
    setModalType(null);
  };

  const handleAddAchieve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achieveForm.text) return;
    addPortfolioItem("achievements", achieveForm.text);
    setAchieveForm({ text: "" });
    setModalType(null);
  };

  return (
    <DashboardShell role="student">
      <PageHeader
        eyebrow="Competency Record"
        title="My Digital Portfolio"
        subtitle="Vetted clinical competencies, lab trials, publications and verified certifications."
        action={
          <Button
            variant={previewRecruiter ? "primary" : "outline"}
            onClick={() => setPreviewRecruiter((prev) => !prev)}
          >
            <Eye className="size-4" />
            {previewRecruiter ? "Exit Recruiter Preview" : "Preview as Recruiter"}
          </Button>
        }
      />

      {/* Profile Header Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar
              initials={portfolio.initials}
              className="size-16 text-lg sm:size-20 sm:text-2xl"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-extrabold sm:text-2xl">{portfolio.name}</h1>
                <Badge tone="success">
                  <CheckCircle2 className="size-3" /> Verified
                </Badge>
              </div>
              <p className="text-sm font-semibold text-primary">{portfolio.headline}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 className="size-3.5" /> {portfolio.institution}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-60">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Profile Strength</span>
              <span className="text-primary">{portfolio.profileCompletion}%</span>
            </div>
            <ProgressBar value={portfolio.profileCompletion} className="mt-1.5" />
            <p className="mt-2 text-[11px] text-muted-foreground">
              Add verified clinical certificates to reach 100%.
            </p>
          </div>
        </div>

        {portfolio.bio ? (
          <div className="mt-6 border-t border-border pt-4">
            <p className="text-xs font-bold text-muted-foreground uppercase">
              Biography / R&D Focus
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{portfolio.bio}</p>
          </div>
        ) : null}
      </Card>

      {/* Sections Grid */}
      <div className="mt-8 space-y-8">
        {/* Assessed Skills Matrix */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Assessed Skills & Competency Levels</h2>
              <p className="text-xs text-muted-foreground">
                Scores established through competency evaluations.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.skills?.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between rounded-xl border border-border p-3.5"
              >
                <div>
                  <span className="text-sm font-bold">{skill.name}</span>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Proficiency:</span>
                    <strong className="text-foreground">{skill.level}%</strong>
                  </div>
                </div>
                {skill.verified ? (
                  <Badge tone="primary">
                    <CheckCircle2 className="size-3" /> Assessed
                  </Badge>
                ) : (
                  <Badge tone="neutral">Self-reported</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Certifications */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Certifications & Accreditations</h2>
              <p className="text-xs text-muted-foreground">
                Verified training programmes from Ministry councils and QCI.
              </p>
            </div>
            {!previewRecruiter ? (
              <Button size="sm" variant="outline" onClick={() => setModalType("certifications")}>
                <Plus className="size-3.5" /> Add Certificate
              </Button>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.certifications?.map((c) => (
              <div key={c.id} className="rounded-xl border border-border p-4">
                <span className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary">
                  <Award className="size-4" />
                </span>
                <h3 className="mt-3 text-sm font-bold">{c.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Issuer: {c.issuer} · {c.year}
                </p>
                <div className="mt-3">
                  <Badge tone="success">
                    <CheckCircle2 className="size-3" /> Verified by Council
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Projects & Bench Trials */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Projects, Formulations & Clinical Studies</h2>
              <p className="text-xs text-muted-foreground">
                Research protocols, OPD trackers and bench-scale trials.
              </p>
            </div>
            {!previewRecruiter ? (
              <Button size="sm" variant="outline" onClick={() => setModalType("projects")}>
                <Plus className="size-3.5" /> Add Project
              </Button>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {portfolio.projects?.map((p) => (
              <div key={p.id} className="rounded-xl border border-border p-5">
                <h3 className="text-sm font-bold">{p.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags?.map((t) => (
                    <SkillTag key={t}>{t}</SkillTag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Honours & Extracurricular Achievements</h2>
              <p className="text-xs text-muted-foreground">
                Conclave awards, poster presentations and ideathon recognitions.
              </p>
            </div>
            {!previewRecruiter ? (
              <Button size="sm" variant="outline" onClick={() => setModalType("achievements")}>
                <Plus className="size-3.5" /> Add Achievement
              </Button>
            ) : null}
          </div>

          <ul className="mt-6 space-y-3">
            {portfolio.achievements?.map((achieve, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-border p-3.5 text-xs text-foreground"
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft text-primary font-bold">
                  ★
                </span>
                <span className="font-semibold">{achieve}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Add Certificate Modal */}
      <Modal
        open={modalType === "certifications"}
        onClose={() => setModalType(null)}
        title="Add Certification"
        description="Enter accreditation or specialized training details."
      >
        <form onSubmit={handleAddCert} className="space-y-4">
          <Field label="Certificate Title">
            <input
              className={inputClass}
              placeholder="e.g. Good Clinical Practice (GCP)"
              value={certForm.name}
              onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
              required
            />
          </Field>
          <Field label="Issuing Body">
            <input
              className={inputClass}
              placeholder="e.g. CCRAS / QCI / NIDA"
              value={certForm.issuer}
              onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
            />
          </Field>
          <Field label="Year">
            <input
              className={inputClass}
              placeholder="2026"
              value={certForm.year}
              onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setModalType(null)}>
              Cancel
            </Button>
            <Button type="submit">Save Certificate</Button>
          </div>
        </form>
      </Modal>

      {/* Add Project Modal */}
      <Modal
        open={modalType === "projects"}
        onClose={() => setModalType(null)}
        title="Add Project / Trial"
        description="Document bench-scale formulation experiments or clinical data projects."
      >
        <form onSubmit={handleAddProj} className="space-y-4">
          <Field label="Project Title">
            <input
              className={inputClass}
              placeholder="e.g. Stability profiling of a Triphala tablet"
              value={projForm.name}
              onChange={(e) => setProjForm({ ...projForm, name: e.target.value })}
              required
            />
          </Field>
          <Field label="Summary">
            <textarea
              className={`${inputClass} min-h-20`}
              placeholder="Describe objectives, methods and key outcomes..."
              value={projForm.summary}
              onChange={(e) => setProjForm({ ...projForm, summary: e.target.value })}
            />
          </Field>
          <Field label="Tags (comma separated)">
            <input
              className={inputClass}
              placeholder="Formulation, QC, HPLC"
              value={projForm.tags}
              onChange={(e) => setProjForm({ ...projForm, tags: e.target.value })}
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setModalType(null)}>
              Cancel
            </Button>
            <Button type="submit">Save Project</Button>
          </div>
        </form>
      </Modal>

      {/* Add Achievement Modal */}
      <Modal
        open={modalType === "achievements"}
        onClose={() => setModalType(null)}
        title="Add Honour / Achievement"
        description="Record competition wins, conclave presentations or poster awards."
      >
        <form onSubmit={handleAddAchieve} className="space-y-4">
          <Field label="Achievement Description">
            <input
              className={inputClass}
              placeholder="e.g. Winner — National Startup Ideathon 2026 (state round)"
              value={achieveForm.text}
              onChange={(e) => setAchieveForm({ ...achieveForm, text: e.target.value })}
              required
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setModalType(null)}>
              Cancel
            </Button>
            <Button type="submit">Save Achievement</Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
