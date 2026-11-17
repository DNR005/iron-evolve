import { createFileRoute } from "@tanstack/react-router";
import { Headphones, Music4, Pause, Play, SkipForward, Volume2 } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/forge/AppShell";
import { Panel, PanelTitle, Pill } from "@/components/forge/Panel";
import { playlists } from "@/lib/forge-data";

export const Route = createFileRoute("/music")({
  head: () => ({
    meta: [
      { title: "Music — FORGE AI" },
      {
        name: "description",
        content:
          "Training playlists engineered per genre: Phonk, Hip Hop, Hardstyle, Metal, Rock and Cinematic.",
      },
      { property: "og:title", content: "Music — FORGE AI" },
      {
        property: "og:description",
        content: "Six curated workout playlists matched to training intensity.",
      },
    ],
  }),
  component: MusicPage,
});

function MusicPage() {
  const [playing, setPlaying] = useState<string | null>("Phonk");
  const current = playlists.find((p) => p.genre === playing) ?? playlists[0]!;

  return (
    <AppShell
      title="Sound System"
      subtitle="Match the frequency to the effort"
      actions={<Pill tone="primary">6 playlists</Pill>}
    >
      <div className="space-y-6">
        <Panel className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-6">
            <div className="grid size-24 place-items-center rounded-2xl bg-primary/15 text-primary forge-glow">
              <Headphones className="size-9" />
            </div>
            <div className="min-w-[200px] flex-1">
              <div className="text-[11px] font-semibold tracking-[0.28em] text-primary uppercase">
                Now Playing
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">{current.genre}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{current.tagline}</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
                  <div className="h-full w-[42%] rounded-full bg-primary" />
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">1:24 / 3:18</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPlaying(playing ? null : current.genre)}
                aria-label={playing ? "Pause" : "Play"}
                className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 hover:scale-105 forge-glow"
              >
                {playing ? <Pause className="size-6" /> : <Play className="size-6" />}
              </button>
              <button
                aria-label="Next track"
                className="grid size-11 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <SkipForward className="size-5" />
              </button>
              <button
                aria-label="Volume"
                className="grid size-11 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <Volume2 className="size-5" />
              </button>
            </div>
          </div>
        </Panel>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {playlists.map((playlist) => {
            const active = playing === playlist.genre;
            return (
              <div
                key={playlist.genre}
                className={`forge-panel group p-5 transition-all duration-300 hover:-translate-y-1 ${
                  active ? "border-primary/50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">{playlist.genre}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{playlist.tagline}</p>
                  </div>
                  <button
                    aria-label={`Play ${playlist.genre}`}
                    onClick={() => setPlaying(playlist.genre)}
                    className={`grid size-11 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                      active
                        ? "bg-primary text-primary-foreground forge-glow"
                        : "bg-surface-3 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                    }`}
                  >
                    <Play className="size-5" />
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill>{playlist.tracks} tracks</Pill>
                  <Pill>{playlist.duration}</Pill>
                  <Pill tone="cyan">{playlist.bpm} BPM</Pill>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {playlist.sample.map((track, i) => (
                    <li key={track} className="flex items-center gap-3 text-sm">
                      <span className="w-4 text-xs tabular-nums text-muted-foreground">{i + 1}</span>
                      <Music4 className="size-3.5 text-primary/70" />
                      <span className="truncate text-muted-foreground">{track}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <Panel>
          <PanelTitle icon={Music4}>Intensity Mapping</PanelTitle>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { phase: "Warm-up", genres: "Hip Hop · Rock", note: "Steady tempo, low arousal" },
              { phase: "Heavy Sets", genres: "Phonk · Hardstyle", note: "Peak aggression window" },
              { phase: "Finisher", genres: "Metal · Cinematic", note: "Emotional overdrive" },
            ].map((row) => (
              <div key={row.phase} className="rounded-2xl border border-border bg-surface-1/70 p-5">
                <div className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
                  {row.phase}
                </div>
                <p className="mt-2 text-sm font-medium">{row.genres}</p>
                <p className="mt-1 text-xs text-muted-foreground">{row.note}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
