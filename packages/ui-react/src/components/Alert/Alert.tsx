import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classNames";
import { Icon } from "../Icon/Icon";
import styles from "./Alert.module.css";
import { IconButton } from "../IconButton";

export type AlertVariant = "filled" | "outlined";
export type AlertSeverity = "success" | "info" | "warning" | "error";

export type AlertProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onClose" | "title"
> & {
  /** Trailing action slot, such as an undo button or a link. */
  action?: React.ReactNode;
  /** Accessible label for the dismiss button. Defaults to `"Dismiss alert"`. */
  closeLabel?: string;
  /** Leading status icon. Set to `false` to hide the default severity icon. */
  icon?: React.ReactNode | false;
  /** Callback fired when the dismiss button is clicked. */
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Semantic feedback severity. Defaults to `"info"`. */
  severity?: AlertSeverity;
  /** Visual treatment. Defaults to `"outlined"`. */
  variant?: AlertVariant;
};

export type AlertTitleProps = React.HTMLAttributes<HTMLElement>;

const alertClassName = cva(styles.root, {
  defaultVariants: {
    severity: "info",
    variant: "outlined",
  },
  variants: {
    severity: {
      error: styles.severityError,
      info: styles.severityInfo,
      success: styles.severitySuccess,
      warning: styles.severityWarning,
    },
    variant: {
      filled: styles.variantFilled,
      outlined: styles.variantOutlined,
    },
  },
});

const severityIconName: Record<
  AlertSeverity,
  React.ComponentProps<typeof Icon>["name"]
> = {
  error: "warning",
  info: "info",
  success: "check-circle",
  warning: "warning",
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      action,
      children,
      className,
      closeLabel = "Dismiss alert",
      icon,
      onClose,
      role,
      severity = "info",
      variant = "outlined",
      ...props
    },
    ref
  ) => {
    const ariaRole = role ?? (severity === "error" ? "alert" : "status");
    const statusIcon =
      icon === false
        ? null
        : (icon ?? (
            <Icon
              name={severityIconName[severity]}
              size="medium"
              color="currentColor"
            />
          ));

    return (
      <div
        ref={ref}
        role={ariaRole}
        className={cn(alertClassName({ severity, variant }), className)}
        {...props}
      >
        {statusIcon || children != null || onClose ? (
          <div className={styles.header}>
            {statusIcon ? (
              <span className={styles.icon} aria-hidden="true">
                {statusIcon}
              </span>
            ) : null}
            {children != null ? (
              <div className={styles.content}>{children}</div>
            ) : null}
            {onClose ? (
              <IconButton
                variant="ghost"
                size="md"
                color="neutral"
                icon={<Icon name="close" />}
                label={closeLabel}
                className={styles.close}
                onClick={onClose}
              />
            ) : null}
          </div>
        ) : null}
        {action ? <div className={styles.action}>{action}</div> : null}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<HTMLElement, AlertTitleProps>(
  ({ children, className, ...props }, ref) => (
    <strong ref={ref} className={cn(styles.title, className)} {...props}>
      {children}
    </strong>
  )
);

AlertTitle.displayName = "AlertTitle";
