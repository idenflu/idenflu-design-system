import * as React from "react";

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
  setDescriptionPresent: (present: boolean) => void;
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

  const labelledBy =
    [titlePresent ? titleId : null, descriptionPresent ? descriptionId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  if (!ariaLabel && !labelledBy) {
    console.warn(
      "DataTable: provide aria-label or include DataTable.Title for an accessible name."
    );
  }

  return (
    <DataTableContext.Provider
      value={{
        descriptionId,
        descriptionPresent,
        setDescriptionPresent,
        setTitlePresent,
        titleId,
        titlePresent,
      }}
    >
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
      className={cn(styles.title, className)}
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
    <p
      className={cn(styles.description, className)}
      id={descriptionId}
      {...props}
    >
      {children}
    </p>
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

export type DataTableContentProps = React.ComponentPropsWithoutRef<"div">;

export function DataTableContent({
  children,
  className,
  ...props
}: DataTableContentProps) {
  return (
    <div className={cn(styles.content, className)} {...props}>
      {children}
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
  total: number;
};

export function DataTableRowCount({
  children,
  className,
  itemLabel = "items",
  total,
  ...props
}: DataTableRowCountProps) {
  return (
    <p className={cn(styles.rowCount, className)} {...props}>
      {total} {itemLabel}
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
  pageCount: number;
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
  const pageSizeId = useStableId();
  const pageSelectId = useStableId();
  const safePageCount = Math.max(1, pageCount);
  const currentPage = Math.min(Math.max(page, 1), safePageCount);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= safePageCount;
  const shouldShowPageSize =
    showPageSize ?? (pageSize !== undefined || onPageSizeChange !== undefined);
  const pageSizeSelectOptions = React.useMemo(
    () => normalizePageSizeOptions(pageSizeOptions),
    [pageSizeOptions]
  );
  const resolvedPageSize =
    pageSize ??
    Number(pageSizeSelectOptions[0]?.value) ??
    DEFAULT_PAGE_SIZE_OPTIONS[0];

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
