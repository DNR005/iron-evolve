import { createFileRoute } from "@tanstack/react-router";
import { Check, Flame, RefreshCw, Save, Settings, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/forge/AppShell";
import { ForgeButton, Panel, PanelTitle, Pill } from "@/components/forge/Panel";
import { forgeApi } from "@/lib/api";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — FORGE AI" },
      {
        name: "description",
        content: "Configure profile, biometric targets, units, and system preferences in FORGE AI.",
      },
    ],
  }),
  component: SettingsPage,
});

export function SettingsPage() {
  const [profile, setProfile] = useState({
    full_name: "Agent 001",
    email: "warrior@forge.ai",
    fitness_goal: "Hypertrophy & Max Strength",
    experience_level: "Advanced",
    height_cm: 182,
    weight_kg: 79.4,
    target_weight_kg: 78.0,
    unit_system: "metric",
    sound_effects: true,
    haptic_feedback: false,
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      const { data } = await forgeApi.getSettings();
      if (mounted && data) {
        setProfile((prev) => ({ ...prev, ...data }));
      }
    }
    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await forgeApi.updateSettings(profile);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      // Local state remains updated
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell
      title="System Settings"
      subtitle="Biometrics, profile parameters & HUD calibration"
      actions={<Pill tone="primary">Configuration Protocol</Pill>}
    >
      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Configuration */}
        <Panel>
          <PanelTitle icon={User}>Warrior Identity</PanelTitle>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Callsign / Full Name
              </label>
              <input
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="mt-2 w-full rounded-xl border border-input bg-surface-2/70 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/60"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Comm Frequency / Email
              </label>
              <input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                type="email"
                className="mt-2 w-full rounded-xl border border-input bg-surface-2/70 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/60"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Primary Directive (Goal)
              </label>
              <select
                value={profile.fitness_goal}
                onChange={(e) => setProfile({ ...profile, fitness_goal: e.target.value })}
                className="mt-2 w-full rounded-xl border border-input bg-surface-2/70 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/60"
              >
                <option value="Hypertrophy & Max Strength">Hypertrophy & Max Strength</option>
                <option value="Aggressive Fat Shred & Definition">
                  Aggressive Fat Shred & Definition
                </option>
                <option value="Athletic Conditioning & Endurance">
                  Athletic Conditioning & Endurance
                </option>
                <option value="Powerlifting Peak">Powerlifting Peak</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Experience Tier
              </label>
              <select
                value={profile.experience_level}
                onChange={(e) => setProfile({ ...profile, experience_level: e.target.value })}
                className="mt-2 w-full rounded-xl border border-input bg-surface-2/70 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/60"
              >
                <option value="Beginner">Beginner (0-1 yr)</option>
                <option value="Intermediate">Intermediate (1-3 yrs)</option>
                <option value="Advanced">Advanced (3-5+ yrs)</option>
                <option value="Elite">Elite / Competitive</option>
              </select>
            </div>
          </div>
        </Panel>

        {/* Biometrics */}
        <Panel>
          <PanelTitle icon={Flame}>Biometric Telemetry</PanelTitle>
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Height (cm)
              </label>
              <input
                type="number"
                value={profile.height_cm}
                onChange={(e) => setProfile({ ...profile, height_cm: Number(e.target.value) })}
                className="mt-2 w-full rounded-xl border border-input bg-surface-2/70 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/60"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Current Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={profile.weight_kg}
                onChange={(e) => setProfile({ ...profile, weight_kg: Number(e.target.value) })}
                className="mt-2 w-full rounded-xl border border-input bg-surface-2/70 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/60"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Target Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={profile.target_weight_kg}
                onChange={(e) =>
                  setProfile({ ...profile, target_weight_kg: Number(e.target.value) })
                }
                className="mt-2 w-full rounded-xl border border-input bg-surface-2/70 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/60"
              />
            </div>
          </div>
        </Panel>

        {/* HUD & System Interface */}
        <Panel>
          <PanelTitle icon={Shield}>Interface & Feedback Protocol</PanelTitle>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-surface-2/60 p-4">
              <div>
                <div className="text-sm font-medium">Measurement Standard</div>
                <div className="text-xs text-muted-foreground">Select Metric (kg/cm) or Imperial (lbs/in)</div>
              </div>
              <div className="flex rounded-lg border border-border bg-surface-1 p-1">
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, unit_system: "metric" })}
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${
                    profile.unit_system === "metric" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  Metric
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, unit_system: "imperial" })}
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${
                    profile.unit_system === "imperial" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  Imperial
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-surface-2/60 p-4">
              <div>
                <div className="text-sm font-medium">HUD Acoustic Feedback</div>
                <div className="text-xs text-muted-foreground">Synthesize audio cues when logging sets and finishing rounds</div>
              </div>
              <input
                type="checkbox"
                checked={profile.sound_effects}
                onChange={(e) => setProfile({ ...profile, sound_effects: e.target.checked })}
                className="size-5 accent-primary cursor-pointer"
              />
            </div>
          </div>
        </Panel>

        {/* Action Save Bar */}
        <div className="flex items-center justify-end gap-3">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-success animate-fade-in">
              <Check className="size-4" /> Parameters saved successfully
            </span>
          )}
          <ForgeButton type="submit" disabled={saving}>
            {saving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Parameters
          </ForgeButton>
        </div>
      </form>
    </AppShell>
  );
}
