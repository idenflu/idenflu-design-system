import * as React from "react";
import { classNames } from "../utils/classNames";

export type AvatarSize = "small" | "medium" | "large";

export type AvatarPresence = "online" | "busy";

export type AvatarProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Full name used to derive fallback initials. */
  name?: string;
  /** Image source. When present it replaces the initials. */
  image?: string;
  /** Explicit initials override. Falls back to initials derived from `name` (up to 2 letters). */
  initials?: string;
  /** Size token. Defaults to `"medium"`. */
  size?: AvatarSize;
  /** Decorative presence dot. Convey the same state in `label` — never rely on color alone. */
  presence?: AvatarPresence;
  /** Render the muted, unassigned treatment. */
  unassigned?: boolean;
  /** Accessible label. When omitted the avatar is decorative (aria-hidden). */
  label?: string;
};

const deriveInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, image, initials, label, name, presence, size = "medium", unassigned = false, ...props }, ref) => {
    const resolvedInitials = initials ?? (name ? deriveInitials(name) : "");
    const isMuted = unassigned || (!image && !resolvedInitials);
    const a11y = label
      ? ({ role: "img", "aria-label": label } as const)
      : ({ "aria-hidden": true } as const);

    return (
      <span
        ref={ref}
        className={classNames("if-avatar", `if-avatar--${size}`, isMuted && "is-muted", className)}
        {...a11y}
        {...props}
      >
        {image ? (
          <img className="if-avatar__image" src={image} alt={label ?? ""} />
        ) : (
          <span className="if-avatar__initials">{resolvedInitials}</span>
        )}
        {presence ? (
          <span className={classNames("if-avatar__presence", `if-avatar__presence--${presence}`)} aria-hidden />
        ) : null}
      </span>
    );
  },
);

Avatar.displayName = "Avatar";
