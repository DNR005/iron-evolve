import { createFileRoute } from "@tanstack/react-router";
import { Check, Clock, Dumbbell, Layers, Plus, Trash2, Wrench } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/forge/AppShell";
import { ForgeButton, Panel, PanelTitle, Pill } from "@/components/forge/Panel";
import { forgeApi } from "@/lib/api";
import { exerciseLibrary, workoutSplits as defaultSplits, type Exercise, type WorkoutSplit } from "@/lib/forge-data";

export const Route = createFileRoute("/workouts")({
  head: () => ({
    meta: [
      { title: "Workouts — FORGE AI" },
      {
        name: "description",
        content:
          "Explore Push, Pull, Legs, Upper, Lower, Bro Split and Arnold Split programs, or build a custom workout.",
      },
      { property: "og:title", content: "Workouts — FORGE AI" },
      {
        property: "og:description",
        content: "Seven engineered training splits plus a custom workout builder.",
      },
    ],
  }),
  component: WorkoutsPage,
});

function difficultyTone(d: Exercise["difficulty"]) {
  return d === "Advanced" ? "primary" : d === "Intermediate" ? "warning" : "success";
}

function ExerciseCard({ exercise, onAdd }: { exercise: Exercise; onAdd?: () => void }) {
  return (
    <div className="group rounded-2xl border border-border bg-surface-1/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">{exercise.name}</h3>
          <p className="mt-1 text-xs tracking-wide text-primary">{exercise.muscle}</p>
        </div>
        <Pill tone={difficultyTone(exercise.difficulty)}>{exercise.difficulty}</Pill>
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
        {[
          { k: "Sets", v: exercise.sets },
          { k: "Reps", v: exercise.reps },
          { k: "Rest", v: exercise.rest },
        ].map((cell) => (
          <div key={cell.k} className="rounded-xl bg-surface-2/80 px-2 py-3">
            <dt className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {cell.k}
            </dt>
            <dd className="mt-1 text-sm font-medium tabular-nums">{cell.v}</dd>
          </div>
        ))}
      </dl>
      {onAdd && (
        <ForgeButton variant="outline" className="mt-4 w-full" onClick={onAdd}>
          <Plus className="size-4" /> Add to builder
        </ForgeButton>
      )}
    </div>
  );
}

function WorkoutsPage() {
  const [splits, setSplits] = useState<WorkoutSplit[]>(defaultSplits);
  const [activeId, setActiveId] = useState(defaultSplits[0]!.id);
  const [custom, setCustom] = useState<Exercise[]>([]);
  const [customName, setCustomName] = useState("Custom Protocol Alpha");
  const [query, setQuery] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadSplits() {
      const { data } = await forgeApi.getWorkouts();
      if (mounted && data && Array.isArray(data) && data.length > 0) {
        const formatted: WorkoutSplit[] = data.map((d: any) => ({
          id: d.slug,
          name: d.name,
          focus: d.focus,
          duration: d.duration,
          volume: d.volume,
          description: d.description,
          exercises: (d.exercises || []).map((e: any) => ({
            name: e.name,
            muscle: e.muscle,
            sets: e.sets,
            reps: e.reps,
            rest: e.rest,
            difficulty: e.difficulty,
          })),
        }));
        setSplits(formatted);
      }
    }
    loadSplits();
    return () => {
      mounted = false;
    };
  }, []);

  const builder = activeId === "custom";
  const active = splits.find((s) => s.id === activeId);

  const results = exerciseLibrary.filter(
    (e, i, arr) =>
      arr.findIndex((x) => x.name === e.name) === i &&
      (e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.muscle.toLowerCase().includes(query.toLowerCase())),
  );

  const handleSaveCustom = async () => {
    if (custom.length === 0) return;
    const totalSets = custom.reduce((sum, e) => sum + e.sets, 0);
    const slug = `custom-${Date.now()}`;
    const newSplit: WorkoutSplit = {
      id: slug,
      name: customName || "Custom Protocol",
      focus: "Custom Engineered Routine",
      duration: `${custom.length * 12} min`,
      volume: `${totalSets} sets`,
      description: "User-defined custom resistance routine.",
      exercises: custom,
    };

    setSplits((prev) => [...prev, newSplit]);
    setActiveId(slug);
    setCustom([]);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    await forgeApi.createWorkout({
      slug,
      name: newSplit.name,
      focus: newSplit.focus,
      duration: newSplit.duration,
      volume: newSplit.volume,
      description: newSplit.description,
      is_custom: true,
    });
  };

  return (
    <AppShell
      title="Workouts"
      subtitle="Choose a split or forge your own program"
      actions={<Pill tone="primary">{splits.length} programs</Pill>}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {splits.map((split) => (
            <button
              key={split.id}
              onClick={() => setActiveId(split.id)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                activeId === split.id
                  ? "bg-primary text-primary-foreground forge-glow"
                  : "border border-border bg-surface-1/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {split.name}
            </button>
          ))}
          <button
            onClick={() => setActiveId("custom")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
              builder
                ? "bg-primary text-primary-foreground forge-glow"
                : "border border-border bg-surface-1/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Wrench className="size-4" /> Custom Builder
          </button>
        </div>

        {!builder && active && (
          <>
            <Panel>
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.28em] text-primary uppercase">
                    <Dumbbell className="size-4" /> {active.focus}
                  </div>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                    {active.name} <span className="text-muted-foreground">Protocol</span>
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {active.description}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-2xl border border-border bg-surface-2/70 px-5 py-4 text-center">
                    <Clock className="mx-auto size-4 text-primary" />
                    <div className="mt-2 text-lg font-semibold">{active.duration}</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface-2/70 px-5 py-4 text-center">
                    <Layers className="mx-auto size-4 text-cyan" />
                    <div className="mt-2 text-lg font-semibold">{active.volume}</div>
                  </div>
                </div>
              </div>
            </Panel>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {active.exercises.map((exercise) => (
                <ExerciseCard key={exercise.name} exercise={exercise} />
              ))}
            </div>
          </>
        )}

        {builder && (
          <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
            <Panel>
              <PanelTitle icon={Wrench}>Exercise Library</PanelTitle>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by exercise or muscle…"
                className="mb-5 w-full rounded-xl border border-input bg-surface-2/70 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
              />
              <div className="grid gap-4 md:grid-cols-2">
                {results.map((exercise) => (
                  <ExerciseCard
                    key={exercise.name}
                    exercise={exercise}
                    onAdd={() => setCustom((prev) => [...prev, exercise])}
                  />
                ))}
              </div>
            </Panel>

            <Panel className="h-fit xl:sticky xl:top-28">
              <PanelTitle icon={Layers} right={<Pill tone="primary">{custom.length}</Pill>}>
                Your Workout
              </PanelTitle>
              {custom.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Empty. Add exercises from the library to forge a custom session.
                </p>
              ) : (
                <ul className="space-y-3">
                  {custom.map((exercise, i) => (
                    <li
                      key={`${exercise.name}-${i}`}
                      className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/60 px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{exercise.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {exercise.sets} × {exercise.reps} · {exercise.rest}
                        </p>
                      </div>
                      <button
                        aria-label={`Remove ${exercise.name}`}
                        onClick={() => setCustom((prev) => prev.filter((_, idx) => idx !== i))}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface-3 hover:text-primary"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4">
                <label className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Program Name
                </label>
                <input
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Heavy Duty Split"
                  className="mt-1 w-full rounded-xl border border-input bg-surface-2/70 px-3 py-2 text-sm outline-none focus:border-primary/60"
                />
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-2/60 px-4 py-3 text-sm">
                <span className="text-muted-foreground">Total sets</span>
                <span className="font-medium tabular-nums">
                  {custom.reduce((sum, e) => sum + e.sets, 0)}
                </span>
              </div>

              {savedSuccess && (
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-success">
                  <Check className="size-3.5" /> Protocol forged and stored!
                </div>
              )}

              <ForgeButton
                onClick={handleSaveCustom}
                disabled={custom.length === 0}
                className="mt-4 w-full"
              >
                Save Program
              </ForgeButton>
            </Panel>
          </div>
        )}
      </div>
    </AppShell>
  );
}
