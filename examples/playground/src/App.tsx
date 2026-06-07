import * as React from "react";
import { IconSpriteProvider, SegmentedControl } from "@idenflu/ui-react";
import spriteUrl from "@idenflu/ui-icons/icons.svg?url";
import { ButtonsSection } from "./sections/Buttons";
import { InputsSection } from "./sections/Inputs";
import { ControlsSection } from "./sections/Controls";
import { TagsSection } from "./sections/Tags";
import { FeedbackSection } from "./sections/Feedback";
import { DataSection } from "./sections/Data";
import { OverlaysSection } from "./sections/Overlays";
import { TabsSection } from "./sections/Tabs";
import { PatternsSection } from "./sections/Patterns";
import { IconsSection } from "./sections/Icons";

type Theme = "light" | "dark";

export function App() {
  const [theme, setTheme] = React.useState<Theme>("light");

  React.useEffect(() => {
    document.documentElement.setAttribute("data-if-theme", theme);
  }, [theme]);

  return (
    <IconSpriteProvider href={spriteUrl}>
      <div className="pg-shell">
        <header className="pg-topbar">
          <div>
            <h1>idenflu ui-react</h1>
            <p>로컬 플레이그라운드 — source-only 패키지를 Vite로 직접 소비합니다.</p>
          </div>
          <SegmentedControl
            label="Theme"
            value={theme}
            onChange={(v) => setTheme(v as Theme)}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
        </header>

        <ButtonsSection />
        <InputsSection />
        <ControlsSection />
        <TagsSection />
        <FeedbackSection />
        <DataSection />
        <OverlaysSection />
        <TabsSection />
        <PatternsSection />
        <IconsSection />
      </div>
    </IconSpriteProvider>
  );
}
