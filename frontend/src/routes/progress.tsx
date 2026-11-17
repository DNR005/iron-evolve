import { createFileRoute } from "@tanstack/react-router";
import { Award, CalendarDays, Scale, TrendingUp, Utensils } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/forge/AppShell";
import { Panel, PanelTitle, Pill, StatCard } from "@/components/forge/Panel";
import { achievements, consistencySeries, macroSplit, weightSeries } from "@/lib/forge-data";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — FORGE AI" },
      {
        name: "description",
        content:
          "Weight trend, training consistency, nutrition statistics, weekly and monthly progress plus achievement badges.",
      },
      { property: "og:title", content: "Progress — FORGE AI" },
      {
        property: "og:description",
        content: "Six months of training data visualised: weight, consistency and achievements.",
      },
    ],
  }),
  component: ProgressPage,
});

const chartTooltip = {
  contentStyle: {
    background: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "12px",
    fontSize: "12px",
  },
  labelStyle: { color: "var(--color-muted-foreground)" },
};

function ProgressPage() {
  return (
    <AppShell
      title="Progress"
      subtitle="Six-month performance telemetry"
      actions={<Pill tone="success">Trending up</Pill>}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Weight Change" value="-5.0" unit="kg" icon={Scale} accent="success" hint="Since March" />
          <StatCard label="Sessions" value="29" unit="last 6 weeks" icon={CalendarDays} progress={80} />
          <StatCard label="Avg Protein" value="196" unit="g / day" icon={Utensils} accent="cyan" progress={92} />
          <StatCard label="Strength" value="+18" unit="% total load" icon={TrendingUp} accent="warning" progress={72} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <Panel>
            <PanelTitle icon={Scale} right={<Pill tone="success">-5.0 kg</Pill>}>
              Weight Chart
            </PanelTitle>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightSeries}>
                  <defs>
                    <linearGradient id="progWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    domain={["dataMin - 1", "dataMax + 1"]}
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={36}
                  />
                  <Tooltip {...chartTooltip} />
                  <Area type="monotone" dataKey="weight" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#progWeight)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel>
            <PanelTitle icon={CalendarDays}>Workout Consistency</PanelTitle>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consistencySeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="week" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "var(--color-surface-2)" }} {...chartTooltip} />
                  <Bar dataKey="sessions" fill="var(--color-cyan)" radius={[8, 8, 0, 0]} maxBarSize={34} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Panel>
            <PanelTitle icon={Utensils}>Nutrition Statistics</PanelTitle>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroSplit}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {macroSplit.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip {...chartTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              {macroSplit.map((m) => (
                <div key={m.name} className="flex items-center gap-3">
                  <span className="size-2.5 rounded-full" style={{ background: m.color }} />
                  <span className="flex-1 text-muted-foreground">{m.name}</span>
                  <span className="font-medium tabular-nums">{m.value} g</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelTitle icon={TrendingUp}>Weekly Progress</PanelTitle>
            <div className="space-y-4">
              {[
                { label: "Sessions completed", value: "6 / 6", pct: 100 },
                { label: "Calorie adherence", value: "94%", pct: 94 },
                { label: "Protein adherence", value: "91%", pct: 91 },
                { label: "Hydration", value: "78%", pct: 78 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium tabular-nums">{row.value}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelTitle icon={CalendarDays}>Monthly Progress</PanelTitle>
            <div className="space-y-4">
              {[
                { label: "Sessions", value: "23", note: "+3 vs last month" },
                { label: "Total volume", value: "312,400 kg", note: "+9%" },
                { label: "Weight change", value: "-0.8 kg", note: "on target" },
                { label: "Avg session", value: "61 min", note: "-4 min" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface-2/60 px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-medium">{row.label}</div>
                    <div className="text-xs text-muted-foreground">{row.note}</div>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{row.value}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel>
          <PanelTitle icon={Award} right={<Pill tone="primary">4 / 6 unlocked</Pill>}>
            Achievement Badges
          </PanelTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((badge) => (
              <div
                key={badge.name}
                className={`flex items-center gap-4 rounded-2xl border p-5 transition-all duration-300 ${
                  badge.unlocked
                    ? "border-primary/35 bg-primary/8 hover:-translate-y-1"
                    : "border-border bg-surface-1/50 opacity-55"
                }`}
              >
                <div
                  className={`grid size-12 shrink-0 place-items-center rounded-xl ${
                    badge.unlocked ? "bg-primary/20 text-primary forge-glow" : "bg-surface-3 text-muted-foreground"
                  }`}
                >
                  <Award className="size-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{badge.name}</div>
                  <div className="text-xs text-muted-foreground">{badge.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
