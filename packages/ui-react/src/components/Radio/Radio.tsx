import * as React from "react";
import { cn } from "../../utils/classNames";
import styles from "./Radio.module.css";

export type RadioSize = "sm" | "md" | "lg";
export type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "children"> & {
  label: React.ReactNode;
  size?: RadioSize;
  containerClassName?: string;
};

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, size = "md", containerClassName, className, checked, ...props }, ref,
) {
  return (
    <label className={cn(styles.root, containerClassName)} data-size={size}>
      <input {...props} checked={checked} ref={ref} type="radio" className={cn(styles.input, className)} />
      <span>{label}</span>
    </label>
  );
});
