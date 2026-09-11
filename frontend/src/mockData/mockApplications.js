// Mock applications + notifications. Replace with GET /api/applications later.

export const applicationStatuses = ["Applied", "Shortlisted", "Rejected", "Selected"];

export const applications = [
  {
    id: "ap-1",
    opportunityId: "op-1",
    title: "Herbal Formulation R&D Intern",
    org: "Himalaya Wellness",
    appliedOn: "2026-08-21",
    status: "Shortlisted",
    timeline: [
      { label: "Application submitted", date: "21 Aug 2026", done: true },
      { label: "Profile reviewed by recruiter", date: "24 Aug 2026", done: true },
      { label: "Shortlisted for interview", date: "01 Sep 2026", done: true },
      { label: "Interview scheduled", date: "Awaiting slot", done: false },
    ],
  },
  {
    id: "ap-2",
    opportunityId: "op-3",
    title: "Quality Control Analyst Trainee",
    org: "Dabur Research Foundation",
    appliedOn: "2026-08-14",
    status: "Selected",
    timeline: [
      { label: "Application submitted", date: "14 Aug 2026", done: true },
      { label: "Technical screening cleared", date: "22 Aug 2026", done: true },
      { label: "Offer released", date: "03 Sep 2026", done: true },
    ],
  },
  {
    id: "ap-3",
    opportunityId: "op-5",
    title: "Regulatory Affairs Workshop — Pharma & Herbal Exports",
    org: "Quality Council of India (QCI)",
    appliedOn: "2026-09-02",
    status: "Applied",
    timeline: [{ label: "Application submitted", date: "02 Sep 2026", done: true }],
  },
  {
    id: "ap-4",
    opportunityId: "op-6",
    title: "Healthcare Data Analytics Intern",
    org: "National Institute of Ayurveda",
    appliedOn: "2026-07-30",
    status: "Rejected",
    timeline: [
      { label: "Application submitted", date: "30 Jul 2026", done: true },
      { label: "Screening completed", date: "06 Aug 2026", done: true },
      { label: "Not progressed this cycle", date: "12 Aug 2026", done: true },
    ],
  },
];

export const notifications = [
  {
    id: "n1",
    kind: "match",
    title: "New 94% match",
    body: "Herbal Formulation R&D Intern at Himalaya Wellness fits your skill profile.",
    time: "12m ago",
    unread: true,
  },
  {
    id: "n2",
    kind: "application",
    title: "You were shortlisted",
    body: "Himalaya Wellness moved your application to Shortlisted.",
    time: "2h ago",
    unread: true,
  },
  {
    id: "n3",
    kind: "assessment",
    title: "Assessment refresh due",
    body: "Your skill assessment is 40 days old. Retake it to improve match accuracy.",
    time: "1d ago",
    unread: true,
  },
  {
    id: "n4",
    kind: "system",
    title: "Portfolio verified",
    body: "Your certification 'GMP Essentials' was verified by your institution.",
    time: "3d ago",
    unread: false,
  },
];
