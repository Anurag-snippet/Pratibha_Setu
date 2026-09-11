import { useState } from "react";
import { DashboardShell, PageHeader } from "@/layouts/DashboardLayout";
import { Card, Button, useMockLoad, CardsSkeleton, EmptyState } from "@/components/ui-kit";
import { OpportunityCard } from "@/components/OpportunityCard";
import { opportunities } from "@/mockData/mockOpportunities";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

export function AcademicianOpportunities() {
  const loading = useMockLoad(500);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");

  const facultyTypes = ["All", "FDP", "Industrial Training", "Research", "Consultancy"];

  const filtered = opportunities
    .filter((op) => op.audience === "faculty")
    .filter((op) => {
      const matchSearch =
        op.title.toLowerCase().includes(search.toLowerCase()) ||
        op.org.toLowerCase().includes(search.toLowerCase()) ||
        op.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

      const matchType = selectedType === "All" || op.type === selectedType;

      return matchSearch && matchType;
    })
    .sort((a, b) => b.match - a.match);

  const handleReset = () => {
    setSearch("");
    setSelectedType("All");
  };

  return (
    <DashboardShell role="academician">
      <PageHeader
        eyebrow="Faculty Attachments & Calls"
        title="Faculty Development & Research Attachments"
        subtitle="Opportunities for faculty to engage in industrial training, research grants and curriculum redesign."
      />

      {/* Filter Bar */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted px-3.5 py-2.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search faculty FDPs, research calls, consultancy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1 font-bold text-muted-foreground">
              <SlidersHorizontal className="size-3.5" /> Program Type:
            </span>

            <div className="flex flex-wrap items-center gap-1">
              {facultyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`rounded-lg px-3 py-1.5 font-medium transition ${
                    selectedType === type
                      ? "bg-primary text-primary-foreground font-bold shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {(search || selectedType !== "All") && (
              <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 text-xs">
                <RotateCcw className="size-3" /> Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Grid */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong>{filtered.length}</strong> faculty openings
          </span>
          <span>Sponsored by Partner Institutions & Industries</span>
        </div>

        {loading ? (
          <CardsSkeleton count={3} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No matching faculty opportunities found"
            body="Try changing your search terms or selecting 'All' program types."
            action={
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset Filter
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((op) => (
              <OpportunityCard key={op.id} op={op} />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
