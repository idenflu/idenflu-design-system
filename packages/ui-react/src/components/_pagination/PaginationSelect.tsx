import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/utils/classNames";
import { Icon } from "../Icon/Icon";
import styles from "./PaginationSelect.module.css";

export type PaginationSelectOption = {
  label: React.ReactNode;
  value: string | number;
};

export type PaginationSelectSize = "page" | "pageSize";

export type PaginationSelectProps = Omit<
  React.ComponentPropsWithoutRef<"select">,
  "children" | "size"
> & {
  options: PaginationSelectOption[];
  selectSize?: PaginationSelectSize;
};

const paginationSelectClassName = cva(styles.control, {
  defaultVariants: {
    selectSize: "page",
  },
  variants: {
    selectSize: {
      page: styles.sizePage,
      pageSize: styles.sizePageSize,
    },
  },
});

const paginationSelectRootClassName = cva(styles.root, {
  defaultVariants: {
    selectSize: "page",
  },
  variants: {
    selectSize: {
      page: styles.sizePage,
      pageSize: styles.sizePageSize,
    },
  },
});

export function PaginationSelect({
  className,
  options,
  selectSize = "page",
  ...props
}: PaginationSelectProps) {
  return (
    <div className={paginationSelectRootClassName({ selectSize })}>
      <select
        className={cn(paginationSelectClassName({ selectSize }), className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon
        aria-hidden="true"
        className={styles.expandIcon}
        name="keyboard-arrow-down"
        size={16}
      />
    </div>
  );
}
