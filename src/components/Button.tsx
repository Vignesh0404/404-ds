import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cx } from "./cx.js";

// A variant is a tone name: the button's fill is that tone's surface and its
// label that tone's text colour. "ghost" has no fill of its own.
export type ButtonVariant =
  | "paper"
  | "cream"
  | "yellow"
  | "purple-light"
  | "red"
  | "green"
  | "blue"
  | "brown"
  | "purple"
  | "ink"
  | "ghost";

type OwnProps<E extends ElementType> = {
  /** Element or component to render: "a", a router's Link… Defaults to "button". */
  as?: E;
  tone?: ButtonVariant;
  size?: "md" | "sm";
  /** Fill the width of the container. */
  block?: boolean;
  className?: string;
  children?: ReactNode;
};

export type ButtonProps<E extends ElementType = "button"> = OwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof OwnProps<E>>;


/**
 * The family button. Outlined in the surrounding surface's text colour; fill
 * and label trade colours on hover and focus.
 *
 * It deliberately does not set data-tone on itself. Its outline and focus
 * ring are drawn against the page and must read the page's tone, which they
 * can only do while the button doesn't declare one. The variant is carried by
 * data-variant instead.
 *
 * `as` makes it a link without this package knowing about any router:
 *   <Button as={Link} to="/cart">Checkout</Button>
 */
export function Button<E extends ElementType = "button">({
  as,
  tone = "cream",
  size = "md",
  block,
  className,
  ...rest
}: ButtonProps<E>) {
  const Component: ElementType = as ?? "button";
  // A bare <button> inside a form submits it; make "button" the default the
  // way the sites' own Button components always did.
  const type = Component === "button" && !("type" in rest) ? { type: "button" as const } : null;
  return (
    <Component
      {...type}
      {...rest}
      className={cx("ds-button", className)}
      data-variant={tone}
      data-size={size === "md" ? undefined : size}
      data-block={block ? "" : undefined}
    />
  );
}
