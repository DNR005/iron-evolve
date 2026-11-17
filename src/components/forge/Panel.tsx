import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function Panel({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <section className={`forge-panel p-5 sm:p-6 ${className}`}>{children}</section>;
}

export function PanelTitle({
  icon: Icon,
  children,
  right,
}: {
  icon?: LucideIcon;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon className="size-4 text-primary" />}
        <h2 className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
          {children}
        </h2>
      </div>
      {right}
    </div>
  );
}

export function StatCard({
  label,
  value,
  unit,
  hint,
  icon: Icon,
  progress,
  accent = "primary",
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  icon?: LucideIcon;
  progress?: number;
  accent?: "primary" | "cyan" | "success" | "warning";
}) {
  const accentText = {
    primary: "text-primary",
    cyan: "text-cyan",
    success: "text-success",
    warning: "text-warning",
  }[accent];
  const accentBg = {
    primary: "bg-primary",
    cyan: "bg-cyan",
    success: "bg-success",
    warning: "bg-warning",
  }[accent];

  return (
    <div className="forge-panel group p-5 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          {label}
        </span>
        {Icon && (
          <Icon
            className={`size-[18px] ${accentText} opacity-70 transition-opacity group-hover:opacity-100`}
          />
        )}
      </div>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {typeof progress === "number" && (
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-3">
          <div
            className={`h-full rounded-full ${accentBg} transition-all duration-700`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
      {hint && <p className="mt-3 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Pill({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "primary" | "cyan" | "success" | "warning";
}) {
  const tones = {
    muted: "bg-surface-3 text-muted-foreground",
    primary: "bg-primary/15 text-primary",
    cyan: "bg-cyan/15 text-cyan",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
  }[tone];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide ${tones}`}
    >
      {children}
    </span>
  );
}

export function ForgeButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  type?: "button" | "submit";
}) {
  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:brightness-110 forge-glow",
    outline: "border border-border bg-surface-2/50 text-foreground hover:bg-surface-3",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-surface-2",
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 active:scale-[0.98] ${variants} ${className}`}
    >
      {children}
    </button>
  );
}
