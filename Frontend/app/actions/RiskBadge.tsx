import React from "react";

interface RiskBadgeProps {
  level: "Low" | "Medium" | "High";
  size?: "sm" | "md";
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = "md" }) => {
  const baseClasses =
    "inline-flex items-center font-bold rounded-full shadow-sm";
  const sizeClasses = size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm";

  const colorClasses = {
    Low: "bg-gradient-to-r from-green-500 to-emerald-600 text-white border border-green-400/30",
    Medium:
      "bg-gradient-to-r from-yellow-500 to-amber-600 text-white border border-yellow-400/30",
    High: "bg-gradient-to-r from-orange-500 to-red-600 text-white border border-orange-400/30",
  };

  return (
    <span className={`${baseClasses} ${sizeClasses} ${colorClasses[level]}`}>
      {level?.charAt(0).toUpperCase() + level?.slice(1)} Risk
    </span>
  );
};