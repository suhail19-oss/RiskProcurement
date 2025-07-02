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
} from "lucide-react";
import { Supplier, RiskViolation, SuggestedAction } from "../types/supplier";
import { RiskBadge } from "./RiskBadge";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";

interface SupplierCardProps {
  supplier: Supplier;
  violations: RiskViolation[];
  actions: SuggestedAction[];
  onActionUpdate: (actionId: string, status: string) => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  violations,
  actions,
  onActionUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const getRiskGradient = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "from-orange-500/10 to-red-500/10";
      case "medium":
        return "from-yellow-500/10 to-orange-500/10";
      case "low":
        return "from-green-500/10 to-emerald-500/10";
      default:
        return "from-gray-500/10 to-slate-500/10";
    }
  };

  return (
    <div className="group relative bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getRiskGradient(
          supplier.riskLevel
        )} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      ></div>

      {/* Header */}
      <div className="relative p-8 border-b border-gray-100/60">
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
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {supplier.name}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {supplier.category}
                  </span>
                  <RiskBadge level={supplier.riskLevel} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-gray-100">
                <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Location
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {supplier.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-gray-100">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Contract Value
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(supplier.contractValue)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-gray-100">
                <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Compliance
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {supplier.complianceScore}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-gray-100">
                <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Last Assessment
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatDate(supplier.lastAssessment)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative ml-6 p-3 hover:bg-white/60 rounded-xl transition-all duration-300 group/btn"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              {isExpanded ? (
                <ChevronUp className="h-6 w-6 text-gray-600 group-hover/btn:text-blue-600 transition-colors duration-300" />
              ) : (
                <ChevronDown className="h-6 w-6 text-gray-600 group-hover/btn:text-blue-600 transition-colors duration-300" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="relative p-8 space-y-8 bg-white/30 backdrop-blur-sm">
          {/* Recent Violations */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  Recent Violations
                </h4>
                <p className="text-sm text-gray-600">
                  {violations.length} active issues requiring attention
                </p>
              </div>
            </div>

            {violations.length > 0 ? (
              <div className="space-y-4">
                {violations.map((violation) => (
                  <div
                    key={violation.id}
                    className="group/violation relative bg-white/80 backdrop-blur-sm border border-red-200/60 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover/violation:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-red-900 text-lg">
                              {violation.type}
                            </span>
                            <RiskBadge level={violation.severity} size="sm" />
                            <StatusBadge status={violation.status} size="sm" />
                          </div>
                          <p className="text-red-800 mb-4 leading-relaxed">
                            {violation.description}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-red-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">
                                Detected: {formatDate(violation.detectedDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              <span className="font-medium">
                                Source: {violation.source}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white/60 rounded-2xl border border-gray-200/60">
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <p className="text-gray-600 font-medium">
                  No recent violations - excellent compliance record!
                </p>
              </div>
            )}
          </div>

          {/* AI Suggested Actions */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  AI-Powered Recommendations
                </h4>
                <p className="text-sm text-gray-600">
                  {actions.length} intelligent actions to optimize risk
                  management
                </p>
              </div>
            </div>

            {actions.length > 0 ? (
              <div className="space-y-4">
                {actions.map((action) => (
                  <div
                    key={action.id}
                    className="group/action relative bg-white/80 backdrop-blur-sm border border-blue-200/60 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover/action:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-bold text-blue-900 text-lg">
                              {action.title}
                            </span>
                            <PriorityBadge
                              priority={action.priority}
                              size="sm"
                            />
                            <StatusBadge status={action.status} size="sm" />
                          </div>
                          <p className="text-blue-800 mb-4 leading-relaxed">
                            {action.description}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
                              <TrendingUp className="h-4 w-4" />
                              <span className="font-medium">
                                {action.estimatedImpact}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
                              <Target className="h-4 w-4" />
                              <span className="font-medium">
                                {action.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
                              <Sparkles className="h-4 w-4" />
                              <span className="font-medium">
                                {action.recommendedBy}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {action.status === "pending" && (
                        <div className="flex gap-3 pt-4 border-t border-blue-200/60">
                          <button
                            onClick={() =>
                              onActionUpdate(action.id, "approved")
                            }
                            className="group/approve relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            <CheckCircle className="h-4 w-4 group-hover/approve:scale-110 transition-transform duration-300" />
                            Approve Action
                            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover/approve:opacity-100 transition-opacity duration-300"></div>
                          </button>
                          <button
                            onClick={() =>
                              onActionUpdate(action.id, "rejected")
                            }
                            className="group/reject relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            <XCircle className="h-4 w-4 group-hover/reject:scale-110 transition-transform duration-300" />
                            Reject
                            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover/reject:opacity-100 transition-opacity duration-300"></div>
                          </button>
                          <button
                            onClick={() =>
                              onActionUpdate(action.id, "completed")
                            }
                            className="group/complete relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            <Clock className="h-4 w-4 group-hover/complete:scale-110 transition-transform duration-300" />
                            Mark Complete
                            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover/complete:opacity-100 transition-opacity duration-300"></div>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white/60 rounded-2xl border border-gray-200/60">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <p className="text-gray-600 font-medium">
                  No AI recommendations at this time - supplier performing
                  optimally!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
