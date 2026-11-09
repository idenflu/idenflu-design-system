import * as React from "react";

export function useValue<T>(
  value: T | undefined,
  fallback: T,
  onChange?: (value: T) => void
) {
  const initial = React.useRef(fallback);
  const [internal, setInternal] = React.useState(fallback);
  const current = value === undefined ? internal : value;
  const update = (next: T) => {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };
  const reset = () => {
    if (value === undefined) setInternal(initial.current);
  };
  return [current, update, reset] as const;
}

export function useFormReset(
  ref: React.RefObject<HTMLElement | null>,
  reset: () => void
) {
  const latest = React.useRef(reset);
  latest.current = reset;
  React.useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;
    let active = true;
    const handler = (event: Event) => {
      queueMicrotask(() => {
        if (active && !event.defaultPrevented) latest.current();
      });
    };
    form.addEventListener("reset", handler);
    return () => {
      active = false;
      form.removeEventListener("reset", handler);
    };
  }, [ref]);
}
