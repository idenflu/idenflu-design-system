import * as React from "react";
import { cn } from "../../utils/classNames";
import { useFormReset, useValue } from "../_navigation/navigation-state";
import styles from "./Segmented.module.css";
export type SegmentedOption = { value: string; label: React.ReactNode; disabled?: boolean };
export type SegmentedProps = {
  options: readonly SegmentedOption[];
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};
export function Segmented({ options, label, value, defaultValue, onValueChange, name, disabled, size = "md", className }: SegmentedProps) {
  const initial = defaultValue ?? options.find((option) => !option.disabled)?.value ?? "";
  const [current, setCurrent, reset] = useValue(value, initial, onValueChange);
  const root = React.useRef<HTMLDivElement>(null);
  useFormReset(root, reset);
  return <div ref={root} className={cn(styles.root, className)} role="group" aria-label={label} data-size={size}>
    {name && <input type="hidden" name={name} value={current} disabled={disabled} />}
    {options.map((option) => <button key={option.value} type="button" aria-pressed={current === option.value} disabled={disabled || option.disabled} onClick={() => setCurrent(option.value)}>{option.label}</button>)}
  </div>;
}
