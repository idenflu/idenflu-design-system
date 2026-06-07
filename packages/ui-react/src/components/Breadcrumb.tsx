import * as React from "react";
import { classNames } from "../utils/classNames";

export type BreadcrumbItem = {
  /** Visible content for the trail entry. */
  label: React.ReactNode;
  /** Destination for non-current entries. Omit to render plain text. */
  href?: string;
  /** Marks this entry as the current page. Defaults to the last item. */
  current?: boolean;
};

export type BreadcrumbProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** Ordered trail from root to the current page. */
  items: BreadcrumbItem[];
  /** Accessible name for the navigation landmark. Defaults to `"Breadcrumb"`. */
  label?: string;
  /** Glyph rendered between entries. Defaults to `"/"`. */
  separator?: React.ReactNode;
};

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, label, separator = "/", ...props }, ref) => (
    <nav
      ref={ref}
      aria-label={label ?? "Breadcrumb"}
      className={classNames("if-breadcrumb", className)}
      {...props}
    >
      <ol className="if-breadcrumb__list">
        {items.map((item, index) => {
          const isCurrent = item.current ?? index === items.length - 1;
          return (
            <li key={index} className="if-breadcrumb__item">
              {index > 0 ? (
                <span className="if-breadcrumb__separator" aria-hidden="true">
                  {separator}
                </span>
              ) : null}
              {isCurrent ? (
                <span className="if-breadcrumb__current" aria-current="page">
                  {item.label}
                </span>
              ) : item.href != null ? (
                <a className="if-breadcrumb__link" href={item.href}>
                  {item.label}
                </a>
              ) : (
                <span className="if-breadcrumb__link">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  ),
);

Breadcrumb.displayName = "Breadcrumb";
