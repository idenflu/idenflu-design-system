import * as React from "react";

import { cn } from "../../utils/classNames";
import { PaginationSelect, type PaginationSelectOption } from "./PaginationSelect";
import styles from "./pagination.module.css";

export type PageSelectProps = {
  "aria-label"?: string;
  className?: string;
  disabled?: boolean;
  id: string;
  label?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: PaginationSelectOption[];
  pageCount: number;
  value: string;
};

export function PageSelect({
  "aria-label": ariaLabel,
  className,
  disabled = false,
  id,
  label = "Page",
  onChange,
  options,
  pageCount,
  value,
}: PageSelectProps) {
  return (
    <div className={cn(styles.pageSelector, className)}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <PaginationSelect
        aria-label={ariaLabel}
        disabled={disabled}
        id={id}
        onChange={onChange}
        options={options}
        selectSize="page"
        value={value}
      />
      <span aria-hidden="true" className={styles.pageCountSuffix}>
        of{" "}
        <span className={styles.pageCountValue}>{pageCount}</span>
      </span>
    </div>
  );
}
