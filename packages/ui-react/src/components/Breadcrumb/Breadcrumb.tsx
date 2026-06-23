import * as React from "react";
import { cn } from "@/utils/classNames";
import { Icon } from "../Icon";
import styles from "./Breadcrumb.module.css";

export type BreadcrumbSize = "sm" | "md";

export type BreadcrumbItem = {
  /** Stable key for rendering and current item matching. */
  id?: string;
  /** Text or inline content shown for the breadcrumb item. */
  label: React.ReactNode;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Marks this item as the current page. */
  current?: boolean;
};

export type BreadcrumbProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Slot children for custom breadcrumb composition. */
  children?: React.ReactNode;
  /** Structured items used to render a complete breadcrumb trail. */
  items?: BreadcrumbItem[];
  /** Item id or zero-based index that should receive aria-current="page". */
  current?: string | number;
  /** Maximum visible items before collapsing the middle of the trail. */
  maxItems?: number;
  /** Number of leading items kept when collapsed. */
  itemsBeforeCollapse?: number;
  /** Number of trailing items kept when collapsed. */
  itemsAfterCollapse?: number;
  /** Accessible label for the collapsed path indicator. */
  overflowLabel?: string;
  /** Visual separator between items. Defaults to "/". */
  separator?: React.ReactNode;
  /** Breadcrumb density. */
  size?: BreadcrumbSize;
};

type RenderableBreadcrumbItem = BreadcrumbItem & {
  collapsed?: boolean;
  originalIndex: number;
};

function getRenderableItems({
  items,
  itemsAfterCollapse,
  itemsBeforeCollapse,
  maxItems,
}: {
  items: BreadcrumbItem[];
  itemsAfterCollapse: number;
  itemsBeforeCollapse: number;
  maxItems?: number;
}): RenderableBreadcrumbItem[] {
  if (!maxItems || maxItems < 3 || items.length <= maxItems) {
    return items.map((item, originalIndex) => ({ ...item, originalIndex }));
  }

  const visibleItemSlots = maxItems - 1;
  const beforeCount = Math.min(
    Math.max(1, itemsBeforeCollapse),
    visibleItemSlots - 1
  );
  const afterCount = Math.min(
    Math.max(1, itemsAfterCollapse),
    visibleItemSlots - beforeCount
  );
  const leadingItems = items.slice(0, beforeCount);
  const trailingItems = items.slice(items.length - afterCount);

  return [
    ...leadingItems.map((item, originalIndex) => ({ ...item, originalIndex })),
    {
      collapsed: true,
      id: "__breadcrumb-overflow__",
      label: null,
      originalIndex: beforeCount,
    },
    ...trailingItems.map((item, index) => ({
      ...item,
      originalIndex: items.length - afterCount + index,
    })),
  ];
}

function isCurrentItem(
  item: BreadcrumbItem,
  index: number,
  current: BreadcrumbProps["current"]
) {
  return item.current || current === item.id || current === index;
}

function renderItemContent(item: BreadcrumbItem) {
  return (
    <>
      {item.icon ? <span className={styles.icon}>{item.icon}</span> : null}
      <span className={styles.label}>{item.label}</span>
    </>
  );
}

export const Breadcrumb = React.forwardRef<HTMLDivElement, BreadcrumbProps>(
  (
    {
      children,
      className,
      current,
      items,
      itemsAfterCollapse = 1,
      itemsBeforeCollapse = 1,
      maxItems,
      overflowLabel = "Collapsed breadcrumb items",
      separator = "/",
      size = "md",
      ...props
    },
    ref
  ) => {
    const renderableItems = items
      ? getRenderableItems({
          items,
          itemsAfterCollapse,
          itemsBeforeCollapse,
          maxItems,
        })
      : [];

    return (
      <div
        ref={ref}
        className={cn(
          "nova-breadcrumb",
          styles.root,
          size === "sm" && styles.sizeSm,
          className
        )}
        {...props}
      >
        {items ? (
          <BreadcrumbList>
            {renderableItems.map((item, index) => {
              const itemKey = item.collapsed
                ? "breadcrumb-overflow"
                : (item.id ?? item.originalIndex);
              const isCurrent = isCurrentItem(
                item,
                item.originalIndex,
                current
              );

              return (
                <React.Fragment key={itemKey}>
                  {item.collapsed ? (
                    <BreadcrumbItem>
                      <BreadcrumbEllipsis aria-label={overflowLabel} />
                    </BreadcrumbItem>
                  ) : (
                    <BreadcrumbItem current={isCurrent}>
                      <RenderedBreadcrumbItem item={item} current={isCurrent} />
                    </BreadcrumbItem>
                  )}
                  {index < renderableItems.length - 1 ? (
                    <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
                  ) : null}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        ) : (
          children
        )}
      </div>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";

export function BreadcrumbList({
  className,
  ...props
}: React.ComponentProps<"ol">) {
  return (
    <ol
      className={cn("nova-breadcrumb__list", styles.list, className)}
      {...props}
    />
  );
}

export type BreadcrumbItemProps = React.ComponentPropsWithoutRef<"li"> & {
  current?: boolean;
};

export function BreadcrumbItem({
  className,
  current = false,
  ...props
}: BreadcrumbItemProps) {
  return (
    <li
      className={cn(
        "nova-breadcrumb__item",
        styles.item,
        current && styles.itemCurrent,
        className
      )}
      {...props}
    />
  );
}

export function BreadcrumbPage({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-current="page"
      className={cn("nova-breadcrumb__page", styles.page, className)}
      {...props}
    />
  );
}

export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("nova-breadcrumb__separator", styles.separator, className)}
      {...props}
    >
      {children ?? "/"}
    </li>
  );
}

export function BreadcrumbEllipsis({
  "aria-label": ariaLabel = "Collapsed breadcrumb items",
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-label={ariaLabel}
      role="img"
      className={cn("nova-breadcrumb__ellipsis", styles.ellipsis, className)}
      {...props}
    >
      <Icon
        name="more-horizontal"
        size={16}
        style={{ color: "var(--theme-text-secondary)" }}
      />
    </span>
  );
}

function RenderedBreadcrumbItem({
  current,
  item,
}: {
  current: boolean;
  item: BreadcrumbItem;
}) {
  const className = cn(
    "nova-breadcrumb__text",
    current ? styles.page : styles.text
  );
  const content = renderItemContent(item);

  return (
    <span aria-current={current ? "page" : undefined} className={className}>
      {content}
    </span>
  );
}
