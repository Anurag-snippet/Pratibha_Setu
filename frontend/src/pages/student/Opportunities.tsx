import { useState } from "react";
import { DashboardShell, PageHeader } from "@/layouts/DashboardLayout";
import { Card, Button, useMockLoad, CardsSkeleton, EmptyState } from "@/components/ui-kit";
import { OpportunityCard } from "@/components/OpportunityCard";
import { opportunities, locations } from "@/mockData/mockOpportunities";
import { Search, SlidersHorizontal, IndianRupee, RotateCcw } from "lucide-react";

export function StudentOpportunities() {
  const loading = useMockLoad(500);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [minStipend, setMinStipend] = useState<number>(0);

  const opportunityTypes = ["All", "Internship", "Job", "Workshop"];

  const filtered = opportunities
    .filter((op) => op.audience === "student")
    .filter((op) => {
      const matchSearch =
        op.title.toLowerCase().includes(search.toLowerCase()) ||
        op.org.toLowerCase().includes(search.toLowerCase()) ||
        op.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

      const matchType = selectedType === "All" || op.type === selectedType;
      const matchLocation =
        selectedLocation === "All" ||
        op.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchStipend = op.stipend >= minStipend;

      return matchSearch && matchType && matchLocation && matchStipend;
    })
    .sort((a, b) => b.match - a.match);

  const handleReset = () => {
    setSearch("");
    setSelectedType("All");
    setSelectedLocation("All");
    setMinStipend(0);
  };

  return (
    <DashboardShell role="student">
      <PageHeader
        eyebrow="Opportunities"
        title="Explore Internships & Placements"
        subtitle="Opportunities curated across research institutes, pharmaceutical manufacturers and clinical wellness chains."
      />

      {/* Filter Bar */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted px-3.5 py-2.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by role title, company name or required skill (e.g. Formulation, HPLC)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1 font-bold text-muted-foreground">
              <SlidersHorizontal className="size-3.5" /> Filters:
            </span>

            {/* Type selector */}
            <div className="flex flex-wrap items-center gap-1">
              {opportunityTypes.map((type) => (
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

            {/* Location dropdown */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              aria-label="Filter by location"
              className="rounded-lg border border-input bg-card px-3 py-1.5 text-xs font-medium outline-none focus:border-primary"
            >
              <option value="All">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Stipend slider */}
            <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-1 text-xs">
              <IndianRupee className="size-3 text-muted-foreground" />
              <span>Min: ₹{minStipend.toLocaleString("en-IN")}</span>
              <input
                type="range"
                min="0"
                max="50000"
                step="5000"
                value={minStipend}
                onChange={(e) => setMinStipend(Number(e.target.value))}
                aria-label="Filter by minimum stipend"
                className="w-20 accent-primary"
              />
            </div>

            {(search || selectedType !== "All" || selectedLocation !== "All" || minStipend > 0) && (
              <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 text-xs">
                <RotateCcw className="size-3" /> Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Opportunities Grid */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong>{filtered.length}</strong> opportunities matching criteria
          </span>
          <span>Ranked by your competency profile</span>
        </div>

        {loading ? (
          <CardsSkeleton count={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No matching opportunities found"
            body="Try relaxing your search terms, minimum stipend or location filters."
            action={
              <Button variant="outline" size="sm" onClick={handleReset}>
                Clear All Filters
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((op) => (
              <OpportunityCard key={op.id} op={op} />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
