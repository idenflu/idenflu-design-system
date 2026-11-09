import * as React from "react";
import { cn } from "../../utils/classNames";
import styles from "./Pagination.module.css";

export type PaginationProps = Omit<React.HTMLAttributes<HTMLElement>, "onChange"> & {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  previousLabel?: string;
  nextLabel?: string;
  pageLabel?: (page: number) => string;
};

export function Pagination({ page, pageCount, onPageChange, previousLabel = "이전", nextLabel = "다음", pageLabel = (value) => `${value}페이지`, className, "aria-label": label = "페이지 탐색", ...props }: PaginationProps) {
  const count = Math.max(1, Number.isFinite(pageCount) ? Math.floor(pageCount) : 1);
  const current = Math.min(count, Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1));
  const pages = Array.from(new Set([1, count, current - 1, current, current + 1].filter((value) => value >= 1 && value <= count))).sort((a, b) => a - b);
  return <nav {...props} aria-label={label} className={cn(styles.root, className)}>
    <button type="button" disabled={current === 1} onClick={() => onPageChange(current - 1)}>{previousLabel}</button>
    {pages.map((value, index) => <React.Fragment key={value}>
      {index > 0 && value - pages[index - 1] > 1 && <span aria-hidden="true">…</span>}
      <button type="button" aria-current={value === current ? "page" : undefined} aria-label={pageLabel(value)} onClick={() => onPageChange(value)}>{value}</button>
    </React.Fragment>)}
    <button type="button" disabled={current === count} onClick={() => onPageChange(current + 1)}>{nextLabel}</button>
  </nav>;
}
