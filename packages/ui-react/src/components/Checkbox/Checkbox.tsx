import * as React from "react";
import { cn } from "../../utils/classNames";
import styles from "./Checkbox.module.css";

export type CheckboxSize = "sm" | "md" | "lg";
export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "children"> & {
  label: React.ReactNode;
  size?: CheckboxSize;
  containerClassName?: string;
  indeterminate?: boolean;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, size = "md", containerClassName, className, indeterminate = false, checked, onChange, ...props }, ref,
) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  React.useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate, checked]);
  return (
    <label className={cn(styles.root, containerClassName)} data-size={size}>
      <input {...props} checked={checked} ref={inputRef} type="checkbox" className={cn(styles.input, className)} onChange={(event) => { onChange?.(event); event.currentTarget.indeterminate = indeterminate; }} />
      <span>{label}</span>
    </label>
  );
});
