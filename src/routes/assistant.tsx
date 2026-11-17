import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  Flame,
  Send,
  Sparkles,
  Terminal,
  Trash2,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/forge/AppShell";
import { ForgeButton, Panel, PanelTitle, Pill } from "@/components/forge/Panel";
import { forgeApi } from "@/lib/api";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "FORGE AI — Neural Assistant" },
      {
        name: "description",
        content:
          "Tactical AI fitness assistant powered by Iron Man / Jarvis styling for custom workouts, macros, and training insight.",
      },
      { property: "og:title", content: "FORGE AI — Neural Assistant" },
      {
        property: "og:description",
        content: "Tactical AI intelligence for strength and hypertrophy.",
      },
    ],
  }),
  component: AssistantPage,
});

type Message = {
  id: string | number;
  sender: "user" | "forge_ai";
  message: string;
  created_at?: string;
};

const SUGGESTIONS = [
  "Create a Push workout",
  "How many calories should I eat?",
  "Suggest chest exercises",
  "How do I lose fat without losing muscle?",
  "Give me back and bicep exercises",
];

export function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      sender: "forge_ai",
      message:
        "**[FORGE AI NEURAL CORE ONLINE]**\n\nGreetings, Warrior. All biometric streams, overload algorithms, and nutritional matrices are calibrated. What is your training directive today?",
      created_at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat history from Django backend if available
  useEffect(() => {
    let mounted = true;
    async function loadHistory() {
      const { data } = await forgeApi.getChatHistory();
      if (mounted && data && Array.isArray(data) && data.length > 0) {
        setMessages(data);
      }
    }
    loadHistory();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      message: text,
      created_at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await forgeApi.sendChatMessage(text);
      if (!error && data) {
        setMessages((prev) => [...prev, data]);
      } else {
        // Fallback local intelligent response
        setTimeout(() => {
          const fallbackReply = generateFallbackReply(text);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: "forge_ai",
              message: fallbackReply,
              created_at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        }, 500);
      }
    } catch {
      const fallbackReply = generateFallbackReply(text);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "forge_ai",
          message: fallbackReply,
          created_at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "cleared",
        sender: "forge_ai",
        message: "**[NEURAL BUFFER PURGED]**\n\nSession reset. Ready for next query.",
        created_at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <AppShell
      title="FORGE AI"
      subtitle="Jarvis-class tactical fitness intelligence"
      actions={
        <div className="flex items-center gap-3">
          <Pill tone="primary">Neural Core v4.2</Pill>
          <ForgeButton variant="ghost" onClick={handleClear} className="text-xs">
            <Trash2 className="size-3.5" /> Clear HUD
          </ForgeButton>
        </div>
      }
    >
      <div className="flex h-[calc(100vh-14rem)] flex-col gap-4">
        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Directives:
          </span>
          {SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              onClick={() => handleSend(sug)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-1/60 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
            >
              <Zap className="size-3 text-primary" /> {sug}
            </button>
          ))}
        </div>

        {/* Chat HUD Window */}
        <Panel className="flex flex-1 flex-col overflow-hidden p-0 sm:p-0">
          <div className="flex items-center justify-between border-b border-border bg-surface-2/40 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
              </span>
              <span className="text-xs font-semibold tracking-widest text-primary uppercase">
                JARVIS MATRIX // SECURE CONNECTION
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">Status: Synchronized</div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "forge_ai" && (
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/20 text-primary forge-glow">
                    <Bot className="size-5" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed transition-all ${
                    m.sender === "user"
                      ? "border border-primary/30 bg-primary/10 text-foreground"
                      : "border border-border bg-surface-2/80 text-foreground shadow-lg"
                  }`}
                >
                  <div className="mb-1.5 flex items-center justify-between gap-4 text-[10px] tracking-wider text-muted-foreground">
                    <span className="font-semibold uppercase">
                      {m.sender === "user" ? "You" : "FORGE AI Core"}
                    </span>
                    {m.created_at && <span>{m.created_at}</span>}
                  </div>
                  <div className="whitespace-pre-wrap font-sans text-sm">{m.message}</div>
                </div>

                {m.sender === "user" && (
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-border bg-surface-2 text-muted-foreground">
                    <User className="size-5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
                  <Terminal className="size-4 animate-spin" />
                </div>
                <div className="text-xs tracking-wider animate-pulse">
                  FORGE AI computing optimal biomechanical directive...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Controls */}
          <div className="border-t border-border bg-surface-2/40 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask FORGE AI (e.g. 'Build a 4-day split', 'How much protein?')..."
                className="flex-1 rounded-xl border border-input bg-surface-1/90 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
              />
              <ForgeButton type="submit" disabled={!input.trim() || loading}>
                <Send className="size-4" /> Send
              </ForgeButton>
            </form>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}

function generateFallbackReply(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("push") || p.includes("chest")) {
    return (
      "**[FORGE PROTOCOL LOADED: PUSH DOMINANCE]**\n\n" +
      "1. Barbell Bench Press: 4 sets × 6-8 reps (150s rest)\n" +
      "2. Incline Dumbbell Press: 4 sets × 8-10 reps (120s rest)\n" +
      "3. Seated Shoulder Press: 3 sets × 8-10 reps (120s rest)\n" +
      "4. Cable Lateral Raise: 4 sets × 12-15 reps (60s rest)\n" +
      "5. Overhead Rope Extension: 3 sets × 10-12 reps (75s rest)"
    );
  }
  if (p.includes("pull") || p.includes("back")) {
    return (
      "**[FORGE PROTOCOL LOADED: PULL MATRIX]**\n\n" +
      "1. Weighted Pull-Ups: 4 sets × 5-8 reps (150s rest)\n" +
      "2. Barbell Bent-Over Row: 4 sets × 6-8 reps (150s rest)\n" +
      "3. Chest-Supported Row: 3 sets × 10-12 reps (90s rest)\n" +
      "4. Cable Face Pull: 3 sets × 15-20 reps (60s rest)\n" +
      "5. Incline Dumbbell Curl: 3 sets × 10-12 reps (75s rest)"
    );
  }
  if (p.includes("calorie") || p.includes("diet") || p.includes("protein")) {
    return (
      "**[NUTRITION ANALYSIS & TARGET COMPUTATION]**\n\n" +
      "• Lean Bulk Target: 2,850 kcal/day (+250 kcal surplus)\n" +
      "• Aggressive Cut: 2,150 kcal/day (-450 kcal deficit)\n" +
      "• Protein Requirement: 180g - 200g daily\n" +
      "• Water Directive: 4,000 ml"
    );
  }
  return (
    `**[FORGE AI DIRECTIVE COMPUTED]**\n\n` +
    `Telemetry received for: "${prompt}". Maintaining progressive overload and consistent macro intake is the primary catalyst for muscular evolution.`
  );
}
