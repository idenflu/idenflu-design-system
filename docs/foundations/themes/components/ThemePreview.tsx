import * as React from "react";
import styles from "./ThemePreview.module.css";

type Role = "surface" | "background" | "border" | "text";
type Mode = "light" | "dark";

/** Full theme CSS variable names, keyed by semantic role (light.json / dark.json). */
const ROLES: { id: Role; label: string; tokens: readonly string[] }[] = [
  {
    id: "surface",
    label: "Surface",
    tokens: [
      "surface-00",
      "surface-on-00",
      "surface-on-00-hover",
      "surface-01",
      "surface-on-01",
      "surface-on-01-hover",
      "surface-02",
      "surface-on-02",
      "surface-on-02-hover",
      "surface-03",
      "surface-on-03",
      "surface-on-03-hover",
      "surface-transparent",
      "surface-overlay",
    ],
  },
  {
    id: "background",
    label: "Background",
    tokens: [
      "background-primary",
      "background-primary-hover",
      "background-primary-active",
      "background-primary-subtle",
      "background-primary-subtle-hover",
      "background-primary-tint",
      "background-neutral",
      "background-neutral-subtle",
      "background-neutral-subtle-hover",
      "background-neutral-tint",
      "background-neutral-strong",
      "background-neutral-strong-hover",
      "background-neutral-strong-active",
      "background-error",
      "background-error-hover",
      "background-error-active",
      "background-error-subtle",
      "background-error-subtle-hover",
      "background-error-tint",
      "background-success",
      "background-success-hover",
      "background-success-active",
      "background-success-subtle",
      "background-success-subtle-hover",
      "background-success-tint",
      "background-warning",
      "background-warning-hover",
      "background-warning-active",
      "background-warning-subtle",
      "background-warning-subtle-hover",
      "background-warning-tint",
      "background-info",
      "background-info-hover",
      "background-info-active",
      "background-info-subtle",
      "background-info-subtle-hover",
      "background-info-tint",
      "background-transparent",
      "background-transparent-hover",
      "background-transparent-active",
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
      "border-disabled",
      "border-focused",
      "border-error",
      "border-error-hover",
      "border-error-active",
      "border-brand",
      "border-brand-hover",
      "border-brand-active",
      "border-neutral",
      "border-neutral-hover",
      "border-neutral-active",
      "border-info",
      "border-info-hover",
      "border-info-active",
      "border-success",
      "border-success-hover",
      "border-success-active",
      "border-warning",
      "border-warning-hover",
      "border-warning-active",
    ],
  },
  {
    id: "text",
    label: "Text",
    tokens: [
      "text-brand",
      "text-brand-hover",
      "text-brand-active",
      "text-primary",
      "text-secondary",
      "text-muted",
      "text-on-color",
      "text-hover",
      "text-active",
      "text-disabled",
      "text-link",
      "text-link-hover",
      "text-link-active",
      "text-link-strong",
      "text-error",
      "text-error-hover",
      "text-error-active",
      "text-error-strong",
      "text-success",
      "text-success-hover",
      "text-success-active",
      "text-success-strong",
      "text-warning",
      "text-warning-hover",
      "text-warning-active",
      "text-warning-strong",
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
            <span className={styles.count}>{item.tokens.length}</span>
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
