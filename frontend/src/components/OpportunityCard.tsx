import { Link } from "@tanstack/react-router";
import { MapPin, Clock, IndianRupee, Users } from "lucide-react";
import { Badge, Card, MatchBadge, SkillTag } from "@/components/ui-kit";

export type Opportunity = {
  id: string;
  title: string;
  org: string;
  logo: string;
  type: string;
  location: string;
  mode: string;
  stipend: number;
  duration: string;
  match: number;
  skills: string[];
  applicants: number;
};

export function OpportunityCard({ op }: { op: Opportunity }) {
  return (
    <Card hover className="flex h-full flex-col gap-4">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-sm font-bold text-primary">
          {op.logo}
        </span>
        <div className="min-w-0 flex-1">
          <Link
            to="/student/opportunities/$opportunityId"
            params={{ opportunityId: op.id }}
            className="line-clamp-2 font-bold hover:text-primary"
          >
            {op.title}
          </Link>
          <p className="text-sm text-muted-foreground">{op.org}</p>
        </div>
        <MatchBadge value={op.match} />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" /> {op.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" /> {op.duration}
        </span>
        <span className="inline-flex items-center gap-1">
          <IndianRupee className="size-3.5" />
          {op.stipend ? `${op.stipend.toLocaleString("en-IN")}/mo` : "Unpaid / funded"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="size-3.5" /> {op.applicants} applied
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {op.skills.slice(0, 3).map((skill) => (
          <SkillTag key={skill}>{skill}</SkillTag>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-2">
        <Badge tone="primary">{op.type}</Badge>
        <Link
          to="/student/opportunities/$opportunityId"
          params={{ opportunityId: op.id }}
          className="text-sm font-semibold text-primary hover:underline"
        >
          View details
        </Link>
      </div>
    </Card>
  );
}
