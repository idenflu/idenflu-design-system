import * as React from "react";
import { Section } from "../Section";
import { CATEGORIES } from "../categories";

export function Overview() {
  const categories = CATEGORIES.filter((c) => c.key !== "overview");
  return (
    <Section id="overview" title="Overview">
      <p className="pg-section-note">
        @idenflu/ui-react 컴포넌트를 카테고리별로 보여주는 로컬 플레이그라운드입니다. source-only 패키지를 Vite로 직접 소비합니다.
        왼쪽에서 카테고리를 고르거나 아래 카드를 클릭하세요.
      </p>
      <div className="pg-overview-grid">
        {categories.map((c) => (
          <a key={c.key} href={`#/${c.key}`} className="pg-overview-card">
            <strong>{c.label}</strong>
            <span>#/{c.key}</span>
          </a>
        ))}
      </div>
    </Section>
  );
}
