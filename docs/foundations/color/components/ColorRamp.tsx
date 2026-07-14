import * as React from "react";
import tokens from "@idenflu/ui-tokens";
import styles from "./ColorRamp.module.css";

const LEVELS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

const tokenMap = tokens as Record<string, string | number>;

export type ColorRampProps = {
  /** First token segment, e.g. `base` → `--base-blue-500`, `brand` → `--brand-500` */
  prefix: string;
  /** Second segment when present, e.g. `blue` with prefix `base` → `--base-blue-500` */
  family?: string;
  label: string;
  levels?: readonly number[];
};

function tokenKey(prefix: string, family: string | undefined, level: number) {
  return family ? `${prefix}-${family}-${level}` : `${prefix}-${level}`;
}

function displayName(prefix: string, family?: string) {
  const raw = family ?? prefix;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function lookupToken(token: string): string {
  const value = tokenMap[token];
  if (value == null) return "";
  return String(value);
}

function toCopyableHex(cssColor: string): string {
  if (!cssColor) return "";
  if (cssColor.startsWith("#")) {
    return cssColor.length === 4
      ? `#${cssColor[1]}${cssColor[1]}${cssColor[2]}${cssColor[2]}${cssColor[3]}${cssColor[3]}`.toUpperCase()
      : cssColor.toUpperCase();
  }

  const match = cssColor.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i
  );
  if (!match) return cssColor;

  const r = Math.round(Number(match[1]));
  const g = Math.round(Number(match[2]));
  const b = Math.round(Number(match[3]));
  const a = match[4] === undefined ? 1 : Number(match[4]);

  const hex = `#${[r, g, b]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;

  if (a < 1) {
    return `${hex} @ ${Math.round(a * 100)}%`;
  }
  return hex;
}

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

function Swatch({ token, label }: { token: string; label: string }) {
  const cssVar = `--${token}`;
  const rawValue = lookupToken(token);
  const hex = toCopyableHex(rawValue) || rawValue;
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
    if (!hex) return;
    const payload = hex.includes(" @ ") ? hex.split(" @ ")[0] : hex;
    const ok = await copyText(payload);
    if (!ok) return;
    setCopied(true);
    if (resetTimer.current != null) {
      window.clearTimeout(resetTimer.current);
    }
    resetTimer.current = window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className={`sb-unstyled ${styles.swatch}`}>
      <button
        type="button"
        className={styles.chipButton}
        style={{ background: rawValue || `var(${cssVar})` }}
        onClick={handleCopy}
        aria-label={
          hex ? `Copy ${hex} (${cssVar})` : `Copy color for ${cssVar}`
        }
      >
        <code className={styles.chipOverlay} aria-hidden="true">
          {copied ? "Copied" : hex || "Copy"}
        </code>
      </button>
      <div className={styles.meta}>
        <code className={styles.label} title={cssVar}>
          {label}
        </code>
      </div>
    </div>
  );
}

export function ColorRamp({
  prefix,
  family,
  label,
  levels = LEVELS,
}: ColorRampProps) {
  const name = displayName(prefix, family);

  return (
    <section
      className={`sb-unstyled ${styles.ramp}`}
      aria-label={`${label} color ramp`}
    >
      <h4 className={styles.heading}>{label}</h4>
      <div className={styles.row}>
        {levels.map((level) => (
          <Swatch
            key={level}
            label={`${name} ${level}`}
            token={tokenKey(prefix, family, level)}
          />
        ))}
      </div>
    </section>
  );
}

export function SolidSwatch({
  token,
  label,
}: {
  token: string;
  label: string;
}) {
  return (
    <div className={styles.solid}>
      <Swatch label={label} token={token} />
    </div>
  );
}

export function SemanticTokenGrid({
  title,
  tokens: tokenNames,
}: {
  title: string;
  tokens: readonly string[];
}) {
  return (
    <section className={`sb-unstyled ${styles.ramp}`} aria-label={title}>
      <h4 className={styles.heading}>{title}</h4>
      <p className={styles.hint}>Hover a swatch to see hex · click to copy</p>
      <div className={styles.semanticGrid}>
        {tokenNames.map((token) => (
          <Swatch key={token} label={token} token={token} />
        ))}
      </div>
    </section>
  );
}
