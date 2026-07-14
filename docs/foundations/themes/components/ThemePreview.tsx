import * as React from "react";
import styles from "./ThemePreview.module.css";

type Role = "surface" | "background" | "border" | "text";
type Mode = "light" | "dark";

const ROLES: { id: Role; label: string; tokens: readonly string[] }[] = [
  {
    id: "surface",
    label: "Surface",
    tokens: [
      "surface-00",
      "surface-01",
      "surface-02",
      "surface-03",
      "surface-overlay",
    ],
  },
  {
    id: "background",
    label: "Background",
    tokens: [
      "background-primary",
      "background-primary-subtle",
      "background-primary-tint",
      "background-neutral",
      "background-neutral-subtle",
      "background-error",
      "background-success",
      "background-warning",
      "background-info",
      "background-disabled",
    ],
  },
  {
    id: "border",
    label: "Border",
    tokens: [
      "border-primary",
      "border-subtle",
      "border-strong",
      "border-focused",
      "border-error",
      "border-brand",
      "border-disabled",
    ],
  },
  {
    id: "text",
    label: "Text",
    tokens: [
      "text-primary",
      "text-secondary",
      "text-muted",
      "text-disabled",
      "text-link",
      "text-error",
      "text-success",
      "text-warning",
      "text-brand",
      "text-on-color",
    ],
  },
];

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.cssText = "position:fixed;left:-9999px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      return ok;
    } catch {
      return false;
    }
  }
}

function RoleSwatch({ token, role }: { token: string; role: Role }) {
  const cssVar = `--${token}`;
  const [copied, setCopied] = React.useState(false);
  const resetTimer = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (resetTimer.current != null) {
        window.clearTimeout(resetTimer.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    const ok = await copyText(`var(${cssVar})`);
    if (!ok) return;
    setCopied(true);
    if (resetTimer.current != null) {
      window.clearTimeout(resetTimer.current);
    }
    resetTimer.current = window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      className={styles.swatch}
      onClick={handleCopy}
      aria-label={`Copy ${cssVar}`}
    >
      {role === "text" ? (
        <span className={styles.chipText} style={{ color: `var(${cssVar})` }}>
          Aa
        </span>
      ) : role === "border" ? (
        <span
          className={styles.chip}
          style={{
            background: "var(--surface-00)",
            borderWidth: 2,
            borderColor: `var(${cssVar})`,
          }}
        />
      ) : (
        <span
          className={styles.chip}
          style={{ background: `var(${cssVar})` }}
        />
      )}
      <span className={styles.meta}>
        <code className={styles.token}>{token}</code>
        <code className={styles.status}>{copied ? "Copied" : cssVar}</code>
      </span>
    </button>
  );
}

export function ThemePreview() {
  const [mode, setMode] = React.useState<Mode>("light");
  const [role, setRole] = React.useState<Role>("surface");
  const active = ROLES.find((item) => item.id === role) ?? ROLES[0];

  return (
    <section className={`sb-unstyled ${styles.preview}`} aria-label="Theme roles">
      <div className={styles.toolbar}>
        <p className={styles.hint}>
          Light/Dark를 전환하고 역할별 토큰을 클릭해 CSS 변수를 복사합니다.
        </p>
        <div className={styles.modeToggle} role="group" aria-label="Color mode">
          <button
            type="button"
            className={styles.modeButton}
            aria-pressed={mode === "light"}
            onClick={() => setMode("light")}
          >
            Light
          </button>
          <button
            type="button"
            className={styles.modeButton}
            aria-pressed={mode === "dark"}
            onClick={() => setMode("dark")}
          >
            Dark
          </button>
        </div>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Semantic role">
        {ROLES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            className={styles.tab}
            aria-selected={item.id === role}
            onClick={() => setRole(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        className={`${styles.stage}${mode === "dark" ? " dark" : ""}`}
        role="tabpanel"
      >
        <div className={styles.grid}>
          {active.tokens.map((token) => (
            <RoleSwatch key={token} token={token} role={active.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
