"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  Search,
  Filter,
  Activity,
  AlertTriangle,
  Users,
  X,
} from "lucide-react";
import { SupplierCard } from "./SupplierCard";
import { v4 as uuidv4 } from "uuid";
import { getGeminiRecommendation } from "../utils/gemini";

interface GeminiResponse {
  violations: {
    description: string;
    severity: "Low" | "Medium" | "High";
    category: string;
  }[];
  recommendations: {
    title: string;
    description: string;
    priority:
      | "Low Priority"
      | "Medium Priority"
      | "High Priority"
      | "Urgent Priority";
    category: string;
    estimatedImpact: string;
  }[];
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [actions, setActions] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [violations, setViolations] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAction, setNewAction] = useState({
    supplierName: "",
    riskCategory: "high",
    articleSummary: "",
  });
  const [activeViolations, setActiveViolations] = useState(0);
  const [pendingActions, setPendingActions] = useState(0);
  const [dbSuppliers, setDbSuppliers] = useState<any[]>([]);

  useEffect(() => {
    const totalActive = suppliers
      .map(
        (supplier) =>
          supplier.violations.filter((v: any) => v.status === "pending").length
      )
      .reduce((sum, count) => sum + count, 0);
    setActiveViolations(totalActive);

    const totalPending = suppliers
      .map(
        (supplier: any) =>
          supplier.actions.filter((v: any) => v.status === "pending").length
      )
      .reduce((sum, count) => sum + count, 0);

    setPendingActions(totalPending);
  }, [suppliers]);

  // Helper function to enforce proper priority
  const enforcePriority = (geminiPriority: string, riskCategory: string) => {
    const riskMap = {
      high: "High Priority",
      medium: "Medium Priority",
      low: "Low Priority",
    };

    // First try to use Gemini's priority if valid
    const validPriorities = [
      "Low Priority",
      "Medium Priority",
      "High Priority",
      "Urgent Priority",
    ];
    if (validPriorities.includes(geminiPriority)) {
      return geminiPriority;
    }

    // Fallback to risk-based priority
    return riskMap[riskCategory as keyof typeof riskMap] || "Medium Priority";
  };

  // Helper function to format priority for internal use
  const formatPriority = (
    priority: string
  ): "low" | "medium" | "high" | "urgent" => {
    if (!priority) return "medium";
    const normalized = priority.toLowerCase().replace(" priority", "");
    return normalized === "high"
      ? "high"
      : normalized === "urgent"
      ? "urgent"
      : normalized === "low"
      ? "low"
      : "medium";
  };

  const handleSubmit = async () => {
    const { violations, recommendations } = await getGeminiRecommendation(
      newAction.supplierName,
      newAction.riskCategory,
      newAction.articleSummary
    );

    console.log("Violations:", violations);
    console.log("Recommendations:", recommendations);
  };

  const handleActionUpdate = async (
    supplierId: string,
    actionId: string,
    status: string
  ) => {
    let supplier = suppliers.filter((s: any) => s.id === supplierId)[0];
    const action = supplier.actions.filter((a: any) => a.id === actionId)[0];

    if (action.status === status) return;

    action.status = status;
    const otherActions = supplier.actions.filter((a: any) => a.id !== actionId);
    supplier.actions = [...otherActions, action];
    const otherSuppliers = suppliers.filter((s: any) => s.id !== supplierId);
    if (status === "approved") {
      supplier = {
        ...supplier,
        violations: (() => {
          let updated = false;
          return supplier.violations.map((v: any) => {
            if (!updated && v.status === "pending") {
              updated = true;
              return { ...v, status: "approved" };
            }
            return v;
          });
        })(),
      };
    }
    const updatedSuppliers = suppliers.map((s) =>
      s.id === supplierId ? supplier : s
    );
    setSuppliers(updatedSuppliers);

    const payload = {
      actions: supplier.actions,
      violations: supplier.violations,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/actions/${supplierId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Update failed:", data.error || res.statusText);
      } else {
        console.log("Update successful:", data.message);
      }
    } catch (error) {
      console.error("Network or server error:", error);
    }
  };

  const filteredSuppliers = suppliers.filter((supplier: any) => {
    const matchesSearch =
      supplier.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk =
      filterRisk === "all" || supplier.riskLevel === filterRisk;

    return matchesSearch && matchesRisk;
  });

  const getSupplierViolations = (supplierId: string) => {
    const merged = [
      ...violations.filter((v: any) => v.supplierId === supplierId),
      ...actions
        .filter((a) => a.supplierId === supplierId && a.violation)
        .map((a) => ({
          id: `ai-violation-${a.id}`,
          supplierId: a.supplierId,
          type: a.category
            ? a.category.charAt(0).toUpperCase() + a.category.slice(1)
            : "General Risk",

          severity: formatPriority(a.priority),
          description: a.violation,
          detectedDate: a.createdAt || new Date().toISOString(),
          source: "Gemini AI",
          status: "pending",
        })),
    ];

    return merged.slice(0, 3); // Limit to max 3
  };

  const getSupplierActions = (supplierId: string) =>
    actions.filter((a) => a.supplierId === supplierId);

  const highRiskSuppliers = suppliers.filter(
    (s: any) => s.risk_level === "High"
  ).length;

  const calculateRiskLevel = (risk: number) => {
    if (risk > 35) return "High";
    if (risk >= 28) return "Medium";
    return "Low";
  };

  useEffect(() => {
    const fetchFromDB = async () => {
      try {
        const [suppliersRes, actionsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/suppliers`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/actions`),
        ]);
        const suppliersData = await suppliersRes.json();
        const actionsData = await actionsRes.json();
        // console.log('aupplier data from DB: ', suppliersData.suppliers);
        // console.log('acttions data from DB: ', actionsData);

        setDbSuppliers(suppliersData.suppliers || []);
        const enrichedSuppliers = (actionsData.actions || [])
          .map((supplier: any) => {
            const latestAction = supplier.actions?.length
              ? [...supplier.actions].sort(
                  (a, b) =>
                    new Date(b.createdAt || "").getTime() -
                    new Date(a.createdAt || "").getTime()
                )[0]
              : null;

            return {
              ...supplier,
              lastAssessment:
                latestAction?.createdAt || latestAction?.lastAssessedAt || null,
            };
          })
          .sort((a: any, b: any) => {
            const aDate = new Date(a.lastAssessment || 0).getTime();
            const bDate = new Date(b.lastAssessment || 0).getTime();
            return bDate - aDate;
          });

        setSuppliers(enrichedSuppliers);
      } catch (err) {
        setDbSuppliers([]);
        setSuppliers([]);
      }
    };
    fetchFromDB();
  }, []);

  const getSupplierLatestAssessment = (supplier: any) => {
    if (!supplier?.actions?.length) return "N/A";

    const sorted = [...supplier.actions].sort(
      (a, b) =>
        new Date(b.createdAt || b.lastAssessedAt || 0).getTime() -
        new Date(a.createdAt || a.lastAssessedAt || 0).getTime()
    );

    const latest = sorted[0];
    const date = latest?.createdAt || latest?.lastAssessedAt;

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
              count: activeViolations,
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

        {/* Filters and Recommend Button */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 w-full">
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

            <button
              onClick={() => setIsModalOpen(true)}
              className="ml-auto px-4 py-3 bg-[#E2142D] text-white font-semibold rounded-xl hover:bg-[#c81029] transition-all"
            >
              + Recommend Action
            </button>
          </div>
        </div>

        {/* Supplier List */}
        <div className="space-y-6">
          {filteredSuppliers.map((supplier: any, index) => (
            <SupplierCard
              key={supplier.id ?? index}
              supplier={supplier}
              lastAssessmentDate={getSupplierLatestAssessment(supplier)}
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

        {/* Recommend Action Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-lg w-full relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Recommend Action
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Supplier Name
                  </label>
                  <select
                    value={newAction.supplierName}
                    onChange={(e) => {
                      const supp = dbSuppliers.find(
                        (supplier) => supplier.company_name == e.target.value
                      );
                      const risk_s = supp.risk_score;
                      const risk_level = calculateRiskLevel(risk_s);
                      console.log("risk_level: ", risk_level);
                      setNewAction({
                        ...newAction,
                        supplierName: e.target.value,
                        riskCategory: risk_level,
                      });
                    }}
                    className="w-full mt-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a supplier</option>
                    {dbSuppliers.map((supplier: any, idx: number) => (
                      <option key={idx} value={supplier.company_name}>
                        {supplier.company_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Risk Category
                  </label>
                  <select
                    value={newAction.riskCategory}
                    disabled
                    className="w-full mt-1 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl appearance-none bg-no-repeat pr-4"
                    style={{
                      backgroundImage: "none", // Hide dropdown arrow
                    }}
                  >
                    <option value="High">High Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="Low">Low Risk</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Summary of Articles
                  </label>
                  <textarea
                    rows={4}
                    value={newAction.articleSummary}
                    onChange={(e) =>
                      setNewAction({
                        ...newAction,
                        articleSummary: e.target.value,
                      })
                    }
                    className="w-full mt-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>

                <button
                  onClick={async () => {
                    try {
                      const id = uuidv4();
                      const now = new Date().toISOString();
                      const newSupplier = dbSuppliers.find(
                        (supplier) =>
                          supplier.company_name == newAction.supplierName
                      );
                      newSupplier.id = id;
                      // Get the response from Gemini
                      const { violations: newViolations, recommendations } =
                        await getGeminiRecommendation(
                          newAction.supplierName,
                          newAction.riskCategory,
                          newAction.articleSummary
                        );

                      if (!recommendations || recommendations.length === 0) {
                        alert("No recommendations generated. Try again.");
                        return;
                      }

                      // Add new violations
                      if (newViolations && newViolations.length > 0) {
                        const formattedViolations = newViolations.map(
                          (v: any) => ({
                            id: uuidv4(),
                            supplierId: id,
                            type:
                              v.category?.charAt(0).toUpperCase() +
                                v.category.slice(1) || "General Risk",
                            severity: v.severity.toLowerCase(),
                            description: v.description,
                            detectedDate: new Date().toISOString(),
                            source: "Gemini AI",
                            status: "pending",
                          })
                        );
                        newSupplier.violations = formattedViolations;
                      }

                      // Create actions for each recommendation
                      const newActions = recommendations.map(
                        (recommendation: any) => {
                          const enforcedPriority = enforcePriority(
                            recommendation.priority,
                            newAction.riskCategory
                          );

                          return {
                            id: uuidv4(),
                            supplierId: id,
                            title: recommendation.title,
                            description: recommendation.description,
                            priority: enforcedPriority,
                            category: recommendation.category,
                            estimatedImpact: recommendation.estimatedImpact,
                            recommendedBy: "Gemini AI",
                            createdAt: new Date().toISOString(),
                            status: "pending" as const,
                            lastAssessedAt: new Date().toISOString(),
                            violation:
                              newViolations[0]?.description ||
                              "General risk identified",
                            geminiRaw: JSON.stringify({
                              recommendation,
                              violations: newViolations,
                            }),
                          };
                        }
                      );
                      newSupplier.actions = newActions;
                      newSupplier.lastAssessment = new Date().toISOString(); // ✅ Important for sorting and immediate UI update

                      const actionDoc = {
                        company_name: newSupplier.company_name,
                        location: newSupplier.location,
                        id: newSupplier.id,
                        violations: newSupplier.violations,
                        actions: newSupplier.actions,
                        risk_score: Math.round(newSupplier.risk_score),
                        risk_level: newSupplier.risk_level,
                        product_id: newSupplier.product_id,
                        lastAssessment: newSupplier.lastAssessment,
                        contract_value:
                          newSupplier?.risk_subfactors?.[
                            "contract_value(100m_800m)"
                          ] ?? 1000000000,   
                        penalty: (newSupplier?.risk_subfactors?.legal_dispute_score ? Math.round(newSupplier.risk_subfactors.legal_dispute_score*100) : 30)
                      };

                      // Call the backend to create the action
                      await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/actions`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(actionDoc),
                        }
                      );
                      setSuppliers([newSupplier, ...suppliers]);

                      setIsModalOpen(false);
                      setNewAction({
                        supplierName: "",
                        riskCategory: "high",
                        articleSummary: "",
                      });
                    } catch (err) {
                      alert(
                        "Something went wrong while generating recommendation."
                      );
                      console.error(err);
                    }
                  }}
                  className="w-full py-3 mt-4 bg-[#E2142D] text-white font-semibold rounded-xl hover:bg-[#c81029] transition-all"
                >
                  Submit and Recommend
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}