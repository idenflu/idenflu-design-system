import * as React from "react";
import { Icon } from "../Icon";
import { cn } from "../../utils/classNames";
import type { IconName } from "@idenflu/ui-icons";
import { Button as BaseButton, type ButtonProps as BaseButtonProps } from "../Button";
import { Select as BaseSelect, type SelectOption } from "../Select";
import { Tooltip as BaseTooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "../Tooltip";
export { Checkbox } from "../Checkbox";
export { Popover } from "../Popover";
export { Spinner } from "../Spinner";

function makeIcon(name: IconName) { return function GridIcon(props: React.SVGAttributes<SVGSVGElement>) { return <Icon {...props} name={name} />; }; }
export const ArrowDownIcon = makeIcon("arrow-down"), ArrowUpIcon = makeIcon("arrow-up"), DownloadIcon = makeIcon("download"), EditIcon = makeIcon("edit"), ExcelIcon = makeIcon("file"), FilterIcon = makeIcon("filter"), GridIcon = makeIcon("grid"), SearchIcon = makeIcon("search"), XIcon = makeIcon("x" as IconName), CheckIcon = makeIcon("check");

type GridButtonProps = Omit<BaseButtonProps, "variant"> & { variant?: "primary" | "outline" | "ghost"; iconOnly?: boolean };
export const Button = React.forwardRef<HTMLButtonElement, GridButtonProps>(function Button({ variant, iconOnly, className, ...props }, ref) { return <BaseButton {...props} ref={ref} className={cn(iconOnly && "grid-icon-button", className)} variant={variant === "outline" ? "outlined" : variant === "ghost" ? "ghost" : "default"} />; });
export const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement> & { density?: "default" | "compact"; interactive?: boolean }>(function Table({ density, interactive, ...props }, ref) { return <table {...props} ref={ref} data-density={density} data-interactive={interactive || undefined} />; });
export function Tooltip({ children, content }: { children: React.ReactNode; content: React.ReactNode }) { return <TooltipProvider><BaseTooltip><TooltipTrigger asChild>{children}</TooltipTrigger><TooltipContent>{content}</TooltipContent></BaseTooltip></TooltipProvider>; }

type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> & { hideLabel?: boolean; containerClassName?: string; label: string; prefix?: React.ReactNode; prefixDecorative?: boolean; action?: React.ReactNode };
export function TextField({ hideLabel, containerClassName, label, prefix, prefixDecorative, action, id, ...props }: TextFieldProps) { const generated = React.useId(); const fieldId = id ?? generated; return <div className={containerClassName}><label htmlFor={fieldId} className={hideLabel ? "sr-only" : undefined}>{label}</label><div className="grid-search-control">{prefix && <span aria-hidden={prefixDecorative || undefined}>{prefix}</span>}<input {...props} id={fieldId} />{action}</div></div>; }
type GridSelectProps = { options: SelectOption[]; label: string; hideLabel?: boolean; placeholder?: string; popupStrategy?: string; disabled?: boolean; searchable?: boolean; maxVisibleLabels?: number; value: string; onValueChange: (value: string) => void };
export function Select({ hideLabel, label, popupStrategy: _popupStrategy, onValueChange, ...props }: GridSelectProps) { return <BaseSelect {...props} label={label} searchable={false} valueDisplay="text" onValueChange={(value) => onValueChange(typeof value === "string" ? value : value[0] ?? "")} />; }
type MultiSelectProps = Omit<GridSelectProps, "value" | "onValueChange"> & { value: string[]; onValueChange: (value: string[]) => void };
export function MultiSelect({ hideLabel, label, popupStrategy: _popupStrategy, maxVisibleLabels: _maxVisibleLabels, onValueChange, ...props }: MultiSelectProps) { return <BaseSelect {...props} label={label} multiple valueDisplay="text" onValueChange={(value) => onValueChange(Array.isArray(value) ? value : [value])} />; }
