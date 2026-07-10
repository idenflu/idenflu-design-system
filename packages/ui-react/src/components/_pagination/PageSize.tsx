import * as React from "react";

import { cn } from "@/utils/classNames";
import { PaginationSelect, type PaginationSelectOption } from "./PaginationSelect";
import styles from "./pagination.module.css";

export type PageSizeProps = {
  className?: string;
  disabled?: boolean;
  id: string;
  label?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: PaginationSelectOption[];
  value: string;
};

export function PageSize({
  className,
  disabled = false,
  id,
  label = "Rows per page",
  onChange,
  options,
  value,
}: PageSizeProps) {
  return (
    <div className={cn(styles.pageSize, className)}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <PaginationSelect
        disabled={disabled}
        id={id}
        onChange={onChange}
        options={options}
        selectSize="pageSize"
        value={value}
      />
    </div>
  );
}
