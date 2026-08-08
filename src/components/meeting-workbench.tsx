"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, ArrowRight, Clock3, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parseBullets } from "@/lib/meeting-notes";

export type MeetingRecord = {
  id: string;
  title: string;
  summary: string;
  actionItems: string[];
  decisions: string[];
  nextSteps: string[];
  transcript: string;
  createdAt: string;
};

type MeetingWorkbenchProps = {
  initialMeetings: MeetingRecord[];
  displayName: string;
  plan: string;
  setupIssues: string[];
};

const sampleTranscript = `Product sync, August 8:
- We need to launch the new onboarding by next Friday.
- Sam will finalize homepage copy.
- Priya will wire the Stripe checkout flow.
- Action items: update pricing table, prepare demo transcript, and review analytics events before launch.`;

function MeetingCard({
  meeting,
  active,
  onClick
}: {
  meeting: MeetingRecord;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        active ? "border-cyan-400/40 bg-cyan-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white">{meeting.title}</p>
          <p className="mt-1 text-sm leading-6 text-white/60">{meeting.summary}</p>
        </div>
        <span className="whitespace-nowrap text-xs text-white/40">
          {formatDistanceToNow(new Date(meeting.createdAt), { addSuffix: true })}
        </span>
      </div>
    </button>
  );
}

export function MeetingWorkbench({ initialMeetings, displayName, plan, setupIssues }: MeetingWorkbenchProps) {
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [meetings, setMeetings] = useState(initialMeetings);
  const [selectedId, setSelectedId] = useState(initialMeetings[0]?.id ?? null);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(initialMeetings.length === 0);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState(plan);
  const [usageCount, setUsageCount] = useState<number>(0);
  const [usageLimit, setUsageLimit] = useState<number | null>(3);
  const [billingLoading, setBillingLoading] = useState(true);
  const [billingError, setBillingError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      setHistoryLoading(true);
      setHistoryError(null);

      try {
        const response = await fetch("/api/meetings", {
          cache: "no-store"
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error ?? "Failed to load history.");
        }

        const records = Array.isArray(payload.meetings) ? (payload.meetings as MeetingRecord[]) : [];

        if (!cancelled && records.length) {
          setMeetings(records);
          setSelectedId(records[0]?.id ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setHistoryError(err instanceof Error ? err.message : "Failed to load history.");
        }
      } finally {
        if (!cancelled) {
          setHistoryLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadBillingStatus() {
      setBillingLoading(true);
      setBillingError(null);

      try {
        const response = await fetch("/api/billing/status", {
          cache: "no-store"
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error ?? "Failed to load billing status.");
        }

        if (!cancelled) {
          setCurrentPlan(payload.plan ?? "free");
          setUsageCount(Number(payload.usageCount ?? 0));
          setUsageLimit(payload.usageLimit ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setBillingError(err instanceof Error ? err.message : "Failed to load billing status.");
        }
      } finally {
        if (!cancelled) {
          setBillingLoading(false);
        }
      }
    }

    void loadBillingStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedMeeting = useMemo(
    () => meetings.find((meeting) => meeting.id === selectedId) ?? meetings[0] ?? null,
    [meetings, selectedId]
  );
  const isOverLimit = currentPlan === "free" && usageLimit !== null && usageCount >= usageLimit;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLastSaved(null);

    if (isOverLimit) {
      setError("Free plan limit reached. Upgrade to Pro to generate more notes.");
      return;
    }

    if (!transcript.trim()) {
      setError("Paste a transcript before generating notes.");
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          transcript
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? "Generation failed.");
      }

      const meeting = payload.meeting as MeetingRecord;
      const record = {
        ...meeting,
        id: meeting.id ?? crypto.randomUUID(),
        actionItems: Array.isArray(meeting.actionItems) ? meeting.actionItems : parseBullets(String(meeting.actionItems ?? "")),
        decisions: Array.isArray(meeting.decisions) ? meeting.decisions : parseBullets(String(meeting.decisions ?? "")),
        nextSteps: Array.isArray(meeting.nextSteps) ? meeting.nextSteps : parseBullets(String(meeting.nextSteps ?? ""))
      };

      setMeetings((current) => [record, ...current.filter((item) => item.id !== record.id)]);
      setSelectedId(record.id);
      setTitle("");
      setTranscript("");
      setLastSaved(payload.saved ? "Saved to your account" : "Generated, but not saved yet");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsPending(false);
    }
  }

  function loadSampleTranscript() {
    setTitle("Product sync");
    setTranscript(sampleTranscript);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <Card className="bg-slate-950/70">
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-cyan-200">Workspace</p>
                <h2 className="mt-1 text-3xl font-semibold">Welcome back, {displayName}</h2>
                <p className="mt-2 text-sm text-white/60">
                  Plan: {billingLoading ? "Loading..." : currentPlan}
                  {usageLimit !== null ? ` · ${usageCount}/${usageLimit} notes used` : ""}
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={loadSampleTranscript} className="w-fit">
                Use sample transcript
              </Button>
            </div>

            {billingError ? (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-50">
                <p className="font-medium">Billing sync issue</p>
                <p className="mt-1 text-amber-50/80">{billingError}</p>
              </div>
            ) : null}

            {isOverLimit ? (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-50">
                <p className="font-medium">Free plan limit reached</p>
                <p className="mt-1 text-amber-50/80">Upgrade to Pro to keep generating meeting notes.</p>
              </div>
            ) : null}

            {setupIssues.length > 0 ? (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                  <div>
                    <p className="font-medium">Setup needed</p>
                    <ul className="mt-2 space-y-1 text-amber-50/80">
                      {setupIssues.map((issue) => (
                        <li key={issue}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            {historyError ? (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-50">
                <p className="font-medium">History sync issue</p>
                <p className="mt-1 text-amber-50/80">{historyError}</p>
              </div>
            ) : null}

            {historyLoading ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                Loading saved notes from your account...
              </div>
            ) : null}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Meeting title (optional)"
              />
              <Textarea
                value={transcript}
                onChange={(event) => setTranscript(event.target.value)}
                placeholder="Paste the meeting transcript here. Include the full context so the AI can summarize, extract action items, and highlight decisions."
                className="min-h-[260px]"
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-white/50">{transcript.length} characters</p>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : isOverLimit ? (
                    "Upgrade to Pro"
                  ) : (
                    <>
                      Generate notes <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              {error ? <p className="text-sm text-red-300">{error}</p> : null}
              {lastSaved ? <p className="text-sm text-emerald-300">{lastSaved}</p> : null}
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white/5">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-200">Generated note</p>
                <h3 className="mt-1 text-xl font-semibold">{selectedMeeting?.title ?? "No meeting yet"}</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/45">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                AI output
              </div>
            </div>

            {selectedMeeting ? (
              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">Summary</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-white/75">{selectedMeeting.summary}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">Action items</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-white/70">
                      {selectedMeeting.actionItems.length ? selectedMeeting.actionItems.map((item) => <li key={item}>• {item}</li>) : <li>None</li>}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">Decisions</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-white/70">
                      {selectedMeeting.decisions.length ? selectedMeeting.decisions.map((item) => <li key={item}>• {item}</li>) : <li>None</li>}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">Next steps</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-white/70">
                      {selectedMeeting.nextSteps.length ? selectedMeeting.nextSteps.map((item) => <li key={item}>• {item}</li>) : <li>None</li>}
                    </ul>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/60">
                  <div className="flex items-center gap-2 text-white/80">
                    <Clock3 className="h-4 w-4 text-cyan-300" />
                    Saved {formatDistanceToNow(new Date(selectedMeeting.createdAt), { addSuffix: true })}
                  </div>
                  <p className="mt-3 whitespace-pre-line">{selectedMeeting.transcript}</p>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-sm leading-7 text-white/60">
                Generate your first note to see the structured AI result here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-white/5">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-200">History</p>
                <h3 className="mt-1 text-xl font-semibold">Recent meetings</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
                {meetings.length} saved
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {meetings.length ? (
                meetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    active={meeting.id === selectedMeeting?.id}
                    onClick={() => setSelectedId(meeting.id)}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/45 p-5 text-sm text-white/55">
                  No notes yet. Paste your first transcript to create one.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/70">
          <CardContent className="space-y-3">
            <p className="text-sm text-cyan-200">What happens next</p>
            <h3 className="text-xl font-semibold text-white">This is the real core loop.</h3>
            <p className="text-sm leading-7 text-white/65">
              The generated result is ready to be persisted per user. Once your database and OpenAI key are in place, the same flow will continue working after refresh and across sessions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
