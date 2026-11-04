import React from "react";

export function Card({
  className = "",
  id,
  children,
  onClick,
}: {
  className?: string;
  id?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-surface border border-surface-border rounded-xl p-5 shadow-sm transition-all duration-150 ${onClick ? "cursor-pointer hover:border-azure-500/40 hover:shadow-card" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div>
        <h3 className="font-display font-semibold text-lg text-foreground tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
