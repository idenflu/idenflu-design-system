import * as React from "react";
import tokens from "@idenflu/ui-tokens";
import styles from "./TypeSpecimen.module.css";

type Category = "heading" | "title" | "body" | "label" | "caption" | "numeric";

const CATEGORIES: { id: Category; label: string; tokens: readonly string[] }[] =
  [
    {
      id: "heading",
      label: "Heading",
      tokens: ["heading-lg", "heading-md", "heading-sm"],
    },
    {
      id: "title",
      label: "Title",
      tokens: ["title-lg", "title-md", "title-sm"],
    },
    {
      id: "body",
      label: "Body",
      tokens: ["body-lg", "body-md", "body-sm"],
    },
    {
      id: "label",
      label: "Label",
      tokens: ["label-lg", "label-md"],
    },
    {
      id: "caption",
      label: "Caption",
      tokens: ["caption-lg", "caption-md"],
    },
    {
      id: "numeric",
      label: "Numeric",
      tokens: [
        "numeric-xl",
        "numeric-lg",
        "numeric-md",
        "numeric-sm",
        "numeric-xs",
      ],
    },
  ];

const SAMPLE: Record<Category, string> = {
  heading: "화면 상태를 빠르게 판단합니다",
  title: "승인 대기 · 변경 이력",
  body: "본문은 한국어와 영어 메타데이터가 안정적으로 섞이도록 설계합니다.",
  label: "필드 레이블",
  caption: "보조 설명 · 헬퍼 텍스트",
  numeric: "1,234,567.89",
};

const tokenMap = tokens as Record<string, string | number>;

function parseTypeSpec(shorthand: string): string {
  // e.g. "600 36px/44px 'Noto Sans KR', ..."
  const match = shorthand.match(/^(\d+)\s+(\d+px)\/(\d+px)/);
  if (!match) return shorthand;
  return `${match[2]} / ${match[1]} / ${match[3]}`;
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

function TypeRow({ token, category }: { token: string; category: Category }) {
  const cssVar = `--${token}`;
  const shorthand = String(tokenMap[token] ?? "");
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
      <div className={styles.meta}>
        <code className={styles.token}>{token}</code>
        <code className={styles.spec}>
          {copied ? "Copied" : parseTypeSpec(shorthand)}
        </code>
      </div>
      <button
        type="button"
        className={styles.sampleButton}
        style={{
          font: `var(${cssVar})`,
          fontVariantNumeric:
            category === "numeric" ? "tabular-nums" : undefined,
        }}
        onClick={handleCopy}
        aria-label={`Copy ${cssVar}`}
      >
        {SAMPLE[category]}
      </button>
      <code className={styles.spec}>{cssVar}</code>
    </div>
  );
}

export function TypeSpecimen() {
  const [category, setCategory] = React.useState<Category>("heading");
  const active =
    CATEGORIES.find((item) => item.id === category) ?? CATEGORIES[0];

  return (
    <section
      className={`sb-unstyled ${styles.specimen}`}
      aria-label="Type specimen"
    >
      <div className={styles.tabs} role="tablist" aria-label="Type category">
        {CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            className={styles.tab}
            aria-selected={item.id === category}
            onClick={() => setCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.list} role="tabpanel">
        {active.tokens.map((token) => (
          <TypeRow key={token} token={token} category={active.id} />
        ))}
      </div>
    </section>
  );
}
