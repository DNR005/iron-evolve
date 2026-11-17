import { createFileRoute } from "@tanstack/react-router";
import { Apple, Droplets, Flame, Minus, Plus, Utensils } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/forge/AppShell";
import { ForgeButton, Panel, PanelTitle, Pill, StatCard } from "@/components/forge/Panel";
import { forgeApi } from "@/lib/api";
import { dailyGoals as defaultGoals, foodDatabase } from "@/lib/forge-data";

export const Route = createFileRoute("/nutrition")({
  head: () => ({
    meta: [
      { title: "Nutrition — FORGE AI" },
      {
        name: "description",
        content:
          "Log food, track calories, protein, carbs, fats and water against your daily nutrition goals.",
      },
      { property: "og:title", content: "Nutrition — FORGE AI" },
      {
        property: "og:description",
        content: "Macro tracking and food logging built for lifters.",
      },
    ],
  }),
  component: NutritionPage,
});

type LogEntry = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

let nextId = 100;

function NutritionPage() {
  const [log, setLog] = useState<LogEntry[]>([
    { ...foodDatabase[0]!, id: 1 },
    { ...foodDatabase[3]!, id: 2 },
    { ...foodDatabase[5]!, id: 3 },
    { ...foodDatabase[2]!, id: 4 },
  ]);
  const [water, setWater] = useState(2800);
  const [dailyGoals, setDailyGoals] = useState(defaultGoals);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      const [itemsRes, goalsRes] = await Promise.all([
        forgeApi.getNutritionItems(),
        forgeApi.getNutritionGoals(),
      ]);
      if (mounted) {
        if (itemsRes.data && itemsRes.data.length > 0) {
          setLog(itemsRes.data);
        }
        if (goalsRes.data) {
          setDailyGoals((prev) => ({
            ...prev,
            calories: goalsRes.data.calories,
            protein: goalsRes.data.protein,
            carbs: goalsRes.data.carbs,
            fats: goalsRes.data.fats,
            water: goalsRes.data.water,
          }));
          if (typeof goalsRes.data.water_intake === "number") {
            setWater(goalsRes.data.water_intake);
          }
        }
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAddFood = async (food: (typeof foodDatabase)[number]) => {
    const tempId = nextId++;
    const newItem: LogEntry = { ...food, id: tempId };
    setLog((prev) => [...prev, newItem]);
    const { data } = await forgeApi.logNutritionItem(food);
    if (data && data.id) {
      setLog((prev) => prev.map((x) => (x.id === tempId ? { ...newItem, id: data.id } : x)));
    }
  };

  const handleRemoveFood = async (id: number) => {
    setLog((prev) => prev.filter((x) => x.id !== id));
    await forgeApi.deleteNutritionItem(id);
  };

  const updateWaterIntake = (newWater: number) => {
    const val = Math.max(0, newWater);
    setWater(val);
    forgeApi.updateNutritionGoals({ water_intake: val });
  };

  const totals = useMemo(
    () =>
      log.reduce(
        (acc, item) => ({
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fats: acc.fats + item.fats,
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0 },
      ),
    [log],
  );

  const pct = (v: number, goal: number) => Math.round((v / goal) * 100);

  return (
    <AppShell
      title="Nutrition"
      subtitle="Fuel the forge — macros and hydration"
      actions={<Pill tone="primary">{log.length} items logged</Pill>}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="Calories"
            value={totals.calories.toLocaleString()}
            unit={`/ ${dailyGoals.calories}`}
            icon={Flame}
            progress={pct(totals.calories, dailyGoals.calories)}
            hint={`${dailyGoals.calories - totals.calories} kcal remaining`}
          />
          <StatCard
            label="Protein"
            value={totals.protein}
            unit={`/ ${dailyGoals.protein} g`}
            icon={Utensils}
            accent="cyan"
            progress={pct(totals.protein, dailyGoals.protein)}
          />
          <StatCard
            label="Carbs"
            value={totals.carbs}
            unit={`/ ${dailyGoals.carbs} g`}
            icon={Apple}
            accent="warning"
            progress={pct(totals.carbs, dailyGoals.carbs)}
          />
          <StatCard
            label="Fats"
            value={totals.fats}
            unit={`/ ${dailyGoals.fats} g`}
            icon={Apple}
            accent="success"
            progress={pct(totals.fats, dailyGoals.fats)}
          />
          <StatCard
            label="Water"
            value={(water / 1000).toFixed(1)}
            unit={`/ ${dailyGoals.water / 1000} L`}
            icon={Droplets}
            accent="cyan"
            progress={pct(water, dailyGoals.water)}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <Panel>
            <PanelTitle icon={Utensils} right={<Pill>Today</Pill>}>
              Food Log
            </PanelTitle>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="text-left text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    <th className="pb-3">Item</th>
                    <th className="pb-3 text-right">Kcal</th>
                    <th className="pb-3 text-right">P</th>
                    <th className="pb-3 text-right">C</th>
                    <th className="pb-3 text-right">F</th>
                    <th className="pb-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {log.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-surface-2/50">
                      <td className="py-3 pr-4 font-medium">{item.name}</td>
                      <td className="py-3 text-right tabular-nums">{item.calories}</td>
                      <td className="py-3 text-right tabular-nums text-cyan">{item.protein}</td>
                      <td className="py-3 text-right tabular-nums text-warning">{item.carbs}</td>
                      <td className="py-3 text-right tabular-nums text-success">{item.fats}</td>
                      <td className="py-3 pl-3 text-right">
                        <button
                          aria-label={`Remove ${item.name}`}
                          onClick={() => handleRemoveFood(item.id)}
                          className="rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {log.length === 0 && (
              <p className="py-6 text-sm text-muted-foreground">
                Nothing logged yet. Add food from the quick-add panel.
              </p>
            )}
          </Panel>

          <div className="space-y-6">
            <Panel>
              <PanelTitle icon={Plus}>Quick Add</PanelTitle>
              <div className="space-y-2">
                {foodDatabase.map((food) => (
                  <button
                    key={food.name}
                    onClick={() => handleAddFood(food)}
                    className="flex w-full items-center justify-between rounded-xl border border-border bg-surface-2/60 px-4 py-3 text-left transition-all duration-300 hover:border-primary/40 hover:bg-surface-3"
                  >
                    <div>
                      <div className="text-sm font-medium">{food.name}</div>
                      <div className="text-xs text-muted-foreground tabular-nums">
                        {food.calories} kcal · {food.protein}P {food.carbs}C {food.fats}F
                      </div>
                    </div>
                    <Plus className="size-4 text-primary" />
                  </button>
                ))}
              </div>
            </Panel>

            <Panel>
              <PanelTitle icon={Droplets}>Hydration</PanelTitle>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-semibold tabular-nums">
                  {(water / 1000).toFixed(1)}
                  <span className="ml-1 text-sm text-muted-foreground">L</span>
                </span>
                <div className="flex gap-2">
                  <button
                    aria-label="Remove 250ml"
                    onClick={() => updateWaterIntake(water - 250)}
                    className="grid size-10 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Minus className="size-4" />
                  </button>
                  <button
                    aria-label="Add 250ml"
                    onClick={() => updateWaterIntake(water + 250)}
                    className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform hover:scale-105"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-8 gap-1.5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-8 rounded-md transition-colors duration-300 ${
                      i * 250 < water ? "bg-cyan/70" : "bg-surface-3"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Each block = 250ml · Goal {dailyGoals.water / 1000}L
              </p>
            </Panel>

            <Panel>
              <PanelTitle icon={Flame}>Daily Goals</PanelTitle>
              <div className="space-y-3 text-sm">
                {[
                  ["Calories", `${dailyGoals.calories} kcal`],
                  ["Protein", `${dailyGoals.protein} g`],
                  ["Carbohydrates", `${dailyGoals.carbs} g`],
                  ["Fats", `${dailyGoals.fats} g`],
                  ["Water", `${dailyGoals.water / 1000} L`],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium tabular-nums">{v}</span>
                  </div>
                ))}
              </div>
              <ForgeButton variant="outline" className="mt-5 w-full">
                Adjust Goals
              </ForgeButton>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
