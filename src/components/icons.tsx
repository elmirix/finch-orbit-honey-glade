import {
  BarChart3,
  BookOpen,
  Brain,
  Calculator,
  Globe,
  GraduationCap,
  Headphones,
  Landmark,
  Languages,
  Mic,
  PenLine,
  Sigma,
  SpellCheck,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/data/types";

const ICONS: Record<IconKey, LucideIcon> = {
  sigma: Sigma,
  brain: Brain,
  book: BookOpen,
  spell: SpellCheck,
  headphones: Headphones,
  pen: PenLine,
  mic: Mic,
  calculator: Calculator,
  chart: BarChart3,
  languages: Languages,
  graduation: GraduationCap,
  globe: Globe,
  landmark: Landmark,
};

export function Icon({ name, className }: { name: IconKey; className?: string }) {
  const Glyph = ICONS[name];
  return <Glyph className={className} aria-hidden="true" strokeWidth={1.75} />;
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path
        d="M9.5 11h8a4.5 4.5 0 0 1 0 9H14"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M19.2 21.4 23 25.2"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
