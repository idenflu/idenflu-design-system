import * as React from "react";
import { Button } from "../Button";
import styles from "./Slides.module.css";
export type SlidesProps = {
  slides: React.ReactNode[];
  label?: string;
  initialIndex?: number;
};
export function Slides({ slides, label = "슬라이드", initialIndex = 0 }: SlidesProps) {
  const [index, setIndex] = React.useState(initialIndex);
  const safe = Math.max(0, Math.min(index, slides.length - 1));
  if (!slides.length) return null;
  return <section className={styles.root} aria-label={label} aria-roledescription="슬라이드 모음">
    <div aria-live="polite">{safe + 1} / {slides.length}</div>
    <div>{slides[safe]}</div>
    <div className={styles.actions}><Button variant="outlined" disabled={safe === 0} onClick={() => setIndex(safe - 1)}>이전</Button><Button variant="outlined" disabled={safe === slides.length - 1} onClick={() => setIndex(safe + 1)}>다음</Button></div>
  </section>;
}
