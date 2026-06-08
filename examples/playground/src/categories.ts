// 순수 네비게이션 메타데이터. 컴포넌트 import 없음 → 순환 의존 회피.
export type Category = { key: string; label: string };

export const CATEGORIES: Category[] = [
  { key: "overview", label: "Overview" },
  { key: "buttons", label: "Buttons" },
  { key: "inputs", label: "Inputs" },
  { key: "controls", label: "Controls" },
  { key: "tags", label: "Tags & identity" },
  { key: "feedback", label: "Feedback" },
  { key: "data", label: "Data & surfaces" },
  { key: "overlays", label: "Navigation & overlays" },
  { key: "tabs", label: "Tabs" },
  { key: "patterns", label: "Patterns" },
  { key: "icons", label: "Icons" },
];
