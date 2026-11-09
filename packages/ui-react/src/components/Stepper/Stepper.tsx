import * as React from "react";
import { cn } from "../../utils/classNames";
import styles from "./Stepper.module.css";
export type StepperProps = React.OlHTMLAttributes<HTMLOListElement> & {
  steps: readonly React.ReactNode[];
  /** Zero-based index of the current step. */
  currentStep: number;
};
export function Stepper({ steps, currentStep, className, ...props }: StepperProps) {
  return <ol {...props} className={cn(styles.root, className)}>{steps.map((step, index) => <li key={index} aria-current={index === currentStep ? "step" : undefined} data-complete={index < currentStep || undefined}><span className={styles.number} aria-hidden="true">{index + 1}</span><span>{step}</span></li>)}</ol>;
}
