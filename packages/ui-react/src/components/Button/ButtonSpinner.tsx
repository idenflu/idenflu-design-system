import { Spinner } from "../Spinner/Spinner";
import type { ButtonSize } from "./Button";

type ButtonSpinnerProps = {
  size: ButtonSize;
};

/** Decorative spinner for buttons — parent exposes `aria-busy`. */
export function ButtonSpinner({ size }: ButtonSpinnerProps) {
  return (
    <Spinner
      aria-hidden
      aria-label={undefined}
      aria-live={undefined}
      color="inherit"
      role={undefined}
      size={size}
    />
  );
}
