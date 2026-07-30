import * as React from "react";
import { iconNames, type IconName } from "@idenflu/ui-icons";
import spriteUrl from "@idenflu/ui-icons/icons.svg?url";
import { Icon, IconSpriteProvider, type IconSize } from "@idenflu/ui-react";
import styles from "./IconGallery.module.css";

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

function IconCard({ name, size }: { name: IconName; size: IconSize }) {
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
    const ok = await copyText(name);
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
      aria-label={`Copy icon name ${name}`}
    >
      <Icon name={name} size={size} />
      <code className={styles.name}>{copied ? "Copied" : name}</code>
    </button>
  );
}

export function IconGallery() {
  const [query, setQuery] = React.useState("");

  const filtered = (() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...iconNames];
    return iconNames.filter((name) => name.includes(q));
  })();

  return (
    <IconSpriteProvider href={spriteUrl}>
      <section
        className={`sb-unstyled ${styles.gallery}`}
        aria-label="Icon gallery"
      >
        <div className={styles.toolbar}>
          <input
            type="search"
            className={styles.search}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search icons…"
            aria-label="Search icons"
          />
        </div>
        {filtered.length === 0 ? (
          <p className={styles.empty}>일치하는 아이콘이 없습니다.</p>
        ) : (
          <div className={styles.grid}>
            {filtered.map((name) => (
              <IconCard key={name} name={name} size="medium" />
            ))}
          </div>
        )}
      </section>
    </IconSpriteProvider>
  );
}
