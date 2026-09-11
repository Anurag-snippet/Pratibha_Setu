// Mock analytics for dashboards. Replace with GET /api/analytics later.

export const platformStats = [
  { label: "Internships posted", value: "12,480" },
  { label: "Students placed", value: "7,326" },
  { label: "Partner institutions", value: "512" },
  { label: "Industry partners", value: "1,140" },
];

export const skillDistribution = [
  { skill: "Formulation", students: 420 },
  { skill: "Quality & GMP", students: 365 },
  { skill: "Clinical Research", students: 288 },
  { skill: "Panchakarma", students: 244 },
  { skill: "Yoga Therapy", students: 196 },
  { skill: "Data Analysis", students: 158 },
  { skill: "Regulatory", students: 96 },
];

export const participationTrend = [
  { month: "Apr", internships: 62, workshops: 28 },
  { month: "May", internships: 78, workshops: 34 },
  { month: "Jun", internships: 96, workshops: 41 },
  { month: "Jul", internships: 120, workshops: 38 },
  { month: "Aug", internships: 148, workshops: 52 },
  { month: "Sep", internships: 176, workshops: 61 },
];

export const placementOutcomes = [
  { name: "Placed in industry", value: 412 },
  { name: "Higher studies", value: 168 },
  { name: "Internship ongoing", value: 236 },
  { name: "Seeking", value: 124 },
];

export const industryFunnel = [
  { stage: "Applied", count: 444 },
  { stage: "Screened", count: 268 },
  { stage: "Shortlisted", count: 96 },
  { stage: "Selected", count: 34 },
];

export const facultyStats = [
  { label: "Students mentored", value: "38" },
  { label: "Avg. skill growth", value: "+21%" },
  { label: "Industry attachments", value: "9" },
  { label: "Open FDPs", value: "4" },
];
