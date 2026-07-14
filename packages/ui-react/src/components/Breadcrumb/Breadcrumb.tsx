import * as React from "react";
import { cn } from "../../utils/classNames";
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
        className={cn(styles.root, size === "sm" && styles.sizeSm, className)}
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
                    <BreadcrumbEllipsis aria-label={overflowLabel} />
                  ) : (
                    <BreadcrumbItem
                      current={isCurrent}
                      icon={item.icon}
                      label={item.label}
                    />
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
  return <ol className={cn(styles.list, className)} {...props} />;
}

export type BreadcrumbItemProps = Omit<
  React.ComponentPropsWithoutRef<"li">,
  "children"
> & {
  current?: boolean;
  icon?: React.ReactNode;
  label: React.ReactNode;
};

export function BreadcrumbItem({
  className,
  current = false,
  icon,
  label,
  ...props
}: BreadcrumbItemProps) {
  return (
    <li
      aria-current={current ? "page" : undefined}
      className={cn(styles.item, current && styles.itemCurrent, className)}
      {...props}
    >
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span className={styles.label}>{label}</span>
    </li>
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
      className={cn(styles.separator, className)}
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
}: React.ComponentProps<"li">) {
  return (
    <li
      aria-label={ariaLabel}
      className={cn(styles.ellipsis, className)}
      {...props}
    >
      <Icon name="more-horizontal" size={16} />
    </li>
  );
}
