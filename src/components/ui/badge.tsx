import React from "react";

export interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info" | "hot" | "neutral";
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "neutral", size = "sm", children, className = "" }: BadgeProps) {
  const variants = {
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    danger: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    info: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    hot: "bg-[#FF6B2C]/15 text-[#FF6B2C] border-[#FF6B2C]/30 font-semibold",
    neutral: "bg-surface-raised text-text-secondary border-surface-border",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
