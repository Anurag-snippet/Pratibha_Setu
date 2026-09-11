import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useApp } from "@/context/AuthContext";
import { DashboardShell, PageHeader, SuccessNote } from "@/layouts/DashboardLayout";
import { Card, Button, Field, inputClass, SkillTag } from "@/components/ui-kit";
import { opportunityTypes, locations } from "@/mockData/mockOpportunities";
import { skillCatalog } from "@/mockData/mockSkills";
import { PlusCircle, Sparkles, Check, ArrowRight } from "lucide-react";

export function IndustryPostOpportunity() {
  const { addPosting } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    type: "Internship",
    description: "",
    location: "Bengaluru, KA",
    stipend: 25000,
    deadline: "2026-10-31",
    duration: "6 months",
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Herbal Formulation",
    "Quality Control & GMP",
  ]);

  const [submitted, setSubmitted] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    addPosting({
      title: form.title,
      type: form.type,
      location: form.location,
      stipend: Number(form.stipend) || 0,
      deadline: form.deadline,
      skills: selectedSkills,
    });

    setSubmitted(true);
    setTimeout(() => {
      navigate({ to: "/industry/postings" });
    }, 1800);
  };

  return (
    <DashboardShell role="industry">
      <PageHeader
        eyebrow="Talent Acquisition"
        title="Post New Opportunity"
        subtitle="Specify role requirements, stipend, locations and required competencies to instantly match with vetted candidates."
      />

      {submitted ? (
        <div className="mx-auto max-w-2xl space-y-4">
          <SuccessNote>
            Opportunity "{form.title}" posted successfully! Redirecting you to your postings list...
          </SuccessNote>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl">
          <Card className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <Field label="Opportunity Title">
                <input
                  className={inputClass}
                  placeholder="e.g. Quality Control Analyst Trainee — GMP Unit"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </Field>

              {/* Type and Duration */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Opportunity Type">
                  <select
                    className={inputClass}
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    {opportunityTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Duration">
                  <input
                    className={inputClass}
                    placeholder="e.g. 6 months / Full-time"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  />
                </Field>
              </div>

              {/* Location and Stipend */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Location">
                  <select
                    className={inputClass}
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Monthly Stipend (₹)">
                  <input
                    type="number"
                    className={inputClass}
                    placeholder="25000"
                    value={form.stipend}
                    onChange={(e) => setForm({ ...form, stipend: Number(e.target.value) })}
                  />
                </Field>
              </div>

              {/* Deadline */}
              <Field label="Application Deadline">
                <input
                  type="date"
                  className={inputClass}
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  required
                />
              </Field>

              {/* Description */}
              <Field label="Role Description & Scope">
                <textarea
                  className={`${inputClass} min-h-28`}
                  placeholder="Describe day-to-day duties, lab equipment exposure (HPLC, AAS), batch testing or clinical trial monitoring responsibilities..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </Field>

              {/* Required Skills Multi-select from Competency Taxonomy */}
              <div>
                <span className="mb-2 block text-sm font-semibold">
                  Required Competencies & Skills (Taxonomy)
                </span>
                <p className="mb-3 text-xs text-muted-foreground">
                  Select key skills candidates will be scored against.
                </p>
                <div className="flex flex-wrap gap-2">
                  {skillCatalog.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-muted/60 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {isSelected ? <Check className="size-3" /> : null}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <Button variant="ghost" type="button" onClick={() => navigate({ to: "/industry" })}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Sparkles className="size-4" /> Publish Opportunity
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}
