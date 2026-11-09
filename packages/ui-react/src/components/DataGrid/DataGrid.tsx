import type { DataGridColumn, DataGridProps as InternalDataGridProps } from "./data-grid";
export { DataGrid } from "./data-grid";
export type DataGridProps<T> = InternalDataGridProps<T> & {
  label: string;
  rows: readonly T[];
  columns: readonly DataGridColumn<T>[];
  getRowId: (row: T) => string;
};
