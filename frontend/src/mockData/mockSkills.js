// Mock skill taxonomy + assessment question bank.
// Swap with GET /api/skills and GET /api/assessment/questions later.

export const skillCatalog = [
  "Ayurvedic Pharmacology",
  "Herbal Formulation",
  "Quality Control & GMP",
  "Clinical Research",
  "Data Analysis",
  "Panchakarma Practice",
  "Yoga Therapy",
  "Regulatory Affairs",
  "Supply Chain",
  "Scientific Writing",
  "Digital Marketing",
  "Lab Instrumentation",
];

export const skillRadar = [
  { skill: "Formulation", score: 82, benchmark: 70 },
  { skill: "Clinical Research", score: 68, benchmark: 72 },
  { skill: "Quality & GMP", score: 74, benchmark: 65 },
  { skill: "Data Analysis", score: 55, benchmark: 68 },
  { skill: "Communication", score: 88, benchmark: 75 },
  { skill: "Regulatory", score: 46, benchmark: 62 },
];

export const assessmentQuestions = [
  {
    id: "q1",
    section: "Core Domain Knowledge",
    type: "mcq",
    skill: "Formulation",
    question: "Which classical text is the primary reference for Ayurvedic formulations?",
    options: ["Charaka Samhita", "Sushruta Samhita", "Ashtanga Hridaya", "Bhaishajya Ratnavali"],
    answerIndex: 3,
  },
  {
    id: "q2",
    section: "Core Domain Knowledge",
    type: "mcq",
    skill: "Formulation",
    question: "Kwatha churna is prepared primarily for which dosage form?",
    options: ["Decoction", "Tablet", "Oil", "Fermented liquid"],
    answerIndex: 0,
  },
  {
    id: "q3",
    section: "Core Domain Knowledge",
    type: "rating",
    skill: "Panchakarma",
    question: "Rate your hands-on confidence with Panchakarma procedures.",
  },
  {
    id: "q4",
    section: "Quality & Compliance",
    type: "mcq",
    skill: "Quality & GMP",
    question: "GMP for traditional medicine manufacturing units in India is governed by which schedule?",
    options: ["Schedule M", "Schedule T", "Schedule Y", "Schedule H"],
    answerIndex: 1,
  },
  {
    id: "q5",
    section: "Quality & Compliance",
    type: "mcq",
    skill: "Quality & GMP",
    question: "Which test is standard for detecting heavy metals in herbal raw material?",
    options: ["HPLC", "AAS / ICP-MS", "Karl Fischer", "Disintegration test"],
    answerIndex: 1,
  },
  {
    id: "q6",
    section: "Quality & Compliance",
    type: "rating",
    skill: "Regulatory",
    question: "Rate your familiarity with traditional medicine export & licensing documentation.",
  },
  {
    id: "q7",
    section: "Research & Data",
    type: "mcq",
    skill: "Clinical Research",
    question: "In a randomised controlled trial, blinding primarily reduces which bias?",
    options: ["Selection bias", "Observer bias", "Recall bias", "Publication bias"],
    answerIndex: 1,
  },
  {
    id: "q8",
    section: "Research & Data",
    type: "mcq",
    skill: "Data Analysis",
    question: "Which measure best describes the spread of a skewed dataset?",
    options: ["Mean", "Interquartile range", "Mode", "Sum"],
    answerIndex: 1,
  },
  {
    id: "q9",
    section: "Research & Data",
    type: "rating",
    skill: "Data Analysis",
    question: "Rate your comfort analysing datasets in Excel / Python / R.",
  },
  {
    id: "q10",
    section: "Research & Data",
    type: "rating",
    skill: "Clinical Research",
    question: "Rate your experience contributing to a research protocol or paper.",
  },
  {
    id: "q11",
    section: "Professional Skills",
    type: "mcq",
    skill: "Communication",
    question: "A patient-facing consultation summary should primarily be:",
    options: [
      "Highly technical",
      "Clear, plain-language and actionable",
      "As short as possible",
      "Written in Sanskrit terminology only",
    ],
    answerIndex: 1,
  },
  {
    id: "q12",
    section: "Professional Skills",
    type: "rating",
    skill: "Communication",
    question: "Rate your confidence presenting work to an industry panel.",
  },
  {
    id: "q13",
    section: "Professional Skills",
    type: "rating",
    skill: "Formulation",
    question: "Rate your practical lab formulation experience.",
  },
  {
    id: "q14",
    section: "Professional Skills",
    type: "mcq",
    skill: "Regulatory",
    question: "Which body regulates traditional medicine drug approvals in India?",
    options: ["FSSAI", "State Licensing Authority / CDSCO", "BIS", "ICMR"],
    answerIndex: 1,
  },
  {
    id: "q15",
    section: "Professional Skills",
    type: "rating",
    skill: "Quality & GMP",
    question: "Rate your exposure to a production or QC floor environment.",
  },
];

// Simple deterministic scoring — no ML, easy to replace with a server score.
export function scoreAssessment(answers) {
  const buckets = {};
  assessmentQuestions.forEach((q) => {
    const value = answers[q.id];
    if (value === undefined || value === null) return;
    const points =
      q.type === "mcq" ? (value === q.answerIndex ? 100 : 35) : Math.round((value / 5) * 100);
    buckets[q.skill] = buckets[q.skill] ?? [];
    buckets[q.skill].push(points);
  });
  return Object.entries(buckets).map(([skill, values]) => ({
    skill,
    score: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
  }));
}
