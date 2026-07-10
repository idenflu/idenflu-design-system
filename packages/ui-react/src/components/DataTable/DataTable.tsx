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
import { Icon } from "../Icon/Icon";
import { IconButton } from "../IconButton/IconButton";
import { TextInput } from "../TextInput/TextInput";
import { type ButtonColor } from "../Button/Button";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

type DataTableSearchFilterFn = (row: object, query: string) => boolean;

type DataTableContextValue = {
  descriptionId: string;
  descriptionPresent: boolean;
  page: number;
  pageSize: number;
  rowTotal: number | undefined;
  searchFilterFn: DataTableSearchFilterFn | undefined;
  searchQuery: string;
  setDescriptionPresent: (present: boolean) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setRowTotal: (total: number | undefined) => void;
  setSearchFilterFn: (filterFn: DataTableSearchFilterFn | undefined) => void;
  setSearchQuery: (query: string) => void;
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
  pageSize: number
) {
  if (rowTotal === undefined) {
    return 1;
  }

  if (pageSize >= rowTotal) {
    return 1;
  }

  return Math.max(1, Math.ceil(rowTotal / pageSize));
}

function isManualPagination(
  manualPagination: boolean | undefined,
  total: number | undefined,
  rowCount: number
) {
  if (manualPagination !== undefined) {
    return manualPagination;
  }

  return total !== undefined && total > rowCount;
}

function sliceRowsForPage<TRow>(
  rows: TRow[],
  page: number,
  pageSize: number,
  rowTotal: number
) {
  if (pageSize >= rowTotal) {
    return { rows, startIndex: 0 };
  }

  const startIndex = (page - 1) * pageSize;

  return {
    rows: rows.slice(startIndex, startIndex + pageSize),
    startIndex,
  };
}

function defaultRowSearchFilter(row: object, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return Object.values(row).some((value) => {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value).toLowerCase().includes(normalized);
    }

    return false;
  });
}

export type DataTableProps = React.ComponentPropsWithoutRef<"section"> & {
  /** Accessible name when no DataTable.Title is provided. */
  "aria-label"?: string;
  /** Initial page for client (uncontrolled) pagination. Defaults to 1. */
  defaultPage?: number;
  /** Initial page size for client (uncontrolled) pagination. Defaults to 10. */
  defaultPageSize?: number;
};

export function DataTable({
  "aria-label": ariaLabel,
  children,
  className,
  defaultPage = 1,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  ...props
}: DataTableProps) {
  const baseId = useStableId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;
  const [titlePresent, setTitlePresent] = React.useState(false);
  const [descriptionPresent, setDescriptionPresent] = React.useState(false);
  const [rowTotal, setRowTotal] = React.useState<number | undefined>(undefined);
  const [page, setPage] = React.useState(defaultPage);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchFilterFn, setSearchFilterFnState] = React.useState<
    DataTableSearchFilterFn | undefined
  >(undefined);

  const setSearchFilterFn = React.useCallback(
    (filterFn: DataTableSearchFilterFn | undefined) => {
      setSearchFilterFnState(() => filterFn);
    },
    []
  );

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
      page,
      pageSize,
      rowTotal,
      searchFilterFn,
      searchQuery,
      setDescriptionPresent,
      setPage,
      setPageSize,
      setRowTotal,
      setSearchFilterFn,
      setSearchQuery,
      setTitlePresent,
      titleId,
      titlePresent,
    }),
    [
      descriptionId,
      descriptionPresent,
      page,
      pageSize,
      rowTotal,
      searchFilterFn,
      searchQuery,
      titleId,
      titlePresent,
    ]
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

export type DataTableInstantSearchProps = {
  className?: string;
  /** Accessible name for the search icon button. */
  color?: ButtonColor;
  label?: string;
  placeholder?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * Custom row matcher. Defaults to case-insensitive includes across
   * string/number/boolean fields.
   */
  filterFn?: <TRow extends object>(row: TRow, query: string) => boolean;
  size?: "sm" | "md" | "lg";
};

export function DataTableInstantSearch({
  className,
  color = "neutral",
  defaultOpen = false,
  defaultValue = "",
  filterFn,
  label = "Search",
  onOpenChange,
  onValueChange,
  open: openProp,
  placeholder = "Search",
  size = "sm",
  value: valueProp,
}: DataTableInstantSearchProps) {
  const { setPage, setSearchFilterFn, setSearchQuery } = useDataTableContext(
    "DataTable.InstantSearch"
  );
  const inputRef = React.useRef<HTMLInputElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const isOpenControlled = openProp !== undefined;
  const isValueControlled = valueProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);

  const open = isOpenControlled ? openProp : uncontrolledOpen;
  const value = isValueControlled ? valueProp : uncontrolledValue;

  React.useEffect(() => {
    if (!filterFn) {
      setSearchFilterFn(undefined);
      return;
    }

    const boundFilter: DataTableSearchFilterFn = (row, query) =>
      filterFn(row, query);

    setSearchFilterFn(boundFilter);

    return () => {
      setSearchFilterFn(undefined);
    };
  }, [filterFn, setSearchFilterFn]);

  React.useEffect(() => {
    setSearchQuery(value);

    return () => {
      setSearchQuery("");
    };
  }, [setSearchQuery, value]);

  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const setOpen = (nextOpen: boolean) => {
    if (!isOpenControlled) {
      setUncontrolledOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  const commitValue = (nextValue: string) => {
    if (!isValueControlled) {
      setUncontrolledValue(nextValue);
    }

    setSearchQuery(nextValue);
    setPage(1);
    onValueChange?.(nextValue);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    commitValue("");
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    commitValue(event.target.value);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const nextTarget = event.relatedTarget;

    if (nextTarget instanceof Node && rootRef.current?.contains(nextTarget)) {
      return;
    }

    if (!event.currentTarget.value.trim()) {
      setOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleClose();
    }
  };

  const sizeClassName =
    size === "lg"
      ? styles.instantSearchSizeLg
      : size === "md"
        ? styles.instantSearchSizeMd
        : undefined;

  return (
    <div
      ref={rootRef}
      className={cn(
        styles.instantSearch,
        sizeClassName,
        open && styles.instantSearchExpanded,
        className
      )}
    >
      <IconButton
        aria-expanded={open}
        aria-hidden={open || undefined}
        className={cn(
          styles.instantSearchButton,
          open && styles.instantSearchLayerHidden
        )}
        color={color}
        icon={<Icon name="search" />}
        label={label}
        onClick={handleOpen}
        size={size}
        tabIndex={open ? -1 : undefined}
        variant="ghost"
      />
      <div
        className={cn(
          styles.instantSearchField,
          !open && styles.instantSearchLayerHidden
        )}
      >
        <TextInput
          ref={inputRef}
          aria-hidden={!open || undefined}
          aria-label={label}
          clearable
          fullWidth
          onBlur={handleBlur}
          onChange={handleChange}
          onClear={handleClose}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          size={size}
          startAdornment={<Icon name="search" />}
          tabIndex={open ? undefined : -1}
          type="text"
          value={value}
          variant="outlined"
        />
      </div>
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
  /**
   * Total row count. Defaults to `rows.length`.
   * Pass the full dataset size when using server pagination.
   */
  total?: number;
  /**
   * When true, rows are treated as the current server page and are not sliced
   * or filtered by InstantSearch. Defaults to detecting server pagination when
   * `total` exceeds `rows.length`.
   */
  manualPagination?: boolean;
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
  manualPagination,
  rows,
  total,
  ...props
}: DataTableContentProps<TRow>) {
  const { page, pageSize, searchFilterFn, searchQuery, setRowTotal } =
    useDataTableContext("DataTable.Content");
  const resolvedManualPagination = isManualPagination(
    manualPagination,
    total,
    rows.length
  );

  const filteredRows = React.useMemo(() => {
    if (resolvedManualPagination) {
      return rows;
    }

    const query = searchQuery.trim();

    if (!query) {
      return rows;
    }

    const match = searchFilterFn ?? defaultRowSearchFilter;

    return rows.filter((row) => match(row, query));
  }, [resolvedManualPagination, rows, searchFilterFn, searchQuery]);

  const resolvedTotal = total ?? filteredRows.length;

  React.useEffect(() => {
    setRowTotal(resolvedTotal);

    return () => {
      setRowTotal(undefined);
    };
  }, [resolvedTotal, setRowTotal]);

  const shouldSliceRows = !resolvedManualPagination;

  const { rows: visibleRows, startIndex } = React.useMemo(() => {
    if (!shouldSliceRows) {
      return { rows: filteredRows, startIndex: 0 };
    }

    return sliceRowsForPage(filteredRows, page, pageSize, resolvedTotal);
  }, [filteredRows, page, pageSize, resolvedTotal, shouldSliceRows]);

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
          {visibleRows.length === 0 ? (
            <tr className={styles.emptyRow}>
              <td className={styles.tableCell} colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            visibleRows.map((row, rowIndex) => {
              const globalRowIndex = startIndex + rowIndex;

              return (
                <tr
                  className={styles.tableRow}
                  key={getRowId?.(row, globalRowIndex) ?? globalRowIndex}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={styles.tableCell}
                      {...column.cellProps}
                    >
                      {renderCellValue(row, globalRowIndex, column)}
                    </td>
                  ))}
                </tr>
              );
            })
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
  divider?: boolean;
  /**
   * Controlled 1-based page. Omit for client (uncontrolled) pagination —
   * DataTable owns page state internally.
   */
  page?: number;
  /** Defaults to a value derived from DataTable.Content total and pageSize. */
  pageCount?: number;
  onPageChange?: (page: number) => void;
  /**
   * Controlled page size. Omit for client (uncontrolled) pagination —
   * DataTable owns pageSize state internally.
   */
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
  page: pageProp,
  pageCount,
  pageSize: pageSizeProp,
  pageSizeLabel = "Rows per page",
  pageSizeOptions = [...DEFAULT_PAGE_SIZE_OPTIONS],
  pageLabel = "Page",
  currentPageLabel = "Current page",
  previousLabel = "Previous page",
  showPageIndicator = true,
  showPageSize = true,
}: DataTablePaginationProps) {
  const {
    page: contextPage,
    pageSize: contextPageSize,
    rowTotal,
    setPage,
    setPageSize,
  } = useDataTableContext("DataTable.Pagination");
  const pageSizeId = useStableId();
  const pageSelectId = useStableId();
  const isPageControlled = pageProp !== undefined;
  const isPageSizeControlled = pageSizeProp !== undefined;

  const pageSizeSelectOptions = React.useMemo(
    () => normalizePageSizeOptions(pageSizeOptions),
    [pageSizeOptions]
  );

  const resolvedPageSize = isPageSizeControlled
    ? pageSizeProp
    : contextPageSize;
  const resolvedPageCount =
    pageCount ?? resolveDataTablePageCount(rowTotal, resolvedPageSize);
  const safePageCount = Math.max(1, resolvedPageCount);
  const currentPage = Math.min(
    Math.max(isPageControlled ? pageProp : contextPage, 1),
    safePageCount
  );
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= safePageCount;

  React.useEffect(() => {
    if (isPageControlled && pageProp !== contextPage) {
      setPage(pageProp);
    }
  }, [contextPage, isPageControlled, pageProp, setPage]);

  React.useEffect(() => {
    if (isPageSizeControlled && pageSizeProp !== contextPageSize) {
      setPageSize(pageSizeProp);
    }
  }, [contextPageSize, isPageSizeControlled, pageSizeProp, setPageSize]);

  React.useEffect(() => {
    if (!isPageControlled && contextPage > safePageCount) {
      setPage(safePageCount);
    }
  }, [contextPage, isPageControlled, safePageCount, setPage]);

  const commitPageChange = (nextPage: number) => {
    if (!isPageControlled) {
      setPage(nextPage);
    }

    onPageChange?.(nextPage);
  };

  const commitPageSizeChange = (nextPageSize: number) => {
    if (!isPageSizeControlled) {
      setPageSize(nextPageSize);
      setPage(1);
    }

    onPageSizeChange?.(nextPageSize);
  };

  const handlePrevious = () => {
    if (isFirstPage || disabled) {
      return;
    }

    commitPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (isLastPage || disabled) {
      return;
    }

    commitPageChange(currentPage + 1);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const nextPageSize = Number(event.target.value);

    if (!Number.isFinite(nextPageSize) || nextPageSize <= 0) {
      return;
    }

    commitPageSizeChange(nextPageSize);
  };

  const handlePageSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const nextPage = Number(event.target.value);

    if (!Number.isFinite(nextPage) || nextPage < 1) {
      return;
    }

    commitPageChange(nextPage);
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
      {showPageSize && (
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
DataTable.InstantSearch = DataTableInstantSearch;
DataTable.Content = DataTableContent;
DataTable.Footer = DataTableFooter;
DataTable.RowCount = DataTableRowCount;
DataTable.Pagination = DataTablePagination;
