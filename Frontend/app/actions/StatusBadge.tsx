
import React from "react";

interface StatusBadgeProps {
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "completed"
    | "open"
    | "investigating"
    | "resolved";
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const baseClasses =
    "inline-flex items-center font-semibold rounded-full shadow-sm";
  const sizeClasses = size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm";

  const colorClasses = {
    pending:
      "bg-gradient-to-r from-gray-500 to-slate-600 text-white border border-gray-400/30",
    approved:
      "bg-gradient-to-r from-green-500 to-emerald-600 text-white border border-green-400/30",
    rejected:
      "bg-gradient-to-r from-red-500 to-pink-600 text-white border border-red-400/30",
    completed:
      "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border border-blue-400/30",
    open: "bg-gradient-to-r from-red-500 to-pink-600 text-white border border-red-400/30",
    investigating:
      "bg-gradient-to-r from-yellow-500 to-amber-600 text-white border border-yellow-400/30",
    resolved:
      "bg-gradient-to-r from-green-500 to-emerald-600 text-white border border-green-400/30",
  };

  return (
    <span className={`${baseClasses} ${sizeClasses} ${colorClasses[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
