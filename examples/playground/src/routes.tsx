import { CATEGORIES } from "./categories";
import { Overview } from "./pages/Overview";
import { ButtonsSection } from "./pages/Buttons";
import { InputsSection } from "./pages/Inputs";
import { ControlsSection } from "./pages/Controls";
import { TagsSection } from "./pages/Tags";
import { FeedbackSection } from "./pages/Feedback";
import { DataSection } from "./pages/Data";
import { OverlaysSection } from "./pages/Overlays";
import { TabsSection } from "./pages/Tabs";
import { PatternsSection } from "./pages/Patterns";
import { IconsSection } from "./pages/Icons";

export type Route = { key: string; label: string; Component: () => JSX.Element };

const COMPONENTS: Record<string, () => JSX.Element> = {
  overview: Overview,
  buttons: ButtonsSection,
  inputs: InputsSection,
  controls: ControlsSection,
  tags: TagsSection,
  feedback: FeedbackSection,
  data: DataSection,
  overlays: OverlaysSection,
  tabs: TabsSection,
  patterns: PatternsSection,
  icons: IconsSection,
};

export const ROUTES: Route[] = CATEGORIES.map((c) => ({ ...c, Component: COMPONENTS[c.key] }));
