import { BookOpen, Compass, CreditCard, FileText, LifeBuoy, MonitorPlay, Package, Users, type LucideProps } from "lucide-react";
import type { CategoryIcon as Icon } from "@/lib/categories";

const ICONS = {
  help: LifeBuoy,
  monitor: MonitorPlay,
  users: Users,
  compass: Compass,
  file: FileText,
  package: Package,
  card: CreditCard,
  book: BookOpen,
} satisfies Record<Icon, unknown>;

export function CategoryIcon({ icon, ...props }: { icon: Icon } & LucideProps) {
  const Component = ICONS[icon] ?? BookOpen;
  return <Component aria-hidden {...props} />;
}
