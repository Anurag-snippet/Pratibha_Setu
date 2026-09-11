import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui-kit";

export function NotFoundPage() {
  return (
    <PublicLayout>
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Compass className="size-7" />
        </span>
        <p className="eyebrow mt-6">Error 404</p>
        <h1 className="mt-2 text-4xl font-extrabold">This page isn't on the map</h1>
        <p className="mt-3 text-muted-foreground">
          The link may be outdated, or the page may have moved. Try the opportunities feed instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/">
            <Button>Back to home</Button>
          </Link>
          <Link to="/student/opportunities">
            <Button variant="outline">Browse opportunities</Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
