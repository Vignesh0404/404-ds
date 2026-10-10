import type { ComponentPropsWithoutRef, ElementType, ReactNode, Ref } from "react";
import { cx } from "./cx.js";
import type { ButtonVariant } from "./Button.js";

type OwnProps<E extends ElementType> = {
  as?: E;
  /** Accessible name. Required: an icon button has no visible text. */
  label: string;
  tone?: ButtonVariant;
  size?: "md" | "sm" | "xs";
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
};

export type IconButtonProps<E extends ElementType = "button"> = OwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof OwnProps<E> | "aria-label">;

/**
 * Round icon-only button: 40px by default, green unless told otherwise. Same
 * outline and flip as Button. Children are the icon (and, if needed, a
 * badge — the button is position: relative).
 */
export function IconButton<E extends ElementType = "button">({
  as,
  label,
  tone = "green",
  size = "md",
  className,
  ...rest
}: IconButtonProps<E>) {
  const Component: ElementType = as ?? "button";
  const type = Component === "button" && !("type" in rest) ? { type: "button" as const } : null;
  return (
    <Component
      {...type}
      {...rest}
      aria-label={label}
      className={cx("ds-icon-button", className)}
      data-variant={tone}
      data-size={size === "md" ? undefined : size}
    />
  );
}
