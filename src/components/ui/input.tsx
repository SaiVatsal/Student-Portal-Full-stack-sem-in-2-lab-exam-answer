import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full h-10 px-3.5 bg-surface-subtle text-foreground text-sm rounded-lg border transition-colors duration-150 placeholder:text-text-muted focus:outline-none focus:border-azure-500 focus:ring-1 focus:ring-azure-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" : "border-surface-border"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-text-muted mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
