import * as React from "react";
import tokens from "@idenflu/ui-tokens";
import styles from "./RadiusPreview.module.css";

const RADIUS_TOKENS = [
  "rounded-none",
  "rounded-sm",
  "rounded-md",
  "rounded-lg",
  "rounded-full",
] as const;

const tokenMap = tokens as Record<string, string | number>;

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

function RadiusCard({ token }: { token: string }) {
  const value = String(tokenMap[token] ?? "");
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
      className={styles.card}
      onClick={handleCopy}
      aria-label={`Copy ${cssVar} (${value})`}
    >
      <span
        className={styles.sample}
        style={{ borderRadius: `var(${cssVar})` }}
      />
      <span className={styles.meta}>
        <code className={styles.token}>{token}</code>
        <code className={styles.value}>{copied ? "Copied" : value}</code>
      </span>
    </button>
  );
}

export function RadiusPreview() {
  return (
    <section
      className={`sb-unstyled ${styles.preview}`}
      aria-label="Border radius"
    >
      <div className={styles.grid}>
        {RADIUS_TOKENS.map((token) => (
          <RadiusCard key={token} token={token} />
        ))}
      </div>
    </section>
  );
}
