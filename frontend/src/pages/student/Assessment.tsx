import { useState } from "react";
import { useApp } from "@/context/AuthContext";
import { DashboardShell, PageHeader } from "@/layouts/DashboardLayout";
import { Card, Button, ProgressBar, Badge, SkillTag, SectionHeading } from "@/components/ui-kit";
import { assessmentQuestions, scoreAssessment, skillRadar } from "@/mockData/mockSkills";
import { CheckCircle2, RotateCcw, ArrowRight, ArrowLeft, Award, Sparkles } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Link } from "@tanstack/react-router";

export function StudentAssessment() {
  const { skillScores, setSkillScores } = useApp();

  // Group questions by section
  const sections = Array.from(new Set(assessmentQuestions.map((q) => q.section)));
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(!!skillScores);

  const currentSection = sections[currentSectionIndex] ?? sections[0];
  const sectionQuestions = assessmentQuestions.filter((q) => q.section === currentSection);

  // Total questions count & answered count
  const totalQuestions = assessmentQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelectMCQ = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSelectRating = (questionId: string, rating: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: rating }));
  };

  const handleFinish = () => {
    const scored = scoreAssessment(answers);
    setSkillScores(scored);
    setIsCompleted(true);
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentSectionIndex(0);
    setIsCompleted(false);
  };

  // Results preparation
  const finalScores = skillScores || scoreAssessment(answers);
  const chartData = finalScores.map((s) => {
    const benchmarkItem = skillRadar.find((b) => b.skill.toLowerCase() === s.skill.toLowerCase());
    return {
      skill: s.skill,
      score: s.score,
      benchmark: benchmarkItem?.benchmark ?? 65,
    };
  });

  return (
    <DashboardShell role="student">
      <PageHeader
        eyebrow="Skill Diagnostic"
        title="Competency Assessment"
        subtitle="Translate your academic knowledge and lab exposure into an industry-verified skill matrix."
      />

      {isCompleted ? (
        <div className="space-y-8">
          {/* Results Summary Header */}
          <Card className="border-primary/30 bg-primary-soft/30 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <CheckCircle2 className="size-6" />
                </span>
                <div>
                  <h2 className="text-xl font-bold">Assessment Complete!</h2>
                  <p className="text-sm text-muted-foreground">
                    Your skills have been updated across your profile and will directly boost your
                    matching percentage for internships.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleRetake}>
                  <RotateCcw className="size-4" /> Retake Test
                </Button>
                <Link to="/student/opportunities">
                  <Button size="sm">
                    View Matching Opportunities <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Charts & Skill Gaps */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Bar comparison */}
            <Card className="p-6">
              <h3 className="text-base font-bold">Skill Scores vs. Industry Benchmark</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Green bars represent your score; grey shows standard industry expectation.
              </p>
              <div className="mt-6 h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="skill"
                      angle={-20}
                      textAnchor="end"
                      tick={{ fill: "#64748b", fontSize: 11 }}
                    />
                    <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
                    <Tooltip />
                    <Bar
                      dataKey="score"
                      name="Your Score"
                      fill="var(--color-primary, #059669)"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="benchmark"
                      name="Benchmark"
                      fill="#cbd5e1"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Radar View */}
            <Card className="p-6">
              <h3 className="text-base font-bold">Competency Radar Matrix</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Holistic view of your core clinical, analytical and regulatory readiness.
              </p>
              <div className="mt-6 h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: "#64748b", fontSize: 11 }} />
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
                      name="Benchmark"
                      dataKey="benchmark"
                      stroke="#94a3b8"
                      fill="#94a3b8"
                      fillOpacity={0.15}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Skill Gap Analysis Cards */}
          <Card className="p-6">
            <SectionHeading
              eyebrow="Targeted Upskilling"
              title="Skill Gap Recommendations"
              subtitle="Where you stand against industry requirements and recommended steps to improve."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {chartData.map((item) => {
                const gap = item.benchmark - item.score;
                const isStrong = item.score >= item.benchmark;
                return (
                  <div
                    key={item.skill}
                    className="flex flex-col justify-between rounded-xl border border-border p-4 transition hover:bg-muted/40"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{item.skill}</span>
                        <Badge tone={isStrong ? "success" : "warning"}>
                          {isStrong ? "Market Ready" : `Gap: ${gap} pts`}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          Your Score: <strong className="text-foreground">{item.score}%</strong>
                        </span>
                        <span>
                          Target: <strong className="text-foreground">{item.benchmark}%</strong>
                        </span>
                      </div>
                      <ProgressBar value={item.score} className="mt-2" />
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {isStrong
                        ? "✓ High match for R&D and QC roles. Highlight in applications."
                        : "💡 Consider reviewing classical pharmacopoeia procedures and lab protocols."}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      ) : (
        /* Multi-step Question Form */
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Progress Header */}
          <Card className="p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-primary">
                Section {currentSectionIndex + 1} of {sections.length}: {currentSection}
              </span>
              <span className="text-xs text-muted-foreground">
                {answeredCount} of {totalQuestions} answered ({progressPercent}%)
              </span>
            </div>
            <ProgressBar value={progressPercent} className="mt-2.5" />
          </Card>

          {/* Section Questions */}
          <div className="space-y-4">
            {sectionQuestions.map((q, idx) => {
              const currentVal = answers[q.id];
              return (
                <Card key={q.id} className="space-y-4 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary-soft text-xs font-bold text-primary">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-semibold">{q.question}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <SkillTag>{q.skill}</SkillTag>
                          <Badge tone="neutral">
                            {q.type === "mcq" ? "Multiple Choice" : "Self-Rating (1–5)"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MCQ Options */}
                  {q.type === "mcq" && q.options ? (
                    <div className="grid gap-2.5 pt-2 sm:grid-cols-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = currentVal === optIdx;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectMCQ(q.id, optIdx)}
                            className={`flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm font-medium transition ${
                              isSelected
                                ? "border-primary bg-primary-soft text-primary ring-2 ring-primary/20"
                                : "border-border bg-card hover:bg-muted"
                            }`}
                          >
                            <span
                              className={`grid size-5 shrink-0 place-items-center rounded-full border text-xs font-bold ${
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-muted-foreground/40"
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {/* Rating Scale (1-5) */}
                  {q.type === "rating" ? (
                    <div className="pt-2">
                      <div className="flex items-center justify-between pb-2 text-xs text-muted-foreground">
                        <span>Beginner / Little Exposure (1)</span>
                        <span>Expert / Hands-on (5)</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((lvl) => {
                          const isSelected = currentVal === lvl;
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => handleSelectRating(q.id, lvl)}
                              className={`flex flex-col items-center justify-center rounded-xl border py-3 transition ${
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm"
                                  : "border-border bg-card hover:bg-muted font-semibold"
                              }`}
                            >
                              <span className="text-base">{lvl}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </Card>
              );
            })}
          </div>

          {/* Step Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              onClick={() => setCurrentSectionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentSectionIndex === 0}
            >
              <ArrowLeft className="size-4" /> Previous Section
            </Button>

            {currentSectionIndex < sections.length - 1 ? (
              <Button
                onClick={() =>
                  setCurrentSectionIndex((prev) => Math.min(sections.length - 1, prev + 1))
                }
              >
                Next Section <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleFinish}
                disabled={answeredCount < totalQuestions / 2}
              >
                <Sparkles className="size-4" /> Submit & Generate Diagnostic
              </Button>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
