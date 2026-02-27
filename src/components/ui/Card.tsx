"use client";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  hoverable?: boolean;
}

export function Card({
  className,
  selected,
  hoverable = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-sm border bg-surface p-5 transition-all duration-300",
        hoverable &&
          "cursor-pointer hover:border-accent/30 hover:shadow-subtle hover:-translate-y-px",
        selected
          ? "border-accent bg-accent/5 ring-1 ring-accent/20"
          : "border-surface-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
