import * as React from "react";

export function Example({ title, code, children }: { title?: string; code: string; children: React.ReactNode }) {
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    void navigator.clipboard?.writeText(code);
    setCopied(true);
  };

  React.useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <div className="pg-example">
      {title ? <div className="pg-example__title">{title}</div> : null}
      <div className="pg-example__preview">{children}</div>
      <div className="pg-example__codewrap">
        <button type="button" className="pg-example__copy" onClick={copy}>
          {copied ? "복사됨" : "복사"}
        </button>
        <pre className="pg-example__code"><code>{code}</code></pre>
      </div>
    </div>
  );
}
