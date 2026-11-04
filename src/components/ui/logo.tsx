import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const dimensions = {
    sm: { icon: 24, font: "text-lg" },
    md: { icon: 32, font: "text-xl" },
    lg: { icon: 44, font: "text-2xl" },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 font-display select-none ${className}`}>
      {/* Custom Nitro Azard SVG Mark: Dynamic Azure faceted polygon with Hot-Orange ignition core */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
        aria-hidden="true"
      >
        <path
          d="M8 6L28 4L42 18L38 42L18 44L6 28L8 6Z"
          fill="#111B2E"
          stroke="#2F7BFF"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Kinetic Nitro Lightning facet */}
        <path
          d="M26 6L14 26H24L20 42L36 20H24L26 6Z"
          fill="url(#nitro_gradient)"
        />
        <defs>
          <linearGradient id="nitro_gradient" x1="14" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF6B2C" />
            <stop offset="0.6" stopColor="#2F7BFF" />
            <stop offset="1" stopColor="#8EC1FF" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <span className={`font-bold tracking-tight ${dimensions.font} flex items-center`}>
          <span className="text-[#F8FAFC]">Nitro</span>
          <span className="text-[#2F7BFF] ml-1">Azard</span>
          <span className="ml-1.5 text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-azure-500/10 text-azure-400 font-mono font-medium border border-azure-500/20">
            ERP
          </span>
        </span>
      )}
    </div>
  );
}
