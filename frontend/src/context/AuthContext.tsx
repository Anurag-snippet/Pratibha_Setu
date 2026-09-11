import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { applications as seedApplications } from "@/mockData/mockApplications";
import { industryPostings as seedPostings, applicantsByPosting } from "@/mockData/mockIndustries";
import { currentStudent } from "@/mockData/mockStudents";

export type Role = "student" | "academician" | "industry" | "institution";

export const roleMeta: Record<Role, { label: string; home: string; org: string; person: string }> =
  {
    student: {
      label: "Student",
      home: "/student",
      org: "National Institute of Ayurveda, Jaipur",
      person: "Ananya Sharma",
    },
    academician: {
      label: "Academician",
      home: "/academician",
      org: "National Institute of Ayurveda, Jaipur",
      person: "Dr. R. Venkatesan",
    },
    industry: {
      label: "Industry",
      home: "/industry",
      org: "Himalaya Wellness",
      person: "Priya Deshpande",
    },
    institution: {
      label: "Institution Admin",
      home: "/institution",
      org: "National Institute of Ayurveda, Jaipur",
      person: "Dr. S. Bhattacharya",
    },
  };

type Application = (typeof seedApplications)[number];
type Posting = (typeof seedPostings)[number];
type Applicant = {
  id: string;
  name: string;
  initials: string;
  institution: string;
  match: number;
  status: string;
  topSkills: string[];
  feedback: string;
  [k: string]: unknown;
};

type AuthValue = {
  role: Role | null;
  user: { name: string; org: string; initials: string } | null;
  login: (role: Role, name?: string, token?: string, userData?: any) => void;
  logout: () => void;
  // mock app state
  applications: Application[];
  applyTo: (opportunity: { id: string; title: string; org: string }) => void;
  postings: Posting[];
  addPosting: (posting: Partial<Posting>) => void;
  updatePosting: (id: string, patch: Partial<Posting>) => void;
  applicants: Record<string, Applicant[]>;
  updateApplicant: (postingId: string, applicantId: string, patch: Partial<Applicant>) => void;
  portfolio: typeof currentStudent;
  addPortfolioItem: (
    section: "certifications" | "projects" | "achievements",
    item: unknown,
  ) => void;
  skillScores: { skill: string; score: number }[] | null;
  setSkillScores: (scores: { skill: string; score: number }[]) => void;
};

const AuthContext = createContext<AuthValue | null>(null);

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const emptyStudent = {
  id: "",
  name: "",
  initials: "",
  headline: "Student / Trainee",
  institution: "Registered Institution",
  education: "",
  location: "",
  email: "",
  profileCompletion: 20,
  bio: "",
  skills: [],
  certifications: [],
  projects: [],
  achievements: [],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<AuthValue["user"]>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [applicants, setApplicants] = useState<Record<string, Applicant[]>>({});
  const [portfolio, setPortfolio] = useState(emptyStudent);
  const [skillScores, setSkillScores] = useState<{ skill: string; score: number }[] | null>(null);

  const login = useCallback((nextRole: Role, name?: string, token?: string, userData?: any) => {
    const meta = roleMeta[nextRole];
    const displayName = name?.trim() ? name.trim() : (userData?.name || meta.person);
    setRole(nextRole);
    setUser({ 
      name: displayName, 
      org: userData?.org || meta.org, 
      initials: initials(displayName),
      ...(userData || {})
    });
    setPortfolio((prev) => ({
      ...prev,
      name: displayName,
      initials: initials(displayName),
      institution: userData?.org || meta.org,
    }));
    if (token) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify({ role: nextRole, name: displayName, ...userData }));
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setRole(null);
    setUser(null);
    setApplications([]);
    setPostings([]);
    setApplicants({});
    setPortfolio(emptyStudent);
    setSkillScores(null);
  }, []);

  const applyTo = useCallback((opportunity: { id: string; title: string; org: string }) => {
    setApplications((prev) => {
      if (prev.some((a) => a.opportunityId === opportunity.id)) return prev;
      const today = new Date().toISOString().slice(0, 10);
      return [
        {
          id: `ap-${Date.now()}`,
          opportunityId: opportunity.id,
          title: opportunity.title,
          org: opportunity.org,
          appliedOn: today,
          status: "Applied",
          timeline: [{ label: "Application submitted", date: "Just now", done: true }],
        } as Application,
        ...prev,
      ];
    });
  }, []);

  const addPosting = useCallback((posting: Partial<Posting>) => {
    setPostings((prev) => [
      {
        id: `ip-${Date.now()}`,
        status: "Active",
        applicants: 0,
        shortlisted: 0,
        skills: [],
        ...posting,
      } as Posting,
      ...prev,
    ]);
  }, []);

  const updatePosting = useCallback((id: string, patch: Partial<Posting>) => {
    setPostings((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const updateApplicant = useCallback(
    (postingId: string, applicantId: string, patch: Partial<Applicant>) => {
      setApplicants((prev) => ({
        ...prev,
        [postingId]: (prev[postingId] ?? []).map((a) =>
          a.id === applicantId ? { ...a, ...patch } : a,
        ),
      }));
    },
    [],
  );

  const addPortfolioItem = useCallback(
    (section: "certifications" | "projects" | "achievements", item: unknown) => {
      setPortfolio((prev: typeof currentStudent) => ({
        ...prev,
        [section]: [...(prev[section] as unknown[]), item],
      }));
    },
    [],
  );

  const value = useMemo<AuthValue>(
    () => ({
      role,
      user,
      login,
      logout,
      applications,
      applyTo,
      postings,
      addPosting,
      updatePosting,
      applicants,
      updateApplicant,
      portfolio,
      addPortfolioItem,
      skillScores,
      setSkillScores,
    }),
    [
      role,
      user,
      login,
      logout,
      applications,
      applyTo,
      postings,
      addPosting,
      updatePosting,
      applicants,
      updateApplicant,
      portfolio,
      addPortfolioItem,
      skillScores,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
