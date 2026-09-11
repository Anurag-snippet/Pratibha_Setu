// TypeScript declaration for mockData modules
declare module "@/mockData/mockOpportunities" {
  export const opportunities: Array<{
    id: string;
    title: string;
    org: string;
    logo: string;
    type: string;
    location: string;
    mode: string;
    stipend: number;
    duration: string;
    deadline: string;
    match: number;
    skills: string[];
    audience: string;
    applicants: number;
    description: string;
    responsibilities: string[];
  }>;
  export const opportunityTypes: string[];
  export const locations: string[];
}

declare module "@/mockData/mockSkills" {
  export const skillCatalog: string[];
  export const skillRadar: Array<{ skill: string; score: number; benchmark: number }>;
  export const assessmentQuestions: Array<{
    id: string;
    section: string;
    type: "mcq" | "rating";
    skill: string;
    question: string;
    options?: string[];
    answerIndex?: number;
  }>;
  export function scoreAssessment(
    answers: Record<string, number | undefined | null>,
  ): Array<{ skill: string; score: number }>;
}

declare module "@/mockData/mockStudents" {
  export const currentStudent: {
    id: string;
    name: string;
    initials: string;
    headline: string;
    institution: string;
    education: string;
    location: string;
    email: string;
    profileCompletion: number;
    bio: string;
    skills: Array<{ name: string; level: number; verified: boolean }>;
    certifications: Array<{ id: string; name: string; issuer: string; year: string }>;
    projects: Array<{ id: string; name: string; summary: string; tags: string[] }>;
    achievements: string[];
  };
  export const students: Array<{
    id: string;
    name: string;
    initials: string;
    year: string;
    course: string;
    skillScore: number;
    topSkill: string;
    placement: string;
    company: string;
    mentor: string;
    applications: number;
  }>;
  export const testimonials: Array<{
    id: string;
    name: string;
    role: string;
    initials: string;
    quote: string;
  }>;
}

declare module "@/mockData/mockIndustries" {
  export const partners: string[];
  export const industryPostings: Array<{
    id: string;
    title: string;
    type: string;
    location: string;
    stipend: number;
    deadline: string;
    status: string;
    applicants: number;
    shortlisted: number;
    skills: string[];
  }>;
  export const applicantsByPosting: Record<
    string,
    Array<{
      id: string;
      name: string;
      initials: string;
      institution: string;
      match: number;
      status: string;
      topSkills: string[];
      feedback: string;
    }>
  >;
}

declare module "@/mockData/mockApplications" {
  export const applicationStatuses: string[];
  export const applications: Array<{
    id: string;
    opportunityId: string;
    title: string;
    org: string;
    appliedOn: string;
    status: string;
    timeline: Array<{ label: string; date: string; done: boolean }>;
  }>;
  export const notifications: Array<{
    id: string;
    kind: string;
    title: string;
    body: string;
    time: string;
    unread: boolean;
  }>;
}

declare module "@/mockData/mockAnalytics" {
  export const platformStats: Array<{ label: string; value: string }>;
  export const skillDistribution: Array<{ skill: string; students: number }>;
  export const participationTrend: Array<{
    month: string;
    internships: number;
    workshops: number;
  }>;
  export const placementOutcomes: Array<{ name: string; value: number }>;
  export const industryFunnel: Array<{ stage: string; count: number }>;
  export const facultyStats: Array<{ label: string; value: string }>;
}
