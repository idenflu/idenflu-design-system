import * as React from "react";
import { cn } from "../../utils/classNames";
import styles from "./PageHeader.module.css";
export type PageHeaderProps = Omit<React.HTMLAttributes<HTMLElement>, "title" | "children"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  titleId?: string;
};
export const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(function PageHeader({ title, description, eyebrow, actions, headingLevel = 1, titleId, className, "aria-label": ariaLabel, "aria-labelledby": labelledBy, ...props }, ref) {
  const generated = React.useId();
  const headingId = titleId || `page-header-${generated}`;
  const Heading = `h${headingLevel}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const hasContent = (content: React.ReactNode) => content != null && typeof content !== "boolean" && content !== "";
  return <header {...props} ref={ref} className={cn(styles.root, className)} aria-label={ariaLabel} aria-labelledby={labelledBy ?? (ariaLabel == null ? headingId : undefined)}>
    <div>{hasContent(eyebrow) && <div className={styles.eyebrow}>{eyebrow}</div>}<Heading id={headingId} className={styles.title}>{title}</Heading>{hasContent(description) && <div className={styles.description}>{description}</div>}</div>
    {hasContent(actions) && <div className={styles.actions}>{actions}</div>}
  </header>;
});
