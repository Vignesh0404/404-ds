import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "./cx.js";

// ---------------------------------------------------------------- Segmented

export type SegmentedOption<T extends string> = { value: T; label: string };

export type SegmentedProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  "aria-label"?: string;
  className?: string;
};

/** A short row of mutually exclusive choices. The chosen one is the surface flipped. */
export function Segmented<T extends string>({ value, onChange, options, "aria-label": ariaLabel, className }: SegmentedProps<T>) {
  return (
    <div role="group" aria-label={ariaLabel} className={cx("ds-segmented", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="ds-segmented-option"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// ------------------------------------------------------------------- Switch

export type SwitchProps = Omit<ComponentPropsWithoutRef<"button">, "onChange" | "role" | "type"> & {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/** An on/off switch. Give it an accessible name with aria-label or aria-labelledby. */
export function Switch({ checked, onChange, className, ...rest }: SwitchProps) {
  return (
    <button
      {...rest}
      type="button"
      role="switch"
      aria-checked={checked}
      className={cx("ds-switch", className)}
      onClick={() => onChange(!checked)}
    />
  );
}

// -------------------------------------------------------------------- Field

/** Label for a field, set as an eyebrow. */
export function Label({ className, ...rest }: ComponentPropsWithoutRef<"label">) {
  return <label {...rest} className={cx("ds-label", className)} />;
}

export function Input({ className, ...rest }: ComponentPropsWithoutRef<"input">) {
  return <input {...rest} className={cx("ds-field", className)} />;
}

export function Textarea({ className, ...rest }: ComponentPropsWithoutRef<"textarea">) {
  return <textarea {...rest} className={cx("ds-field", className)} />;
}

/** Small uppercase label above a heading or a group. */
export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={cx("ds-label", className)}>{children}</span>;
}
