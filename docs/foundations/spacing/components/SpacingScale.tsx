import * as React from "react";
import tokens from "@idenflu/ui-tokens";
import styles from "./SpacingScale.module.css";

const SPACING_TOKENS = [
  "spacing-01",
  "spacing-02",
  "spacing-03",
  "spacing-04",
  "spacing-05",
  "spacing-06",
  "spacing-07",
  "spacing-08",
  "spacing-09",
  "spacing-10",
  "spacing-11",
  "spacing-12",
  "spacing-13",
  "spacing-14",
  "spacing-15",
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

function SpacingRow({ token }: { token: string }) {
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
    <div className={styles.row}>
      <code className={styles.token} title={cssVar}>
        {token}
      </code>
      <code className={styles.value}>{value}</code>
      <button
        type="button"
        className={styles.barButton}
        onClick={handleCopy}
        aria-label={`Copy ${cssVar} (${value})`}
      >
        <span className={styles.bar} style={{ width: value || 0 }} />
        {copied ? <span className={styles.copied}>Copied</span> : null}
      </button>
    </div>
  );
}

export function SpacingScale() {
  return (
    <section
      className={`sb-unstyled ${styles.scale}`}
      aria-label="Spacing scale"
    >
      {SPACING_TOKENS.map((token) => (
        <SpacingRow key={token} token={token} />
      ))}
    </section>
  );
}
