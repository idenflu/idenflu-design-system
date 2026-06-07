import * as React from "react";
import { classNames } from "../utils/classNames";

export type TableDensity = "compact" | "comfortable" | "spacious";

export type TableProps = React.TableHTMLAttributes<HTMLTableElement> & {
  density?: TableDensity;
};

export const Table = ({ className, density = "comfortable", ...props }: TableProps) => (
  <div className="if-table-shell">
    <table className={classNames("if-table", `if-table--${density}`, className)} {...props} />
  </div>
);

export type TableEmptyRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  colSpan: number;
};

export const TableEmptyRow = ({ children, className, colSpan, ...props }: TableEmptyRowProps) => (
  <tr className={classNames("if-table__empty-row", className)} {...props}>
    <td colSpan={colSpan}>{children}</td>
  </tr>
);
