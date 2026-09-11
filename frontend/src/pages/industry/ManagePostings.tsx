import { useState } from "react";
import { useApp } from "@/context/AuthContext";
import { DashboardShell, PageHeader } from "@/layouts/DashboardLayout";
import {
  Card,
  Button,
  Badge,
  statusTone,
  SkillTag,
  Modal,
  Field,
  inputClass,
  EmptyState,
} from "@/components/ui-kit";
import { Link } from "@tanstack/react-router";
import { PlusCircle, Edit3, Power, Users, Clock, Calendar, CheckCircle2 } from "lucide-react";

export function IndustryManagePostings() {
  const { postings, updatePosting } = useApp();

  const [editingPosting, setEditingPosting] = useState<null | {
    id: string;
    title: string;
    location: string;
    stipend: number;
    deadline: string;
  }>(null);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Active" ? "Closed" : "Active";
    updatePosting(id, { status: nextStatus });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPosting) return;

    updatePosting(editingPosting.id, {
      title: editingPosting.title,
      location: editingPosting.location,
      stipend: Number(editingPosting.stipend) || 0,
      deadline: editingPosting.deadline,
    });
    setEditingPosting(null);
  };

  return (
    <DashboardShell role="industry">
      <PageHeader
        eyebrow="Opportunity Lifecycle"
        title="Manage Published Postings"
        subtitle="Track application volume, toggle active hiring status and update job requirements."
        action={
          <Link to="/industry/post">
            <Button>
              <PlusCircle className="size-4" /> Post New Role
            </Button>
          </Link>
        }
      />

      {postings.length === 0 ? (
        <EmptyState
          title="No opportunities posted yet"
          body="Create your first internship or training program to begin receiving candidate applications."
          action={
            <Link to="/industry/post">
              <Button>Post First Opportunity</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {postings.map((p) => {
            const isActive = p.status === "Active";
            return (
              <Card key={p.id} className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-lg font-bold">{p.title}</h2>
                      <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                      <Badge tone="neutral">{p.type}</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>{p.location}</span>
                      <span>₹{p.stipend.toLocaleString("en-IN")}/mo</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" /> Deadline: {p.deadline}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.skills.map((s) => (
                        <SkillTag key={s}>{s}</SkillTag>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Applicant count */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-xl border border-border px-4 py-2 text-center text-xs">
                      <span className="block font-extrabold text-foreground text-sm">
                        {p.applicants}
                      </span>
                      <span className="text-muted-foreground">Applied</span>
                    </div>

                    <div className="rounded-xl border border-border px-4 py-2 text-center text-xs">
                      <span className="block font-extrabold text-primary text-sm">
                        {p.shortlisted}
                      </span>
                      <span className="text-muted-foreground">Shortlisted</span>
                    </div>

                    <Link to="/industry/applicants">
                      <Button variant="outline" size="sm">
                        <Users className="size-3.5" /> Applicants
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setEditingPosting({
                          id: p.id,
                          title: p.title,
                          location: p.location,
                          stipend: p.stipend,
                          deadline: p.deadline,
                        })
                      }
                    >
                      <Edit3 className="size-3.5" /> Edit
                    </Button>

                    <Button
                      variant={isActive ? "ghost" : "subtle"}
                      size="sm"
                      onClick={() => handleToggleStatus(p.id, p.status)}
                    >
                      <Power className="size-3.5" />
                      {isActive ? "Close Posting" : "Reopen"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Posting Modal */}
      {editingPosting ? (
        <Modal
          open={!!editingPosting}
          onClose={() => setEditingPosting(null)}
          title="Edit Opportunity Details"
          description="Update basic posting parameters and deadline."
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <Field label="Title">
              <input
                className={inputClass}
                value={editingPosting.title}
                onChange={(e) => setEditingPosting({ ...editingPosting, title: e.target.value })}
                required
              />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Location">
                <input
                  className={inputClass}
                  value={editingPosting.location}
                  onChange={(e) =>
                    setEditingPosting({ ...editingPosting, location: e.target.value })
                  }
                />
              </Field>
              <Field label="Stipend (₹)">
                <input
                  type="number"
                  className={inputClass}
                  value={editingPosting.stipend}
                  onChange={(e) =>
                    setEditingPosting({
                      ...editingPosting,
                      stipend: Number(e.target.value),
                    })
                  }
                />
              </Field>
            </div>

            <Field label="Deadline">
              <input
                type="date"
                className={inputClass}
                value={editingPosting.deadline}
                onChange={(e) => setEditingPosting({ ...editingPosting, deadline: e.target.value })}
              />
            </Field>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" type="button" onClick={() => setEditingPosting(null)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </DashboardShell>
  );
}
