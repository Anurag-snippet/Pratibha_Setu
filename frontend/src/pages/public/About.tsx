import { Link } from "@tanstack/react-router";
import { Target, Users, Landmark, Sprout, ArrowRight } from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Badge, Button, Card, SectionHeading } from "@/components/ui-kit";
import { platformStats } from "@/mockData/mockAnalytics";

const pillars = [
  {
    icon: Target,
    title: "Measure real skills",
    body: "A structured assessment translates coursework into an industry-readable skill profile, so students are judged on capability rather than marks alone.",
  },
  {
    icon: Users,
    title: "Close the academia gap",
    body: "Faculty see exactly where each cohort is strong or thin, and can pull in FDPs, industrial training and consultancy work to fix it.",
  },
  {
    icon: Landmark,
    title: "Give industry a talent pipeline",
    body: "Traditional medicine manufacturers, hospitals and research bodies post once and reach matched, pre-assessed candidates across partner institutions.",
  },
  {
    icon: Sprout,
    title: "Grow the traditional medicine economy",
    body: "Better-prepared graduates strengthen quality, research and compliance capability across the traditional-medicine sector.",
  },
];

export function AboutPage() {
  return (
    <PublicLayout>
      <section className="hero-blob border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <Badge tone="primary">About the platform</Badge>
          <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl">
            A bridge between classrooms and industry
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            India's traditional medicine sector is growing quickly — in manufacturing, wellness services, clinical
            research and exports. Yet graduates from Ayurveda, Yoga, Unani, Siddha and Homoeopathy
            institutions often finish their degree without a clear line of sight to industry roles,
            while employers struggle to judge readiness from transcripts. Pratibha Setu exists to
            close that distance.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Our mission"
          title="Make talent visible, comparable and hireable"
          subtitle="One portal where students map their skills, academicians mentor with data, and industry hires with confidence."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <Card key={pillar.title} hover className="h-full">
              <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <pillar.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="eyebrow">Ministry context</p>
          <div className="mt-6 grid gap-10 lg:grid-cols-2">
            <p className="text-base leading-relaxed text-muted-foreground">
              The Ministry oversees education, research, standardisation and outreach for
              India's traditional systems of medicine. Its institutions, research councils and
              affiliated colleges produce tens of thousands of graduates every year, while the
              regulated traditional medicine manufacturing and wellness industry continues to expand into new
              domestic and export markets.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Pratibha Setu is designed as shared infrastructure for that ecosystem: a common skill
              language, a single opportunity feed, and dashboards that let institutions and the
              Ministry see participation and placement outcomes as they happen — instead of once a
              year in a report.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {platformStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border p-5">
                <p className="text-2xl font-extrabold tabular-nums text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-3xl font-extrabold">Join as a student, faculty member or employer</h2>
        <p className="mt-4 text-muted-foreground">
          Create an account or sign in to access personalized dashboards and opportunities.
        </p>
        <Link to="/login" className="mt-8 inline-block">
          <Button size="lg">
            Explore the dashboards <ArrowRight className="size-4" />
          </Button>
        </Link>
      </section>
    </PublicLayout>
  );
}
