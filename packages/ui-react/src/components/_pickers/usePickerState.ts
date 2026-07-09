import * as React from "react";

export type PickerStateOptions = {
  externalOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

export type PickerState = {
  open: boolean;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  popoverRef: React.MutableRefObject<HTMLDivElement | null>;
  openPicker: () => void;
  closePicker: (focusTrigger?: boolean) => void;
  setPopupOpen: (nextOpen: boolean) => void;
};

export function usePickerState({
  externalOpen,
  onOpen,
  onClose,
}: PickerStateOptions): PickerState {
  const isControlled = externalOpen !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = isControlled ? (externalOpen as boolean) : internalOpen;

  const triggerRef = React.useRef<HTMLElement | null>(null);
  const popoverRef = React.useRef<HTMLDivElement | null>(null);

  const openPicker = React.useCallback(() => {
    if (!isControlled) setInternalOpen(true);
    onOpen?.();
  }, [isControlled, onOpen]);

  const closePicker = React.useCallback(
    (focusTrigger = true) => {
      if (focusTrigger) {
        triggerRef.current?.querySelector<HTMLInputElement>("input")?.focus();
      }
      if (!isControlled) setInternalOpen(false);
      onClose?.();
    },
    [isControlled, onClose]
  );

  const setPopupOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) openPicker();
      else closePicker();
    },
    [openPicker, closePicker]
  );

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        !popoverRef.current?.contains(t) &&
        !triggerRef.current?.contains(t)
      ) {
        closePicker(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, closePicker]);

  return {
    open,
    triggerRef,
    popoverRef,
    openPicker,
    closePicker,
    setPopupOpen,
  };
}
