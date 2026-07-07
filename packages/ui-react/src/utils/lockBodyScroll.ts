type BodyStyleSnapshot = {
  overflow: string;
  paddingRight: string;
};

let lockCount = 0;
let snapshot: BodyStyleSnapshot | null = null;

const getScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth;
};

/**
 * Locks background scroll while preserving the layout space previously
 * occupied by the scrollbar. Nested locks are reference-counted.
 */
export const lockBodyScroll = (): (() => void) => {
  lockCount += 1;

  if (lockCount === 1) {
    const scrollbarWidth = getScrollbarWidth();

    snapshot = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };

    if (scrollbarWidth > 0) {
      const currentPaddingRight =
        Number.parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";
  }

  return () => {
    lockCount = Math.max(0, lockCount - 1);

    if (lockCount === 0 && snapshot) {
      document.body.style.overflow = snapshot.overflow;
      document.body.style.paddingRight = snapshot.paddingRight;
      snapshot = null;
    }
  };
};
