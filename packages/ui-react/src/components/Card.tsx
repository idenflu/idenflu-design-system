import * as React from "react";
import { classNames } from "../utils/classNames";

export type CardState = "default" | "loading" | "locked" | "error";

export type CardProps = React.HTMLAttributes<HTMLElement> & {
  selected?: boolean;
  state?: CardState;
};

export const Card = ({ className, selected = false, state = "default", ...props }: CardProps) => (
  <article
    aria-busy={state === "loading" || undefined}
    className={classNames(
      "if-card",
      selected && "is-selected",
      state === "loading" && "is-loading",
      state === "locked" && "is-locked",
      state === "error" && "is-error",
      className,
    )}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames("if-card__header", className)} {...props} />
);

export const CardBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames("if-card__body", className)} {...props} />
);

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames("if-card__footer", className)} {...props} />
);
