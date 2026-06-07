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

export const TableEmptyRow = ({ children, colSpan }: { children: React.ReactNode; colSpan: number }) => (
  <tr className="if-table__empty-row">
    <td colSpan={colSpan}>{children}</td>
  </tr>
);
