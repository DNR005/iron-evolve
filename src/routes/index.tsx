import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Beef,
  Droplets,
  Flame,
  Gauge,
  Play,
  Quote,
  Scale,
  Sparkles,
  Target,
  TrendingDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { AppShell } from "@/components/forge/AppShell";
import { ForgeButton, Panel, PanelTitle, Pill, StatCard } from "@/components/forge/Panel";
import { forgeApi } from "@/lib/api";
import { recentActivity as defaultRecent, weeklyActivity, weightSeries as defaultWeight } from "@/lib/forge-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — FORGE AI" },
      {
        name: "description",
        content:
          "Your daily training command center: today's mission, calories, protein, water, BMI, streak and weekly activity.",
      },
      { property: "og:title", content: "Dashboard — FORGE AI" },
      {
        property: "og:description",
        content: "Track today's mission, macros, streak and weekly training load in one place.",
      },
    ],
  }),
  component: Dashboard,
});

const chartTooltip = {
  contentStyle: {
    background: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "12px",
    fontSize: "12px",
    color: "var(--color-foreground)",
  },
  labelStyle: { color: "var(--color-muted-foreground)" },
};

function Dashboard() {
  const [stats, setStats] = useState({
    calories: 2140,
    calorieGoal: 2850,
    protein: 182,
    proteinGoal: 200,
    water: 2.8,
    waterGoal: 4.0,
    weight: 79.4,
    streak: 14,
  });
  const [activities, setActivities] = useState(defaultRecent);
  const completion = 68;

  useEffect(() => {
    let mounted = true;
    async function loadDash() {
      const { data } = await forgeApi.getDashboard();
      if (mounted && data) {
        if (data.nutrition) {
          setStats((prev) => ({
            ...prev,
            calories: data.nutrition.calories_consumed || prev.calories,
            calorieGoal: data.nutrition.calorie_goal || prev.calorieGoal,
            protein: data.nutrition.protein_consumed || prev.protein,
            proteinGoal: data.nutrition.protein_goal || prev.proteinGoal,
            water: data.nutrition.water_intake ? data.nutrition.water_intake / 1000 : prev.water,
            waterGoal: data.nutrition.water_goal ? data.nutrition.water_goal / 1000 : prev.waterGoal,
          }));
        }
        if (data.recent_activity && data.recent_activity.length > 0) {
          setActivities(data.recent_activity);
        }
      }
    }
    loadDash();
    return () => {
      mounted = false;
    };
  }, []);

  const calRemaining = Math.max(0, stats.calorieGoal - stats.calories);
  const proteinRemaining = Math.max(0, stats.proteinGoal - stats.protein);

  return (
    <AppShell
      title="Command Center"
      subtitle="Saturday · Week 6 of Hypertrophy Block"
      actions={
        <>
          <Pill tone="success">All systems online</Pill>
          <ForgeButton>
            <Play className="size-4" /> Start Session
          </ForgeButton>
        </>
      }
    >
      <div className="space-y-6">
        {/* Today's mission */}
        <Panel className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <Target className="size-4 text-primary" />
                <span className="text-[11px] font-semibold tracking-[0.28em] text-primary uppercase">
                  Today&apos;s Mission
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Push Day — <span className="forge-gradient-text">Heavy Press</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Five compound movements, 18 working sets. Target progressive overload on bench press:
                add 2.5kg to last week&apos;s top set.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Pill tone="primary">Chest</Pill>
                <Pill tone="primary">Shoulders</Pill>
                <Pill tone="primary">Triceps</Pill>
                <Pill>62 min</Pill>
                <Pill>18 sets</Pill>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <ForgeButton>
                  <Play className="size-4" /> Resume Workout
                </ForgeButton>
                <Link to="/workouts">
                  <ForgeButton variant="outline">
                    Browse Splits <ArrowRight className="size-4" />
                  </ForgeButton>
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-2xl border border-border bg-surface-1/70 p-6">
              <div className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
                Workout completion
              </div>
              <div className="mt-6 flex items-center gap-6">
                <div
                  className="grid size-28 shrink-0 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(var(--color-primary) ${completion * 3.6}deg, var(--color-surface-3) 0deg)`,
                  }}
                >
                  <div className="grid size-[88px] place-items-center rounded-full bg-surface-1">
                    <span className="text-2xl font-semibold tabular-nums">{completion}%</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-6">
                    <span className="text-muted-foreground">Sets done</span>
                    <span className="font-medium tabular-nums">12 / 18</span>
                  </div>
                  <div className="flex items-center justify-between gap-6">
                    <span className="text-muted-foreground">Volume</span>
                    <span className="font-medium tabular-nums">11,240 kg</span>
                  </div>
                  <div className="flex items-center justify-between gap-6">
                    <span className="text-muted-foreground">Elapsed</span>
                    <span className="font-medium tabular-nums">41 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* Stat grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Calories"
            value={stats.calories.toLocaleString()}
            unit={`/ ${stats.calorieGoal.toLocaleString()} kcal`}
            icon={Flame}
            progress={Math.round((stats.calories / stats.calorieGoal) * 100)}
            hint={`${calRemaining} kcal remaining today`}
          />
          <StatCard
            label="Protein"
            value={stats.protein}
            unit={`/ ${stats.proteinGoal} g`}
            icon={Beef}
            accent="cyan"
            progress={Math.round((stats.protein / stats.proteinGoal) * 100)}
            hint={proteinRemaining > 0 ? `On pace — ${proteinRemaining}g to go` : "Target achieved"}
          />
          <StatCard
            label="Water"
            value={stats.water.toFixed(1)}
            unit={`/ ${stats.waterGoal.toFixed(1)} L`}
            icon={Droplets}
            accent="cyan"
            progress={Math.round((stats.water / stats.waterGoal) * 100)}
            hint="Drink 600ml before training"
          />
          <StatCard
            label="BMI"
            value="23.1"
            unit="normal"
            icon={Gauge}
            accent="success"
            progress={58}
            hint="Healthy range · 18.5 – 24.9"
          />
          <StatCard
            label="Streak"
            value={stats.streak}
            unit="days"
            icon={Activity}
            progress={70}
            hint="Personal best: 20 days"
          />
          <StatCard
            label="Weight"
            value={stats.weight}
            unit="kg"
            icon={Scale}
            accent="success"
            hint="-0.8 kg in 30 days"
          />
          <StatCard
            label="Weekly Load"
            value="80,600"
            unit="kg"
            icon={TrendingDown}
            accent="warning"
            progress={82}
            hint="+6% vs last week"
          />
          <StatCard
            label="Sessions"
            value="6"
            unit="/ 6 planned"
            icon={Target}
            accent="success"
            progress={100}
            hint="Perfect week"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <Panel>
            <PanelTitle icon={Activity} right={<Pill tone="primary">This week</Pill>}>
              Weekly Activity
            </PanelTitle>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip cursor={{ fill: "var(--color-surface-2)" }} {...chartTooltip} />
                  <Bar
                    dataKey="minutes"
                    fill="var(--color-primary)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={38}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel>
            <PanelTitle icon={Scale} right={<Pill tone="success">-5.0 kg</Pill>}>
              Weight Progress
            </PanelTitle>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightSeries}>
                  <defs>
                    <linearGradient id="dashWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip {...chartTooltip} />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    fill="url(#dashWeight)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        {/* Activity + motivation */}
        <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <Panel>
            <PanelTitle icon={Sparkles}>Recent Activity</PanelTitle>
            <ul className="divide-y divide-border">
              {activities.map((item) => (
                <li key={item.title} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                  <span className="size-2 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.meta}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="relative overflow-hidden">
            <div className="pointer-events-none absolute -bottom-20 -left-16 size-56 rounded-full bg-primary/15 blur-3xl" />
            <PanelTitle icon={Quote}>Forge Protocol</PanelTitle>
            <blockquote className="relative text-xl font-medium leading-relaxed tracking-tight">
              &ldquo;Discipline is the weight you lift when motivation refuses to show up.&rdquo;
            </blockquote>
            <p className="relative mt-4 text-sm text-muted-foreground">
              You are 6 sets from closing today&apos;s mission. Finish it.
            </p>
            <Link to="/assistant" className="relative mt-6 inline-block">
              <ForgeButton variant="outline">
                Ask FORGE AI <ArrowRight className="size-4" />
              </ForgeButton>
            </Link>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
