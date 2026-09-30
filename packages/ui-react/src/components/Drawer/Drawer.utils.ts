import * as React from "react";

export function composeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}

export function getTabbableElements(container: HTMLElement) {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.tabIndex !== -1,
  );
}

export function getInitialFocusTarget(surface: HTMLElement) {
  const tabbables = getTabbableElements(surface).filter(
    (element) => element.dataset.slot !== "drawer-close",
  );
  const field = tabbables.find((element) =>
    element.matches("input, textarea, select"),
  );

  return field ?? tabbables[0] ?? getTabbableElements(surface)[0] ?? null;
}

export function usePresence(open: boolean, duration: number) {
  const [mounted, setMounted] = React.useState(open);
  const [state, setState] = React.useState<"open" | "closed">(
    open ? "open" : "closed",
  );

  React.useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = window.requestAnimationFrame(() => setState("open"));
      return () => window.cancelAnimationFrame(frame);
    }

    if (!mounted) {
      return undefined;
    }

    setState("closed");
    const timer = window.setTimeout(() => setMounted(false), duration);
    return () => window.clearTimeout(timer);
  }, [duration, mounted, open]);

  return { mounted, state };
}
