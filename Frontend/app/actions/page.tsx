"use client";

import { useState } from "react";
import {
  Shield,
  Search,
  Filter,
  Download,
  RefreshCw,
  Activity,
  AlertTriangle,
  Users,
} from "lucide-react";
import { SupplierCard } from "./SupplierCard";
import { suppliers, violations, suggestedActions } from "../data/mockData";
import { SuggestedAction } from "../types/supplier";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [actions, setActions] = useState<SuggestedAction[]>(suggestedActions);

  const handleActionUpdate = (actionId: string, status: string) => {
    setActions((prev) =>
      prev.map((action) =>
        action.id === actionId
          ? { ...action, status: status as SuggestedAction["status"] }
          : action
      )
    );
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk =
      filterRisk === "all" || supplier.riskLevel === filterRisk;

    return matchesSearch && matchesRisk;
  });

  const getSupplierViolations = (supplierId: string) =>
    violations.filter((v) => v.supplierId === supplierId);

  const getSupplierActions = (supplierId: string) =>
    actions.filter((a) => a.supplierId === supplierId);

  const totalViolations = violations.length;
  const pendingActions = actions.filter((a) => a.status === "pending").length;
  const highRiskSuppliers = suppliers.filter(
    (s) => s.riskLevel === "high"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800/60 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Suppliers",
              count: suppliers.length,
              color: "blue",
              icon: <Users className="h-7 w-7 text-white" />,
              note: "+2 this month",
              textColor: "text-gray-900 dark:text-white",
              noteColor: "text-green-600",
            },
            {
              title: "Active Violations",
              count: totalViolations,
              color: "red",
              icon: <AlertTriangle className="h-7 w-7 text-white" />,
              note: "-1 from last week",
              textColor: "text-red-600",
              noteColor: "text-red-600",
            },
            {
              title: "Pending Actions",
              count: pendingActions,
              color: "amber",
              icon: <Activity className="h-7 w-7 text-white" />,
              note: "Requires attention",
              textColor: "text-amber-600",
              noteColor: "text-amber-600",
            },
            {
              title: "High Risk",
              count: highRiskSuppliers,
              color: "red",
              icon: <Shield className="h-7 w-7 text-white" />,
              note: "Immediate action",
              textColor: "text-red-600",
              noteColor: "text-red-600",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {card.title}
                  </p>
                  <p className={`text-3xl font-bold ${card.textColor}`}>
                    {card.count}
                  </p>
                  <p className={`text-xs font-medium mt-1 ${card.noteColor}`}>
                    {card.note}
                  </p>
                </div>
                <div
                  className={`h-14 w-14 bg-gradient-to-br from-${
                    card.color
                  }-500 to-${
                    card.color === "amber" ? "yellow" : card.color
                  }-600 rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                <input
                  type="text"
                  placeholder="Search suppliers, categories, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-medium"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="px-4 py-3.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 dark:text-white font-medium min-w-[160px]"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Supplier List */}
        <div className="space-y-6">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              violations={getSupplierViolations(supplier.id)}
              actions={getSupplierActions(supplier.id)}
              onActionUpdate={handleActionUpdate}
            />
          ))}
        </div>

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full blur opacity-20"></div>
              <div className="relative bg-gradient-to-r from-gray-400 to-gray-500 p-4 rounded-full">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 mt-6">
              No suppliers found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Try adjusting your search criteria or filter settings to find the
              suppliers you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
