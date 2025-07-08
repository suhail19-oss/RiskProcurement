import React from "react";

interface PriorityBadgeProps {
  priority?: "low" | "medium" | "high" | "urgent"; // optional in case it's undefined
  size?: "sm" | "md";
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority = "low", // default fallback
  size = "md",
}) => {
  const baseClasses =
    "inline-flex items-center font-bold rounded-full shadow-sm";
  const sizeClasses = size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm";

  const colorClasses: Record<string, string> = {
    low: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border border-blue-400/30",
    medium:
      "bg-gradient-to-r from-yellow-500 to-amber-600 text-white border border-yellow-400/30",
    high: "bg-gradient-to-r from-orange-500 to-red-600 text-white border border-orange-400/30",
    urgent:
      "bg-gradient-to-r from-red-600 to-pink-600 text-white border border-red-500/30 animate-pulse",
  };

  const safePriority = colorClasses[priority] ? priority : "low";

  return (
    <span
      className={`${baseClasses} ${sizeClasses} ${colorClasses[safePriority]}`}
    >
      {safePriority.charAt(0).toUpperCase() + safePriority.slice(1)} Priority
    </span>
  );
};