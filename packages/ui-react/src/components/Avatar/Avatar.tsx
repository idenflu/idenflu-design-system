import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/classNames";
import styles from "./Avatar.module.css";

export type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Accessible text for the rendered image. Use an empty string for decorative avatars. */
  alt?: string;
  /** Image sizes attribute for responsive avatar images. */
  sizes?: string;
  /** Size preset. Defaults to `md`. */
  size?: AvatarSize;
  /** Image source. */
  src?: string;
  /** Responsive image source set. */
  srcSet?: string;
};

const avatarClassName = cva(styles.root, {
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      lg: styles.sizeLg,
      md: styles.sizeMd,
      sm: styles.sizeSm,
    },
  },
});

const getAltFallback = (alt: string) => {
  const trimmedAlt = alt.trim();

  return trimmedAlt ? Array.from(trimmedAlt)[0]?.toUpperCase() : null;
};

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      "aria-label": ariaLabel,
      alt = "",
      children,
      className,
      role,
      sizes,
      size = "md",
      src,
      srcSet,
      ...props
    },
    ref
  ) => {
    const [hasImageError, setHasImageError] = React.useState(false);

    React.useEffect(() => {
      setHasImageError(false);
    }, [src, srcSet]);

    const shouldRenderImage = Boolean(src || srcSet) && !hasImageError;
    const hasCustomFallback =
      children !== undefined &&
      children !== null &&
      children !== false &&
      children !== "";
    const fallbackContent = hasCustomFallback ? children : getAltFallback(alt);
    const fallbackLabel =
      !shouldRenderImage && !hasCustomFallback && alt ? alt : undefined;

    return (
      <span
        ref={ref}
        aria-label={ariaLabel ?? fallbackLabel}
        className={cn(avatarClassName({ size }), className)}
        role={role ?? (fallbackLabel ? "img" : undefined)}
        {...props}
      >
        <span
          aria-hidden={shouldRenderImage || undefined}
          className={styles.fallback}
        >
          {fallbackContent}
        </span>
        {shouldRenderImage ? (
          <img
            alt={alt}
            className={styles.image}
            onError={() => setHasImageError(true)}
            sizes={sizes}
            src={src}
            srcSet={srcSet}
          />
        ) : null}
      </span>
    );
  }
);

Avatar.displayName = "Avatar";
