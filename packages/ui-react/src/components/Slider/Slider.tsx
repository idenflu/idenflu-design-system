import * as React from "react";
import { cn } from "../../utils/classNames";
import styles from "./Slider.module.css";
export type SliderProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange"> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
};
export function Slider({ value, defaultValue = 0, onValueChange, min = 0, max = 100, className, style, ...props }: SliderProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const input = React.useRef<HTMLInputElement>(null);
  const initial = React.useRef(defaultValue);
  React.useEffect(() => {
    const form = input.current?.form;
    if (!form || value !== undefined) return;
    let active = true;
    const reset = (event: Event) => queueMicrotask(() => { if (active && !event.defaultPrevented) setInternal(initial.current); });
    form.addEventListener("reset", reset);
    return () => { active = false; form.removeEventListener("reset", reset); };
  }, [value]);
  const current = value ?? internal;
  const low = Number(min), high = Number(max);
  const percent = high > low ? Math.max(0, Math.min(100, ((current - low) / (high - low)) * 100)) : 0;
  const fillStyle = { ...style, "--fill": `${percent}%`, "--fill-position": `calc(${percent}% + ${12 * (0.5 - percent / 100)}px)` } as React.CSSProperties;
  return <input {...props} style={fillStyle} ref={input} type="range" className={cn(styles.root, className)} min={min} max={max} value={value ?? internal} onChange={(event) => { const next = event.currentTarget.valueAsNumber; if (value === undefined) setInternal(next); onValueChange?.(next); }} />;
}
