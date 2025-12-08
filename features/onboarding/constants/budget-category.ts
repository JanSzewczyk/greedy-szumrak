import { type IconName } from "lucide-react/dynamic";

interface CategoryIcon {
  id: IconName;
  label: string;
}

export const CATEGORY_ICONS: CategoryIcon[] = [
  { id: "home", label: "Home" },
  { id: "shopping-cart", label: "Shopping" },
  { id: "car", label: "Transport" },
  { id: "utensils", label: "Food" },
  { id: "heart", label: "Health" },
  { id: "graduation-cap", label: "Education" },
  { id: "film", label: "Entertainment" },
  { id: "music", label: "Music" },
  { id: "gift", label: "Gifts" },
  { id: "briefcase", label: "Work" },
  { id: "piggy-bank", label: "Savings" },
  { id: "trending-up", label: "Investments" },
  { id: "plane", label: "Travel" },
  { id: "smartphone", label: "Tech" },
  { id: "zap", label: "Utilities" },
  { id: "coffee", label: "Coffee" }
];

export const CATEGORY_COLORS = [
  { id: "#ef4444", label: "Red" },
  { id: "#f97316", label: "Orange" },
  { id: "#f59e0b", label: "Amber" },
  { id: "#eab308", label: "Yellow" },
  { id: "#84cc16", label: "Lime" },
  { id: "#22c55e", label: "Green" },
  { id: "#10b981", label: "Emerald" },
  { id: "#14b8a6", label: "Teal" },
  { id: "#06b6d4", label: "Cyan" },
  { id: "#0ea5e9", label: "Sky" },
  { id: "#3b82f6", label: "Blue" },
  { id: "#6366f1", label: "Indigo" },
  { id: "#8b5cf6", label: "Violet" },
  { id: "#a855f7", label: "Purple" },
  { id: "#d946ef", label: "Fuchsia" },
  { id: "#ec4899", label: "Pink" }
];
