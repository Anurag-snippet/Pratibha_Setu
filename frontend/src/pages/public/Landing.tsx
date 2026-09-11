import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Search,
  GraduationCap,
  Building2,
  BookOpen,
  ClipboardCheck,
  Compass,
  Handshake,
  Quote,
} from "lucide-react";
import heroImage from "@/assets/hero-illustration.jpg";
import { PublicLayout } from "@/layouts/PublicLayout";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardsSkeleton,
  SectionHeading,
  useMockLoad,
} from "@/components/ui-kit";
import { OpportunityCard } from "@/components/OpportunityCard";
import { opportunities } from "@/mockData/mockOpportunities";
import { platformStats } from "@/mockData/mockAnalytics";
import { testimonials } from "@/mockData/mockStudents";
import { partners } from "@/mockData/mockIndustries";

const roleCards = [
  {
    icon: GraduationCap,
    title: "I'm a student",
    body: "Map your skills, find matched internships and build a verified portfolio.",
    to: "/login",
  },
  {
    icon: Building2,
    title: "I'm an industry",
    body: "Post roles and reach pre-assessed talent with match scoring.",
    to: "/login",
  },
  {
    icon: BookOpen,
    title: "I'm an academician",
    body: "Track student growth and access FDPs, training and research calls.",
    to: "/login",
  },
] as const;

const steps = [
  {
    icon: ClipboardCheck,
    title: "Assess your skills",
    body: "A 15-question assessment builds your skill profile and highlights gaps against industry benchmarks.",
  },
  {
    icon: Compass,
    title: "Discover opportunities",
    body: "See internships, jobs, workshops and FDPs ranked by how well they match your verified profile.",
  },
  {
    icon: Handshake,
    title: "Get placed",
    body: "Apply, track every stage, and let institutions and mentors support you through to an offer.",
  },
];

export function LandingPage() {
  const loading = useMockLoad(700);
  const featured = opportunities.filter((op) => op.audience === "student").slice(0, 6);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="hero-blob border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge tone="primary">Academia–Industry Collaboration Portal</Badge>
            <h1 className="mt-5 text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-6xl">
              Find where your skills meet real opportunity
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Pratibha Setu connects students, academicians and industry on one bridge — skill
              mapping, internships, industrial training and placements in a single trusted portal.
            </p>

            <Card className="mt-8 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted px-3.5 py-3">
                <Search className="size-4 text-muted-foreground" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Search internships, skills or companies"
                  aria-label="Search opportunities"
                />
              </div>
              <Link to="/student/opportunities">
                <Button className="w-full sm:w-auto">
                  Search opportunities <ArrowRight className="size-4" />
                </Button>
              </Link>
            </Card>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {roleCards.map((card) => (
                <Link key={card.title} to={card.to}>
                  <Card hover className="h-full p-4">
                    <span className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary">
                      <card.icon className="size-4" />
                    </span>
                    <p className="mt-3 text-sm font-bold">{card.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {card.body}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Illustration of a bridge connecting education and industry"
              width={1200}
              height={960}
              className="w-full rounded-3xl border border-border shadow-card"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {platformStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-extrabold tabular-nums text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps from classroom to career"
          subtitle="No guesswork, no cold applications — a measured skill profile drives everything you see."
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} hover className="h-full">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <step.icon className="size-5" />
                </span>
                <span className="text-sm font-bold text-muted-foreground">Step {index + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured opportunities */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Featured openings"
            title="Opportunities open right now"
            subtitle="Live postings from manufacturers, research councils and wellness institutions."
            action={
              <Link to="/student/opportunities">
                <Button variant="outline" size="sm">
                  Browse all <ArrowRight className="size-4" />
                </Button>
              </Link>
            }
          />
          <div className="mt-10">
            {loading ? (
              <CardsSkeleton count={6} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {featured.map((op) => (
                  <OpportunityCard key={op.id} op={op} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Success stories"
          title="People who crossed the bridge"
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.id} hover className="h-full">
              <Quote className="size-6 text-primary" />
              <p className="mt-4 text-sm leading-relaxed">{item.quote}</p>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <Avatar initials={item.initials} />
                <div>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="eyebrow text-center">Trusted across the ecosystem</p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {partners.map((partner) => (
              <div
                key={partner}
                className="rounded-xl border border-border bg-background px-4 py-5 text-center text-sm font-semibold text-muted-foreground"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-blob border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to see where you stand today?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Take the skill assessment and get matched opportunities in under ten minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/login">
              <Button size="lg">Get started free</Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline">
                Learn about the mission
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
