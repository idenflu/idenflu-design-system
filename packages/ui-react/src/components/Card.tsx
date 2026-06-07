import * as React from "react";
import { classNames } from "../utils/classNames";

export type CardProps = React.HTMLAttributes<HTMLElement> & {
  selected?: boolean;
};

export const Card = ({ className, selected = false, ...props }: CardProps) => (
  <article className={classNames("if-card", selected && "is-selected", className)} {...props} />
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
