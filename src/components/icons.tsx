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
    <img
      src="/logo.png"
      alt="Click"
      className={`${className ?? ""} rounded-lg object-cover`}
    />
  );
}
