import * as React from "react";
import { IconSpriteProvider, SegmentedControl } from "@idenflu/ui-react";
import spriteUrl from "@idenflu/ui-icons/icons.svg?url";
import { useHashRoute } from "./useHashRoute";
import { ROUTES } from "./routes";

type Theme = "light" | "dark";

export function App() {
  const [theme, setTheme] = React.useState<Theme>("light");
  const route = useHashRoute();

  React.useEffect(() => {
    document.documentElement.setAttribute("data-if-theme", theme);
  }, [theme]);

  const active = ROUTES.find((r) => r.key === route) ?? ROUTES[0];
  const ActiveComponent = active.Component;

  return (
    <IconSpriteProvider href={spriteUrl}>
      <div className="pg-shell">
        <nav className="pg-nav" aria-label="Categories">
          <div className="pg-nav__brand">
            <strong>idenflu ui-react</strong>
            <span>플레이그라운드</span>
          </div>
          <ul className="pg-nav__list">
            {ROUTES.map((r) => (
              <li key={r.key}>
                <a
                  href={`#/${r.key}`}
                  className={r.key === active.key ? "pg-nav__link is-active" : "pg-nav__link"}
                  aria-current={r.key === active.key ? "page" : undefined}
                >
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="pg-nav__theme">
            <SegmentedControl
              label="Theme"
              size="small"
              value={theme}
              onChange={(v) => setTheme(v as Theme)}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
            />
          </div>
        </nav>
        <main className="pg-main">
          <ActiveComponent />
        </main>
      </div>
    </IconSpriteProvider>
  );
}
