import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "navy" | "outline" | "outline-light" | "ghost";
};

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "tap inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" && "bg-teal text-ink",
        variant === "navy" && "bg-navy text-mist",
        variant === "outline" && "border border-line bg-card text-ink",
        variant === "outline-light" && "border border-line-dark bg-transparent text-mist",
        variant === "ghost" && "text-slate",
        className,
      )}
      {...props}
    />
  );
}

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 md:py-12", className)}>{children}</div>;
}

export function Meter({
  value,
  max,
  tone = "card",
}: {
  value: number;
  max: number;
  tone?: "card" | "navy";
}) {
  const pct = max <= 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div
      className={cn("h-1.5 overflow-hidden rounded-full", tone === "card" ? "bg-line" : "bg-navy-3")}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className="h-full bg-teal" style={{ width: `${pct}%` }} />
    </div>
  );
}
