import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface BigButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "md" | "lg";
  href?: string;
}

export function BigButton({
  children,
  variant = "primary",
  size = "lg",
  className,
  ...props
}: BigButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
        size === "lg" && "px-8 py-4 text-lg min-h-[56px]",
        size === "md" && "px-6 py-3 text-base min-h-[48px]",
        variant === "primary" &&
          "bg-accent-red hover:bg-accent-red-dark text-white glow-red hover:shadow-lg",
        variant === "secondary" &&
          "bg-charcoal-light hover:bg-charcoal text-foreground border border-border",
        variant === "outline" &&
          "border-2 border-accent-red text-accent-red hover:bg-accent-red-glow",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
