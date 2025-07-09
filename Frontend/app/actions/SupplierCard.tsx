import React, { useState } from "react";
import {
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  Target,
  AlertCircle,
} from "lucide-react";
import { Supplier, RiskViolation, SuggestedAction } from "../types/supplier";
import { RiskBadge } from "./RiskBadge";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import { products } from "../data/products";

const formatPriority = (
  priority: string
): "low" | "medium" | "high" | "urgent" => {
  const normalized = priority.toLowerCase();
  if (normalized.includes("high")) return "high";
  if (normalized.includes("medium")) return "medium";
  if (normalized.includes("low")) return "low";
  if (normalized.includes("urgent")) return "urgent";
  return "medium";
};

interface SupplierCardProps {
  supplier: Supplier;
  violations: RiskViolation[];
  actions: SuggestedAction[];
  onActionUpdate: (actionId: string, status: string) => void;
}

export const SupplierCard: React.FC<any> = ({ supplier, onActionUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const violations = supplier.violations;
  const actions = supplier.actions;
  const [showViolations, setShowViolations] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSupplierLatestAssessment = (supplier: any) => {
    if (!supplier.actions || supplier.actions.length === 0) return "N/A";

    const dates = supplier.actions.map(
      (a: any) => new Date(a.lastAssessedAt || a.createdAt)
    );

    const latest = new Date(Math.max(...dates.map((d: any) => d.getTime())));

    return latest.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRiskGradient = (riskLevel: string) => {
    switch (riskLevel) {
      case "High":
        return "from-orange-500/10 to-red-500/10";
      case "Medium":
        return "from-yellow-500/10 to-orange-500/10";
      case "Low":
        return "from-green-500/10 to-emerald-500/10";
      default:
        return "from-gray-500/10 to-slate-500/10";
    }
  };

  const supplierProduct = products.filter(
    (product: any) => product.id == supplier.product_id
  )[0];

  return (
    <div className="group relative bg-white/70 dark:bg-zinc-900 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-zinc-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getRiskGradient(
          supplier?.risk_level ?? 30
        )} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      ></div>

      {/* Header */}
      <div className="relative p-8 border-b border-gray-100/60 dark:border-zinc-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur opacity-20"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {supplier?.company_name ?? "No name"}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                    {supplierProduct.name ?? "No category"}
                  </span>
                  <RiskBadge level={supplier.risk_level ?? 30} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card items */}
              {[
                {
                  icon: <MapPin className="h-5 w-5 text-white" />,
                  label: "Location",
                  value: supplier.location,
                  gradient: "from-emerald-500 to-green-600",
                },
                {
                  icon: <DollarSign className="h-5 w-5 text-white" />,
                  label: "Contract Value",
                  value: (
                    <span className="text-gray-600 dark:text-gray-400">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(supplier.contract_value ?? 1000000000)}
                    </span>
                  ),
                  gradient: "from-blue-500 to-indigo-600",
                },
                {
                  icon: <AlertCircle className="h-5 w-5 text-[white]" />,
                  label: "Penalties",
                  value: `${supplier.penalty ?? 30}%`,
                  gradient: "from-[#E2142D] to-red-700",
                },

                {
                  icon: <Calendar className="h-5 w-5 text-white" />,
                  label: "Last Assessment",
                  value: formatDate(supplier.lastAssessment),
                  gradient: "from-amber-500 to-orange-600",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-white/60 dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700"
                >
                  <div
                    className={`h-10 w-10 bg-gradient-to-br ${item.gradient} rounded-lg flex items-center justify-center`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative ml-6 p-3 hover:bg-white/60 dark:hover:bg-white/10 rounded-xl transition-all duration-300 group/btn"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              {isExpanded ? (
                <ChevronUp className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <ChevronDown className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="relative p-8 space-y-8 bg-white/30 dark:bg-zinc-800/60 backdrop-blur-sm">
          {/* Violations */}
          <div>
            <button
              onClick={() => setShowViolations(!showViolations)}
              className="flex items-center gap-3 mb-4 text-left w-full"
            >
              <div className="h-10 w-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  Recent Violations
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {violations.length} active issues requiring attention
                </p>
              </div>
              {showViolations ? (
                <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>

            {showViolations && (
              <>
                {violations.length > 0 ? (
                  <div className="space-y-3">
                    {violations.map((violation: any) => (
                      <div
                        key={violation.id}
                        className="group/violation relative bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-red-200/60 dark:border-red-400/20 rounded-2xl p-4 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 dark:from-red-500/10 dark:to-pink-500/10 rounded-2xl opacity-0 group-hover/violation:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-red-900 dark:text-red-300 text-lg">
                                  {violation.type}
                                </span>
                                <RiskBadge
                                  level={
                                    violation.severity
                                      ?.charAt(0)
                                      .toUpperCase() +
                                    violation.severity?.slice(1)
                                  }
                                  size="sm"
                                />
                              </div>
                              <p className="text-red-800 dark:text-red-200 leading-relaxed">
                                {violation.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white/60 dark:bg-zinc-800 rounded-2xl border border-gray-200/60 dark:border-zinc-700">
                    <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      No recent violations - excellent compliance record!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          {/* AI Suggestions */}
          <div>
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="flex items-center gap-3 mb-4 text-left w-full"
            >
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  AI-Powered Recommendations
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {actions.length} intelligent actions to optimize risk
                  management
                </p>
              </div>
              {showRecommendations ? (
                <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>

            {showRecommendations && (
              <>
                {actions.length > 0 ? (
                  <div className="space-y-4">
                    {actions.map((action: any) => {
                      const {
                        id,
                        title,
                        description,
                        estimatedImpact,
                        category,
                        recommendedBy,
                        priority,
                        status,
                      } = action;

                      return (
                        <div
                          key={id}
                          className="group/action relative bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-blue-200/60 dark:border-blue-400/20 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-2xl opacity-0 group-hover/action:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="font-bold text-blue-900 dark:text-blue-300 text-lg">
                                    {title}
                                  </span>
                                  <PriorityBadge
                                    priority={formatPriority(priority)}
                                    size="sm"
                                  />
                                  <StatusBadge status={status} size="sm" />
                                </div>
                                <p className="text-blue-800 dark:text-blue-200 mb-4 leading-relaxed">
                                  {description}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                  {estimatedImpact && (
                                    <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                                      <TrendingUp className="h-4 w-4" />
                                      <span className="font-medium">
                                        {estimatedImpact}
                                      </span>
                                    </div>
                                  )}
                                  {category && (
                                    <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                                      <Target className="h-4 w-4" />
                                      <span className="font-medium">
                                        {category}
                                      </span>
                                    </div>
                                  )}
                                  {recommendedBy && (
                                    <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                                      <Sparkles className="h-4 w-4" />
                                      <span className="font-medium">
                                        {recommendedBy}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {status === "pending" && (
                              <div className="flex gap-3 pt-4 border-t border-blue-200/60 dark:border-blue-300/20">
                                <button
                                  onClick={() =>
                                    onActionUpdate(supplier.id, id, "approved")
                                  }
                                  className="group/approve relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                  <CheckCircle className="h-4 w-4 group-hover/approve:scale-110 transition-transform duration-300" />
                                  Approve Action
                                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover/approve:opacity-100 transition-opacity duration-300"></div>
                                </button>
                                <button
                                  onClick={() =>
                                    onActionUpdate(supplier.id, id, "rejected")
                                  }
                                  className="group/reject relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                  <XCircle className="h-4 w-4 group-hover/reject:scale-110 transition-transform duration-300" />
                                  Reject
                                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover/reject:opacity-100 transition-opacity duration-300"></div>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white/60 dark:bg-zinc-800 rounded-2xl border border-gray-200/60 dark:border-zinc-700">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      No AI recommendations at this time - supplier performing
                      optimally!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};