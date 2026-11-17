import { createFileRoute } from "@tanstack/react-router";
import { Calculator, Flame, HeartPulse, Info } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/forge/AppShell";
import { ForgeButton, Panel, PanelTitle, Pill } from "@/components/forge/Panel";

export const Route = createFileRoute("/bmi")({
  head: () => ({
    meta: [
      { title: "BMI Calculator — FORGE AI" },
      {
        name: "description",
        content:
          "Calculate BMI from height, weight, age and gender, with category, health interpretation and calorie targets.",
      },
      { property: "og:title", content: "BMI Calculator — FORGE AI" },
      {
        property: "og:description",
        content: "Instant BMI analysis with calorie targets for cutting, maintaining and bulking.",
      },
    ],
  }),
  component: BmiPage,
});

const categories = [
  { label: "Underweight", range: "< 18.5", tone: "cyan" as const, max: 18.5 },
  { label: "Normal", range: "18.5 – 24.9", tone: "success" as const, max: 25 },
  { label: "Overweight", range: "25.0 – 29.9", tone: "warning" as const, max: 30 },
  { label: "Obese", range: "≥ 30", tone: "primary" as const, max: Infinity },
];

function Field({
  label,
  value,
  onChange,
  unit,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
        {label}
      </span>
      <div className="mt-2 flex items-center rounded-xl border border-input bg-surface-2/70 px-4 transition-colors focus-within:border-primary/60">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent py-3 text-sm outline-none"
        />
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
    </label>
  );
}

function BmiPage() {
  const [height, setHeight] = useState("185");
  const [weight, setWeight] = useState("79.4");
  const [age, setAge] = useState("27");
  const [gender, setGender] = useState<"male" | "female">("male");

  const result = useMemo(() => {
    const h = Number(height) / 100;
    const w = Number(weight);
    const a = Number(age);
    if (!h || !w || !a) return null;

    const bmi = w / (h * h);
    const category = categories.find((c) => bmi < c.max) ?? categories[3]!;
    const bmr =
      gender === "male"
        ? 10 * w + 6.25 * Number(height) - 5 * a + 5
        : 10 * w + 6.25 * Number(height) - 5 * a - 161;
    const maintain = Math.round((bmr * 1.55) / 10) * 10;

    return {
      bmi,
      category,
      maintain,
      cut: maintain - 500,
      bulk: maintain + 350,
      protein: Math.round(w * 2.2),
      ideal: `${(18.5 * h * h).toFixed(1)} – ${(24.9 * h * h).toFixed(1)} kg`,
    };
  }, [height, weight, age, gender]);

  const interpretation: Record<string, string> = {
    Underweight:
      "You are below the healthy range. Prioritise a calorie surplus with heavy compound lifting to add lean mass safely.",
    Normal:
      "You sit in the healthy range. Focus on body recomposition: hold calories near maintenance and push progressive overload.",
    Overweight:
      "Slightly above the healthy range. A moderate deficit plus 3–5 resistance sessions weekly will reveal the muscle you already built.",
    Obese:
      "Well above the healthy range. Start with a sustainable deficit, daily walking and full-body strength work twice weekly.",
  };

  const markerPosition = result ? Math.min(100, Math.max(0, ((result.bmi - 14) / 22) * 100)) : 0;

  return (
    <AppShell title="BMI Analysis" subtitle="Body composition diagnostics">
      <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
        <Panel className="h-fit">
          <PanelTitle icon={Calculator}>Input Metrics</PanelTitle>
          <div className="space-y-4">
            <Field label="Height" value={height} onChange={setHeight} unit="cm" />
            <Field label="Weight" value={weight} onChange={setWeight} unit="kg" />
            <Field label="Age" value={age} onChange={setAge} unit="yrs" />
            <div>
              <span className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Gender
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium capitalize transition-all duration-300 ${
                      gender === g
                        ? "bg-primary text-primary-foreground forge-glow"
                        : "border border-border bg-surface-2/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <ForgeButton className="w-full">Recalculate</ForgeButton>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="relative overflow-hidden">
            <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative flex flex-wrap items-end gap-8">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.28em] text-primary uppercase">
                  Body Mass Index
                </div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-6xl font-semibold tracking-tight tabular-nums">
                    {result ? result.bmi.toFixed(1) : "—"}
                  </span>
                  {result && <Pill tone={result.category.tone}>{result.category.label}</Pill>}
                </div>
              </div>
              {result && (
                <div className="rounded-2xl border border-border bg-surface-2/70 px-5 py-4">
                  <div className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    Ideal weight range
                  </div>
                  <div className="mt-1.5 text-lg font-semibold tabular-nums">{result.ideal}</div>
                </div>
              )}
            </div>

            <div className="relative mt-8">
              <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-cyan via-success to-primary" />
              <div
                className="absolute -top-1.5 size-5 -translate-x-1/2 rounded-full border-[3px] border-background bg-foreground transition-all duration-500"
                style={{ left: `${markerPosition}%` }}
              />
              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                {categories.map((c) => (
                  <div key={c.label}>
                    <div className="text-xs font-medium">{c.label}</div>
                    <div className="text-[11px] text-muted-foreground tabular-nums">{c.range}</div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel>
              <PanelTitle icon={HeartPulse}>Health Interpretation</PanelTitle>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {result ? interpretation[result.category.label] : "Enter your metrics to begin."}
              </p>
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-surface-2/60 p-4">
                <Info className="mt-0.5 size-4 shrink-0 text-cyan" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  BMI ignores muscle mass and bone density. Trained lifters often read
                  &ldquo;overweight&rdquo; while carrying low body fat — pair this with waist
                  measurements and progress photos.
                </p>
              </div>
            </Panel>

            <Panel>
              <PanelTitle icon={Flame}>Calorie Targets</PanelTitle>
              {result && (
                <div className="space-y-3">
                  {[
                    { label: "Cut", value: result.cut, note: "-0.5 kg / week", tone: "cyan" as const },
                    {
                      label: "Maintain",
                      value: result.maintain,
                      note: "recomposition",
                      tone: "success" as const,
                    },
                    {
                      label: "Lean Bulk",
                      value: result.bulk,
                      note: "+0.25 kg / week",
                      tone: "primary" as const,
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between rounded-xl border border-border bg-surface-2/60 px-4 py-3.5"
                    >
                      <div>
                        <div className="text-sm font-medium">{row.label}</div>
                        <div className="text-xs text-muted-foreground">{row.note}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold tabular-nums">{row.value}</span>
                        <Pill tone={row.tone}>kcal</Pill>
                      </div>
                    </div>
                  ))}
                  <div className="rounded-xl bg-primary/10 px-4 py-3.5 text-sm">
                    <span className="text-muted-foreground">Daily protein target · </span>
                    <span className="font-semibold text-primary tabular-nums">
                      {result.protein} g
                    </span>
                  </div>
                </div>
              )}
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
