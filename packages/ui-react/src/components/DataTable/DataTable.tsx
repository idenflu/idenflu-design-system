import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/utils/classNames";
import {
  NextButton,
  PageSelect,
  PageSize,
  PrevButton,
  type PaginationSelectOption,
} from "../_pagination";
import paginationStyles from "../_pagination/pagination.module.css";
import styles from "./DataTable.module.css";
import { Typography, TypographyProps } from "../Typography/Typography";
import { Divider } from "../Divider";

type DataTableContextValue = {
  descriptionId: string;
  descriptionPresent: boolean;
  rowTotal: number | undefined;
  setDescriptionPresent: (present: boolean) => void;
  setRowTotal: (total: number | undefined) => void;
  setTitlePresent: (present: boolean) => void;
  titleId: string;
  titlePresent: boolean;
};

const DataTableContext = React.createContext<DataTableContextValue | null>(
  null
);

function useDataTableContext(component: string) {
  const context = React.useContext(DataTableContext);

  if (!context) {
    throw new Error(`${component} must be used within DataTable.`);
  }

  return context;
}

function useStableId() {
  return React.useId().replace(/:/g, "");
}

function resolveDataTablePageCount(
  rowTotal: number | undefined,
  pageSize: number | undefined
) {
  if (rowTotal === undefined || pageSize === undefined) {
    return 1;
  }

  if (pageSize >= rowTotal) {
    return 1;
  }

  return Math.max(1, Math.ceil(rowTotal / pageSize));
}

export type DataTableProps = React.ComponentPropsWithoutRef<"section"> & {
  /** Accessible name when no DataTable.Title is provided. */
  "aria-label"?: string;
};

export function DataTable({
  "aria-label": ariaLabel,
  children,
  className,
  ...props
}: DataTableProps) {
  const baseId = useStableId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;
  const [titlePresent, setTitlePresent] = React.useState(false);
  const [descriptionPresent, setDescriptionPresent] = React.useState(false);
  const [rowTotal, setRowTotal] = React.useState<number | undefined>(undefined);

  const labelledBy =
    [titlePresent ? titleId : null, descriptionPresent ? descriptionId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  if (!ariaLabel && !labelledBy) {
    console.warn(
      "DataTable: provide aria-label or include DataTable.Title for an accessible name."
    );
  }

  const contextValue = React.useMemo(
    () => ({
      descriptionId,
      descriptionPresent,
      rowTotal,
      setDescriptionPresent,
      setRowTotal,
      setTitlePresent,
      titleId,
      titlePresent,
    }),
    [descriptionId, descriptionPresent, rowTotal, titleId, titlePresent]
  );

  return (
    <DataTableContext.Provider value={contextValue}>
      <section
        aria-label={labelledBy ? undefined : ariaLabel}
        aria-labelledby={labelledBy}
        className={cn(styles.root, className)}
        {...props}
      >
        {children}
      </section>
    </DataTableContext.Provider>
  );
}

export type DataTableHeaderProps = React.ComponentPropsWithoutRef<"div">;

export function DataTableHeader({
  children,
  className,
  ...props
}: DataTableHeaderProps) {
  return (
    <div className={cn(styles.header, className)} {...props}>
      {children}
    </div>
  );
}

export type DataTableHeaderContentProps = React.ComponentPropsWithoutRef<"div">;

export function DataTableHeaderContent({
  children,
  className,
  ...props
}: DataTableHeaderContentProps) {
  return (
    <div className={cn(styles.headerContent, className)} {...props}>
      {children}
    </div>
  );
}

export type DataTableTitleProps = React.ComponentPropsWithoutRef<"span"> &
  TypographyProps;

export function DataTableTitle({
  children,
  className,
  component = "span",
  id,
  variant = "title-sm",
  ...props
}: DataTableTitleProps) {
  const context = useDataTableContext("DataTable.Title");
  const titleId = id ?? context.titleId;

  React.useEffect(() => {
    context.setTitlePresent(true);
    return () => {
      context.setTitlePresent(false);
    };
  }, [context]);

  return (
    <Typography
      component={component}
      id={titleId}
      className={cn(className)}
      variant={variant}
      {...props}
    >
      {children}
    </Typography>
  );
}

export type DataTableDescriptionProps = React.ComponentPropsWithoutRef<"p">;

export function DataTableDescription({
  children,
  className,
  id,
  ...props
}: DataTableDescriptionProps) {
  const context = useDataTableContext("DataTable.Description");
  const descriptionId = id ?? context.descriptionId;

  React.useEffect(() => {
    context.setDescriptionPresent(true);
    return () => {
      context.setDescriptionPresent(false);
    };
  }, [context]);

  return (
    <Typography
      component="p"
      className={cn(styles.description, className)}
      id={descriptionId}
      variant="body-sm"
      {...props}
    >
      {children}
    </Typography>
  );
}

export type DataTableActionsProps = React.ComponentPropsWithoutRef<"div">;

export function DataTableActions({
  children,
  className,
  ...props
}: DataTableActionsProps) {
  return (
    <div className={cn(styles.actions, className)} role="group" {...props}>
      {children}
    </div>
  );
}

export type DataTableColumn<TRow extends object> = {
  id: string;
  header: React.ReactNode;
  /** Field key used when `render` is not provided. */
  accessor?: keyof TRow & string;
  render?: (row: TRow, rowIndex: number) => React.ReactNode;
  headerProps?: Omit<React.ThHTMLAttributes<HTMLTableCellElement>, "children">;
  cellProps?: Omit<React.TdHTMLAttributes<HTMLTableCellElement>, "children">;
};

export type DataTableDensity = "lg" | "md" | "sm";

const tableClassName = cva(styles.table, {
  defaultVariants: {
    density: "md",
  },
  variants: {
    density: {
      lg: styles.densityLg,
      md: styles.densityMd,
      sm: styles.densitySm,
    },
  },
});

export type DataTableContentProps<TRow extends object> = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> & {
  columns: DataTableColumn<TRow>[];
  rows: TRow[];
  /** Total row count for pagination. Defaults to `rows.length`. */
  total?: number;
  density?: DataTableDensity;
  emptyMessage?: React.ReactNode;
  getRowId?: (row: TRow, rowIndex: number) => string;
};

function renderCellValue<TRow extends object>(
  row: TRow,
  rowIndex: number,
  column: DataTableColumn<TRow>
) {
  if (column.render) {
    return column.render(row, rowIndex);
  }

  if (!column.accessor) {
    return null;
  }

  const value = row[column.accessor];

  if (value == null) {
    return null;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return value as React.ReactNode;
}

export function DataTableContent<TRow extends object>({
  className,
  columns,
  density = "md",
  emptyMessage = "No items found.",
  getRowId,
  rows,
  total,
  ...props
}: DataTableContentProps<TRow>) {
  const context = useDataTableContext("DataTable.Content");
  const resolvedTotal = total ?? rows.length;

  React.useEffect(() => {
    context.setRowTotal(resolvedTotal);

    return () => {
      context.setRowTotal(undefined);
    };
  }, [context, resolvedTotal]);

  return (
    <div className={cn(styles.content, className)} {...props}>
      <table className={tableClassName({ density })}>
        <thead className={styles.tableHead}>
          <tr className={styles.tableRow}>
            {columns.map((column) => (
              <th
                key={column.id}
                className={styles.tableHeaderCell}
                scope="col"
                {...column.headerProps}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {rows.length === 0 ? (
            <tr className={styles.emptyRow}>
              <td className={styles.tableCell} colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                className={styles.tableRow}
                key={getRowId?.(row, rowIndex) ?? rowIndex}
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={styles.tableCell}
                    {...column.cellProps}
                  >
                    {renderCellValue(row, rowIndex, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export type DataTableFooterProps = React.ComponentPropsWithoutRef<"div">;

export function DataTableFooter({
  children,
  className,
  ...props
}: DataTableFooterProps) {
  return (
    <div className={cn(styles.footer, className)} {...props}>
      {children}
    </div>
  );
}

export type DataTableRowCountProps = React.ComponentPropsWithoutRef<"p"> & {
  itemLabel?: string;
  /** Defaults to the total registered by DataTable.Content. */
  total?: number;
};

export function DataTableRowCount({
  children,
  className,
  itemLabel = "items",
  total,
  ...props
}: DataTableRowCountProps) {
  const context = useDataTableContext("DataTable.RowCount");
  const resolvedTotal = total ?? context.rowTotal ?? 0;

  return (
    <p className={cn(styles.rowCount, className)} {...props}>
      {children ?? (
        <>
          {resolvedTotal} {itemLabel}
        </>
      )}
    </p>
  );
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export type DataTablePageSizeOption = number | PaginationSelectOption;

function normalizePageSizeOptions(
  options: DataTablePageSizeOption[]
): PaginationSelectOption[] {
  return options.map((option) =>
    typeof option === "number" ? { label: option, value: option } : option
  );
}

export type DataTablePaginationProps = {
  /** Accessible label for the pagination landmark. */
  "aria-label": string;
  className?: string;
  disabled?: boolean;
  /** 1-based current page index. */
  divider?: boolean;
  page: number;
  /** Defaults to a value derived from DataTable.Content total and pageSize. */
  pageCount?: number;
  onPageChange?: (page: number) => void;
  /** Current number of rows shown per page. Enables the page size selector when set. */
  pageSize?: number;
  /** Available page size values. Defaults to 10, 25, 50, 100. */
  pageSizeOptions?: DataTablePageSizeOption[];
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeLabel?: string;
  /** Visible label for the current page selector. */
  pageLabel?: string;
  /** Accessible name for the current page selector. */
  currentPageLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  showPageIndicator?: boolean;
  showPageSize?: boolean;
};

export function DataTablePagination({
  "aria-label": ariaLabel,
  className,
  disabled = false,
  divider = true,
  nextLabel = "Next page",
  onPageChange,
  onPageSizeChange,
  page,
  pageCount,
  pageSize,
  pageSizeLabel = "Rows per page",
  pageSizeOptions = [...DEFAULT_PAGE_SIZE_OPTIONS],
  pageLabel = "Page",
  currentPageLabel = "Current page",
  previousLabel = "Previous page",
  showPageIndicator = true,
  showPageSize,
}: DataTablePaginationProps) {
  const context = useDataTableContext("DataTable.Pagination");
  const pageSizeId = useStableId();
  const pageSelectId = useStableId();
  const pageSizeSelectOptions = React.useMemo(
    () => normalizePageSizeOptions(pageSizeOptions),
    [pageSizeOptions]
  );
  const resolvedPageSize =
    pageSize ??
    Number(pageSizeSelectOptions[0]?.value) ??
    DEFAULT_PAGE_SIZE_OPTIONS[0];
  const resolvedPageCount =
    pageCount ?? resolveDataTablePageCount(context.rowTotal, resolvedPageSize);

  const safePageCount = Math.max(1, resolvedPageCount);
  const currentPage = Math.min(Math.max(page, 1), safePageCount);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= safePageCount;
  const shouldShowPageSize =
    showPageSize ?? (pageSize !== undefined || onPageSizeChange !== undefined);

  React.useEffect(() => {
    if (pageCount === undefined && context.rowTotal === undefined) {
      console.warn(
        "DataTable.Pagination: provide pageCount or register row total via DataTable.Content."
      );
    }
  }, [context.rowTotal, pageCount]);

  const handlePrevious = () => {
    if (isFirstPage || disabled) {
      return;
    }

    onPageChange?.(currentPage - 1);
  };

  const handleNext = () => {
    if (isLastPage || disabled) {
      return;
    }

    onPageChange?.(currentPage + 1);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const nextPageSize = Number(event.target.value);

    if (!Number.isFinite(nextPageSize) || nextPageSize <= 0) {
      return;
    }

    onPageSizeChange?.(nextPageSize);
  };

  const handlePageSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const nextPage = Number(event.target.value);

    if (!Number.isFinite(nextPage) || nextPage < 1) {
      return;
    }

    onPageChange?.(nextPage);
  };

  const pageOptions = React.useMemo(
    () =>
      Array.from({ length: safePageCount }, (_, index) => {
        const pageNumber = index + 1;

        return {
          label: pageNumber,
          value: pageNumber,
        };
      }),
    [safePageCount]
  );

  return (
    <div className={cn(paginationStyles.pagination, className)}>
      {shouldShowPageSize && (
        <PageSize
          disabled={disabled}
          id={pageSizeId}
          label={pageSizeLabel}
          onChange={handlePageSizeChange}
          options={pageSizeSelectOptions}
          value={String(resolvedPageSize)}
        />
      )}
      {divider && (
        <Divider
          orientation="vertical"
          flexItem
          style={{
            borderColor: "var(--border-primary)",
          }}
        />
      )}
      <nav aria-label={ariaLabel} className={paginationStyles.pageNavigation}>
        <PrevButton
          disabled={disabled || isFirstPage}
          label={previousLabel}
          size="lg"
          onClick={handlePrevious}
        />
        {showPageIndicator ? (
          <PageSelect
            aria-label={currentPageLabel}
            disabled={disabled}
            id={pageSelectId}
            label={pageLabel}
            onChange={handlePageSelectChange}
            options={pageOptions}
            pageCount={safePageCount}
            value={String(currentPage)}
          />
        ) : null}
        <NextButton
          disabled={disabled || isLastPage}
          label={nextLabel}
          size="lg"
          onClick={handleNext}
        />
      </nav>
    </div>
  );
}

export type DataTableRowCountTextOptions = {
  itemLabel?: string;
  total: number;
};

DataTable.Header = DataTableHeader;
DataTable.HeaderContent = DataTableHeaderContent;
DataTable.Title = DataTableTitle;
DataTable.Description = DataTableDescription;
DataTable.Actions = DataTableActions;
DataTable.Content = DataTableContent;
DataTable.Footer = DataTableFooter;
DataTable.RowCount = DataTableRowCount;
DataTable.Pagination = DataTablePagination;
