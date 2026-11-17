import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Apple,
  Bot,
  Calculator,
  Dumbbell,
  LayoutDashboard,
  Menu,
  Settings,
  X,
  Zap,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/workouts", label: "Workouts", icon: Dumbbell },
  { to: "/progress", label: "Progress", icon: Activity },
  { to: "/bmi", label: "BMI Calculator", icon: Calculator },
  { to: "/nutrition", label: "Nutrition", icon: Apple },
  { to: "/assistant", label: "FORGE AI", icon: Bot },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function ForgeMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary forge-glow">
        <Zap className="size-5" strokeWidth={2.5} />
      </div>
      <div className="leading-none">
        <div className="text-[15px] font-semibold tracking-[0.22em] text-foreground">FORGE</div>
        <div className="mt-1 text-[10px] font-medium tracking-[0.38em] text-primary">AI</div>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
              active
                ? "bg-primary/12 text-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            }`}
          >
            <span
              className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-primary transition-opacity duration-300 ${
                active ? "opacity-100" : "opacity-0"
              }`}
            />
            <Icon
              className={`size-[18px] transition-colors ${active ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="forge-ambient min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col border-r border-sidebar-border bg-sidebar/85 px-5 py-6 backdrop-blur-xl lg:flex">
        <ForgeMark />
        <div className="mt-8 mb-4 text-[10px] font-semibold tracking-[0.3em] text-muted-foreground">
          SYSTEMS
        </div>
        <NavList />
        <div className="mt-auto rounded-2xl border border-border bg-surface-2/60 p-4">
          <div className="text-xs font-semibold tracking-[0.2em] text-primary">STATUS</div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            All systems online. Streak intact — 14 days forged.
          </p>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[280px] border-r border-sidebar-border bg-sidebar px-5 py-6">
            <div className="flex items-center justify-between">
              <ForgeMark />
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-8">
              <NavList onNavigate={() => setOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-4 px-5 py-4 sm:px-8 lg:py-6">
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
              {subtitle && (
                <p className="mt-1 truncate text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
          <div className="forge-hairline h-px w-full opacity-60" />
        </header>
        <main className="px-5 py-7 sm:px-8 sm:py-9">{children}</main>
      </div>
    </div>
  );
}
