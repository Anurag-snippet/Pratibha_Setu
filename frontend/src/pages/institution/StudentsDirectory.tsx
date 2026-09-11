import { useState } from "react";
import { DashboardShell, PageHeader } from "@/layouts/DashboardLayout";
import { Card, Button, Badge, statusTone, TableSkeleton, useMockLoad } from "@/components/ui-kit";
import { students } from "@/mockData/mockStudents";
import { Search, ArrowUpDown, FileSpreadsheet, Download } from "lucide-react";

export function InstitutionStudentsDirectory() {
  const loading = useMockLoad(450);

  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("All");
  const [selectedPlacement, setSelectedPlacement] = useState<string>("All");
  const [sortField, setSortField] = useState<"skillScore" | "applications">("skillScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const courses = ["All", "BAMS", "B.Pharm (Ayurveda)", "BUMS", "BNYS", "BHMS"];
  const placementStatuses = ["All", "Selected", "Shortlisted", "Applied", "Not started"];

  const filtered = students
    .filter((st) => {
      const matchSearch =
        st.name.toLowerCase().includes(search.toLowerCase()) ||
        st.topSkill.toLowerCase().includes(search.toLowerCase()) ||
        st.company.toLowerCase().includes(search.toLowerCase()) ||
        st.mentor.toLowerCase().includes(search.toLowerCase());

      const matchCourse = selectedCourse === "All" || st.course === selectedCourse;
      const matchPlacement = selectedPlacement === "All" || st.placement === selectedPlacement;

      return matchSearch && matchCourse && matchPlacement;
    })
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      return sortOrder === "desc" ? valB - valA : valA - valB;
    });

  const toggleSort = (field: "skillScore" | "applications") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <DashboardShell role="institution">
      <PageHeader
        eyebrow="Institutional Roster"
        title="Students & Placements Directory"
        subtitle="Institution-wide repository of enrolled students, verified skill scores and placement outcomes."
      />

      {/* Filter and Search Bar */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted px-3.5 py-2.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search across all institution students, mentors, placed companies or top skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* Course Filter */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-muted-foreground">Course:</span>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                aria-label="Filter by course"
                className="rounded-lg border border-input bg-card px-3 py-1.5 font-medium outline-none focus:border-primary"
              >
                {courses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Placement Filter */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-muted-foreground">Status:</span>
              <select
                value={selectedPlacement}
                onChange={(e) => setSelectedPlacement(e.target.value)}
                aria-label="Filter by placement status"
                className="rounded-lg border border-input bg-card px-3 py-1.5 font-medium outline-none focus:border-primary"
              >
                {placementStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="ml-auto text-muted-foreground">
              Showing <strong>{filtered.length}</strong> of {students.length} students
            </div>
          </div>
        </div>
      </Card>

      {/* Student Table */}
      <Card className="mt-6 overflow-x-auto p-0">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={6} />
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/50 text-[11px] font-bold text-muted-foreground uppercase">
              <tr>
                <th className="px-5 py-4">Student Name</th>
                <th className="px-4 py-4">Course</th>
                <th className="px-4 py-4">Cohort Year</th>
                <th
                  className="cursor-pointer px-4 py-4 hover:text-foreground"
                  onClick={() => toggleSort("skillScore")}
                >
                  <span className="inline-flex items-center gap-1">
                    Assessed Score <ArrowUpDown className="size-3" />
                  </span>
                </th>
                <th className="px-4 py-4">Top Assessed Skill</th>
                <th
                  className="cursor-pointer px-4 py-4 hover:text-foreground"
                  onClick={() => toggleSort("applications")}
                >
                  <span className="inline-flex items-center gap-1">
                    Applications <ArrowUpDown className="size-3" />
                  </span>
                </th>
                <th className="px-4 py-4">Placement Status</th>
                <th className="px-4 py-4">Company / Partner</th>
                <th className="px-4 py-4">Assigned Mentor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((st) => (
                <tr key={st.id} className="transition hover:bg-muted/40">
                  <td className="px-5 py-3.5 font-bold text-foreground">{st.name}</td>
                  <td className="px-4 py-3.5 font-semibold text-primary">{st.course}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{st.year} Year</td>
                  <td className="px-4 py-3.5">
                    <span className="font-extrabold text-foreground">{st.skillScore}%</span>
                  </td>
                  <td className="px-4 py-3.5 font-medium">{st.topSkill}</td>
                  <td className="px-4 py-3.5 tabular-nums text-muted-foreground">
                    {st.applications}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge tone={statusTone(st.placement)}>{st.placement}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{st.company}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{st.mentor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </DashboardShell>
  );
}
