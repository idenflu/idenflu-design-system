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

export const TableHead = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={classNames("if-table__head", className)} {...props} />
);

export const TableBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={classNames("if-table__body", className)} {...props} />
);

export const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={classNames("if-table__row", className)} {...props} />
);

export type TableHeaderCellProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  /** Header direction. Defaults to "col". */
  scope?: "col" | "row";
};

export const TableHeaderCell = ({ className, scope = "col", ...props }: TableHeaderCellProps) => (
  <th scope={scope} className={classNames("if-table__th", className)} {...props} />
);

export const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={classNames("if-table__td", className)} {...props} />
);
