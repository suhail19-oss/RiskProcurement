"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
} from "recharts"
import { Leaf, Users, Shield, AlertCircle, CheckCircle, Star, TrendingUp, Award, Filter, Search } from "lucide-react"
import { Chatbot } from "@/components/chatbot"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"


function getStatusIcon(score: number) {
    if (score >= 90) {
        return (
            <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-700">excellent</span>
            </div>
        );
    } else if (score >= 75) {
        return (
            <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-blue-700">good</span>
            </div>
        );
    } else if (score >= 60) {
        return (
            <div className="flex items-center space-x-1">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-xs text-yellow-700">fair</span>
            </div>
        );
    } else {
        return (
            <div className="flex items-center space-x-1">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-xs text-red-700">poor</span>
            </div>
        );
    }
}


function getStatusColor(score: number) {
    if (score >= 90) {
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    } else if (score >= 75) {
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    } else if (score >= 60) {
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    } else {
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
}




export default function CostEfficiencyAnalysis() {
    const [selectedSupplier, setSelectedSupplier] = useState("")
    const [selectedSupplierC, setSelectedSupplierC] = useState("")
    const [activeTab, setActiveTab] = useState("costEfficiency-analysis")
    const [costEfficiencyScore, setCostEfficiencyScore] = useState<number | null>(null);
    const [costEfficiencyScoreC, setCostEfficiencyScoreC] = useState<number | null>(null);
    const [unitPriceScore, setUnitPriceScore] = useState("");
    const [volumeDiscountScore, setVolumeDiscountScore] = useState("");
    const [paymentTermsScore, setPaymentTermsScore] = useState("");
    const [transitDelayScore, setTransitDelayScore] = useState("");
    const [fpyScore, setFpyScore] = useState("");
    const [recallScore, setRecallScore] = useState("");
    const [sanctionsScore, setSanctionsScore] = useState("");
    const [laborViolationScore, setLaborViolationScore] = useState("");
    const [tradePolicyScore, setTradePolicyScore] = useState("");
    const [warZoneScore, setWarZoneScore] = useState("");
    const [contractValueScore, setContractValueScore] = useState("");
    const [legalDisputeScore, setLegalDisputeScore] = useState("");
    const { toast } = useToast()


    type Supplier = {
        product_id: number;
        company_name: string;
        email_domain: string;
        location: string;
        cost_score: number;
        cost_upload_status: "success" | "pending" | "failed";
        cost_subfactors: {
            unit_price_benchmarking: number;
            volume_discount_potential: number;
            payment_terms_flexibility: number;
            in_transit_delay_days: number;
            old_in_transit_delay_factor: number;
            new_in_transit_delay_factor: number;
            normalized_in_transit_delay_factor: number;
            first_pass_yield: number;
            legal_disputes: number;
            legal_dispute_score: number;
            contract_value: number;
            war_zone_norm: number;
            trade_policy_norm: number;
            labor_violation_risk: number;
            recall_score: number;
            govt_sanctions: string | null;
            war_zone_flag: number;
            labor_violations: string;
            trade_policy_changes: string;
            sanction_score: number;
        };
        cost_efficiency_normalized_scores: {
            unit_price_score: number,
            volume_discount_score: number,
            payment_terms_score: number,
            transit_delay_score: number,
            fpy_score: number,
            recall_score: number,
            legal_dispute_score: number,
            sanctions_score: number,
            labor_violation_score: number,
            trade_policy_score: number,
            war_zone_score: number,
            contract_value_score: number,
        }

    };

    //fetchins suppliers
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [suppliersC, setSuppliersC] = useState<Supplier[]>([]);
    useEffect(() => {
        const fetchSuppliers = async () => {
            const res = await fetch("http://localhost:8000/api/suppliers");
            const data = await res.json();
            console.log("Fetched suppliers:", data.suppliers);
            setSuppliers(data.suppliers);
        };

        fetchSuppliers();
    }, []);

    useEffect(() => {
        const fetchProfileAndSetCompany = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No authentication token found");
                }

                const response = await fetch("http://localhost:8000/profile/me", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }

                const data = await response.json();

                // Just get company_name
                const companyName = data.data.company_name;

                if (companyName) {
                    // Set selectedSupplier
                    setSelectedSupplier(companyName);
                    // Optionally store in localStorage
                    localStorage.setItem("company_name", companyName);

                    // Find supplier with this name
                    const supplierWithScore = suppliers.find(
                        (s) => s.company_name === companyName
                    );

                    setCostEfficiencyScore(supplierWithScore?.cost_score ?? 0);
                } else {
                    // Fallback if company_name missing
                    setSelectedSupplier("");
                    setCostEfficiencyScore(0);

                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast({
                    title: "Error",
                    description: "Failed to load profile data",
                    variant: "destructive",
                });
                // Fallback in case of error
                setSelectedSupplier("");
                setCostEfficiencyScore(0);
            } finally {

            }
        };

        // Call the async function
        fetchProfileAndSetCompany();
    }, [suppliers]);





    // For the pei chart 
    useEffect(() => {
        const fetchCompanyESGData = () => {
            try {

                // Find the specific company by ID
                const supplier = suppliers.find(s => s.company_name === selectedSupplier);

                if (supplier) {
                    setCostEfficiencyScore(supplier.cost_score || 0);

                } else {
                    setCostEfficiencyScore(0);
                }
            } catch (err) {

            }
        };

        fetchCompanyESGData();
    }, [selectedSupplier]);

    useEffect(() => {
        const supplier = suppliers.find(s => s.company_name === selectedSupplier);

        if (!supplier || !supplier.cost_subfactors) return;

        const cost = supplier.cost_subfactors;

        // Convert raw fields to numbers safely
        const unitPriceBenchmarkingNum = Number(cost.unit_price_benchmarking) || 0;
        const volumeDiscountPotentialNum = Number(cost.volume_discount_potential) || 0;
        const paymentTermsFlexibilityNum = Number(cost.payment_terms_flexibility) || 0;
        const inTransitDelaysDaysNum = Number(cost.in_transit_delay_days) || 0;
        const fpyNormalizedNum = Number(cost.first_pass_yield) || 0;
        const recallScoreOutOf100Num = Number(cost.recall_score) || 0;
        const legalDisputeScoreNum = Number(cost.legal_dispute_score) || 0;
        const sanctionScoreNum = Number(cost.sanction_score) || 0;
        const laborViolationRiskNum = Number(cost.labor_violation_risk) || 0;
        const tradePolicyNormNum = Number(cost.trade_policy_norm) || 0;
        const warZoneNormNum = Number(cost.war_zone_norm) || 0;
        const contractValueNum = Number(cost.contract_value) || 0;

        // Compute scores
        const unitPriceScore = unitPriceBenchmarkingNum * 100;
        const volumeDiscountScore = volumeDiscountPotentialNum * 100;
        const paymentTermsScore = paymentTermsFlexibilityNum * 100;
        const transitDelayScore = (1 - inTransitDelaysDaysNum / 30) * 100;
        const fpyScore = fpyNormalizedNum * 100;
        const recallScore = 100 - recallScoreOutOf100Num;
        const legalDisputeScore = (1 - legalDisputeScoreNum) * 100;
        const sanctionsScore = (1 - sanctionScoreNum) * 100;
        const laborViolationScore = (1 - laborViolationRiskNum) * 100;
        const tradePolicyScore = (1 - tradePolicyNormNum) * 100;
        const warZoneScore = (1 - warZoneNormNum) * 100;
        const contractValueScore = ((contractValueNum - 100000000) / 700000000) * 100;

        const costEfficiencyScoreCal =
            (unitPriceScore * 0.20) +
            (volumeDiscountScore * 0.10) +
            (paymentTermsScore * 0.10) +
            (transitDelayScore * 0.10) +
            (fpyScore * 0.10) +
            (recallScore * 0.10) +
            (legalDisputeScore * 0.05) +
            (sanctionsScore * 0.05) +
            (laborViolationScore * 0.05) +
            (tradePolicyScore * 0.05) +
            (warZoneScore * 0.05) +
            (contractValueScore * 0.05);

        // Set the final score to the state hook as number with 2 decimal precision
        setCostEfficiencyScoreC(parseFloat(costEfficiencyScoreCal.toFixed(2)));

        // Set scores to state hooks
        setUnitPriceScore(unitPriceScore.toFixed(2));
        setVolumeDiscountScore(volumeDiscountScore.toFixed(2));
        setPaymentTermsScore(paymentTermsScore.toFixed(2));
        setTransitDelayScore(transitDelayScore.toFixed(2));
        setFpyScore(fpyScore.toFixed(2));
        setRecallScore(recallScore.toFixed(2));
        setLegalDisputeScore(legalDisputeScore.toFixed(2));
        setSanctionsScore(sanctionsScore.toFixed(2));
        setLaborViolationScore(laborViolationScore.toFixed(2));
        setTradePolicyScore(tradePolicyScore.toFixed(2));
        setWarZoneScore(warZoneScore.toFixed(2));
        setContractValueScore(contractValueScore.toFixed(2));

    }, [selectedSupplier, suppliers]);


    useEffect(() => {
        if (!selectedSupplier) {
            // Reset all scores if no supplier is selected
            resetAllScores();
            return;
        }

        const supplier = suppliers.find(s => s.company_name === selectedSupplier);

        if (!supplier) {
            resetAllScores();
            return;
        }


    }, [selectedSupplier, suppliers]);


    const resetAllScores = () => {
        setUnitPriceScore("");
        setVolumeDiscountScore("");
        setPaymentTermsScore("");
        setTransitDelayScore("");
        setFpyScore("");
        setRecallScore("");
        setSanctionsScore("");
        setLaborViolationScore("");
        setTradePolicyScore("");
        setWarZoneScore("");
        setContractValueScore("");
    };

    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Tab value to route mapping
    const tabToRoute: Record<string, string> = {
        ESG: "/esg-analysis",
        Risk: "/risk-analysis",
        "Cost Efficiency": "/costEfficiency-analysis",
        Reliability: "/reliability-analysis",
    };

    // Handler for tab change
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        if (tabToRoute[tab]) {
            router.push(tabToRoute[tab]);
        }
    };

    //company

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        
        if (userData.role === "Supplier") return;

        const fetchSuppliers = async () => {
            const res = await fetch("http://localhost:8000/api/suppliers");
            const data = await res.json();
         
            setSuppliersC(data.suppliers);
        };

        fetchSuppliers();
    }, []);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        if (userData.role === "Supplier") return;

        const supplier = suppliersC.find(s => s.company_name === selectedSupplierC);
        if (!supplier || !supplier.cost_subfactors) return;

        const cost = supplier.cost_subfactors;

        const unitPriceBenchmarkingNum = Number(cost.unit_price_benchmarking) || 0;
        const volumeDiscountPotentialNum = Number(cost.volume_discount_potential) || 0;
        const paymentTermsFlexibilityNum = Number(cost.payment_terms_flexibility) || 0;
        const inTransitDelaysDaysNum = Number(cost.in_transit_delay_days) || 0;
        const fpyNormalizedNum = Number(cost.first_pass_yield) || 0;
        const recallScoreOutOf100Num = Number(cost.recall_score) || 0;
        const legalDisputeScoreNum = Number(cost.legal_dispute_score) || 0;
        const sanctionScoreNum = Number(cost.sanction_score) || 0;
        const laborViolationRiskNum = Number(cost.labor_violation_risk) || 0;
        const tradePolicyNormNum = Number(cost.trade_policy_norm) || 0;
        const warZoneNormNum = Number(cost.war_zone_norm) || 0;
        const contractValueNum = Number(cost.contract_value) || 0;

        const unitPriceScore = unitPriceBenchmarkingNum * 100;
        const volumeDiscountScore = volumeDiscountPotentialNum * 100;
        const paymentTermsScore = paymentTermsFlexibilityNum * 100;
        const transitDelayScore = (1 - inTransitDelaysDaysNum / 30) * 100;
        const fpyScore = fpyNormalizedNum * 100;
        const recallScore = 100 - recallScoreOutOf100Num;
        const legalDisputeScore = (1 - legalDisputeScoreNum) * 100;
        const sanctionsScore = (1 - sanctionScoreNum) * 100;
        const laborViolationScore = (1 - laborViolationRiskNum) * 100;
        const tradePolicyScore = (1 - tradePolicyNormNum) * 100;
        const warZoneScore = (1 - warZoneNormNum) * 100;
        const contractValueScore = ((contractValueNum - 100000000) / 700000000) * 100;

         const costEfficiencyScoreCal =
            (unitPriceScore * 0.20) +
            (volumeDiscountScore * 0.10) +
            (paymentTermsScore * 0.10) +
            (transitDelayScore * 0.10) +
            (fpyScore * 0.10) +
            (recallScore * 0.10) +
            (legalDisputeScore * 0.05) +
            (sanctionsScore * 0.05) +
            (laborViolationScore * 0.05) +
            (tradePolicyScore * 0.05) +
            (warZoneScore * 0.05) +
            (contractValueScore * 0.05);
        
            console.log("Cost Efficiency Score Calculation:", costEfficiencyScoreCal)

        // Set the final score to the state hook as number with 2 decimal precision
        setCostEfficiencyScoreC(parseFloat(costEfficiencyScoreCal.toFixed(2)));


        setUnitPriceScore(unitPriceScore.toFixed(2));
        setVolumeDiscountScore(volumeDiscountScore.toFixed(2));
        setPaymentTermsScore(paymentTermsScore.toFixed(2));
        setTransitDelayScore(transitDelayScore.toFixed(2));
        setFpyScore(fpyScore.toFixed(2));
        setRecallScore(recallScore.toFixed(2));
        setLegalDisputeScore(legalDisputeScore.toFixed(2));
        setSanctionsScore(sanctionsScore.toFixed(2));
        setLaborViolationScore(laborViolationScore.toFixed(2));
        setTradePolicyScore(tradePolicyScore.toFixed(2));
        setWarZoneScore(warZoneScore.toFixed(2));
        setContractValueScore(contractValueScore.toFixed(2));

    }, [selectedSupplierC, suppliersC]);

    const [role, setRole] = useState<string | null>(null);
    useEffect(() => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("userData");
    const parsed = stored ? JSON.parse(stored) : {};
    setRole(parsed?.role || null);
  }
}, []);



    return (
        <div className="relative pt-20 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="container mx-auto p-6 space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#E2142D] via-[#2563eb] to-[#a21caf] bg-clip-text text-transparent animate-gradient">
                        <span className="bg-gradient-to-r from-[#E2142D] via-[#2563eb] to-[#a21caf] bg-clip-text text-transparent animate-gradient-text ">Cost Efficiency Factor Analysis</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Comprehensive cost efficiency evaluation
                    </p>
                </motion.div>

                {JSON.parse(localStorage.getItem("userData") || "{}")?.role !== "Supplier" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex justify-center"
                        >
                            {activeTab === "costEfficiency-analysis" && (
                                <Select value={selectedSupplierC} onValueChange={setSelectedSupplierC}>
                                    <SelectTrigger className="w-64 transition-all duration-300 hover:shadow-lg">
                                        <SelectValue placeholder="Select a supplier">
                                            {selectedSupplierC || "Select a supplier"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {suppliersC.map((supplier) => (
                                            <SelectItem
                                                key={`${supplier.company_name}_${supplier.email_domain}_${supplier.product_id}`}
                                                value={String(supplier.company_name)}
                                                disabled={supplier.cost_upload_status !== "success"}
                                            >
                                                {supplier.company_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </motion.div>
                    )}


                <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="w-full mb-10"
                >
                    <TabsList className="w-full overflow-x-auto whitespace-nowrap flex gap-2 sm:justify-center">
                        <TabsTrigger value="ESG" className="px-4 py-2 text-sm sm:text-base">
                            ESG
                        </TabsTrigger>
                        <TabsTrigger value="Risk" className="px-4 py-2 text-sm sm:text-base">
                            Risk
                        </TabsTrigger>
                        <TabsTrigger value="Cost Efficiency" className="px-4 py-2 text-sm sm:text-base">
                            Cost Efficiency
                        </TabsTrigger>
                        <TabsTrigger value="Reliability" className="px-4 py-2 text-sm sm:text-base">
                            Reliability
                        </TabsTrigger>
                    </TabsList>
                </Tabs>


                <Tabs value={activeTab} onValueChange={setActiveTab} className="">
                    <TabsContent value="costEfficiency-analysis" className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="grid lg:grid-cols-2 gap-6"
                        >
                            { /* overall score component */}
                            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                                <CardHeader>
                                    <CardTitle>Overall Cost Efficiency Score</CardTitle>
                                    <CardDescription>
                                        {selectedSupplier
                                            ? `For ${selectedSupplier}`
                                            : "Select a supplier to view score"}
                                    </CardDescription>

                                </CardHeader>
                                <CardContent>
                                    <div className="text-center space-y-4">
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                            className="text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                                        >
                                            {costEfficiencyScoreC !== null ? costEfficiencyScoreC.toFixed(1) : "N/A"}
                                        </motion.div>
                                        <div className="text-lg text-muted-foreground">out of 100</div>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-md px-5 py-1.5 rounded-full transition-all duration-300",
                                                costEfficiencyScoreC !== null && costEfficiencyScoreC >= 85
                                                    ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                                                    : costEfficiencyScoreC !== null && costEfficiencyScoreC >= 70
                                                        ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                                                        : costEfficiencyScoreC !== null && costEfficiencyScoreC >= 50
                                                            ? "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200"
                                                            : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                                            )}
                                        >
                                            {costEfficiencyScoreC !== null
                                                ? costEfficiencyScoreC >= 85
                                                    ? "Excellent"
                                                    : costEfficiencyScoreC >= 70
                                                        ? "Good"
                                                        : costEfficiencyScoreC >= 50
                                                            ? "Fair"
                                                            : "Poor"
                                                : "N/A"}{" "}
                                            Performance
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                                <CardHeader>
                                    <CardTitle>Cost Efficiency Breakdown</CardTitle>
                                    <CardDescription>Score distribution across pillars</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="relative"
                                    >
                                        <ResponsiveContainer width="100%" height={400}>
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: "Unit Price", value: Number(unitPriceScore), color: "#22c55e" },
                                                        { name: "Volume Discount", value: Number(volumeDiscountScore), color: "#3b82f6" },
                                                        { name: "Payment Terms", value: Number(paymentTermsScore), color: "#f59e0b" },
                                                        { name: "Transit Delay", value: Number(transitDelayScore), color: "#ec4899" },
                                                        { name: "FPY", value: Number(fpyScore), color: "#8b5cf6" },
                                                        { name: "Recall", value: Number(recallScore), color: "#ef4444" },
                                                        { name: "Sanctions", value: Number(sanctionsScore), color: "#14b8a6" },
                                                        { name: "Labor Violation", value: Number(laborViolationScore), color: "#f97316" },
                                                        // { name: "Trade Policy", value: Number(tradePolicyScore), color: "#eab308" },
                                                        { name: "War Zone", value: Number(warZoneScore), color: "#0ea5e9" },
                                                        { name: "Contract Value", value: Number(contractValueScore), color: "#10b981" },
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={100}
                                                    outerRadius={160}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                    animationBegin={500}
                                                    animationDuration={1000}
                                                    animationEasing="ease-out"

                                                    labelLine={false}
                                                >
                                                    {[
                                                        { name: "Unit Price", color: "#22c55e" },
                                                        { name: "Volume Discount", color: "#3b82f6" },
                                                        { name: "Payment Terms", color: "#f59e0b" },
                                                        { name: "Transit Delay", color: "#ec4899" },
                                                        { name: "FPY", color: "#8b5cf6" },
                                                        { name: "Recall", color: "#ef4444" },
                                                        { name: "Sanctions", color: "#14b8a6" },
                                                        { name: "Labor Violation", color: "#f97316" },
                                                        { name: "Trade Policy", color: "#eab308" },
                                                        { name: "War Zone", color: "#0ea5e9" },
                                                        { name: "Contract Value", color: "#10b981" },
                                                    ].map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color}
                                                            stroke="#fff"
                                                            strokeWidth={1}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    content={({ payload }) => {
                                                        if (!payload || !payload.length) return null;

                                                        return (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                className="bg-white p-3 rounded-lg shadow-lg border border-gray-200"
                                                            >
                                                                <p className="font-bold" style={{ color: payload[0].payload.color }}>
                                                                    {payload[0].name}
                                                                </p>
                                                                <p>Value: {payload[0].value}</p>

                                                            </motion.div>
                                                        );
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>

                                        <div className="flex flex-col items-center mt-4 space-y-2">
                                            <div className="flex justify-center space-x-4">
                                                {[
                                                    { name: "Unit Price", color: "#22c55e" },
                                                    { name: "Volume Discount", color: "#3b82f6" },
                                                    { name: "Payment Terms", color: "#f59e0b" },
                                                    { name: "Transit Delay", color: "#ec4899" },
                                                    { name: "FPY", color: "#8b5cf6" },
                                                ].map((entry, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <div
                                                            className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                                                            style={{ backgroundColor: entry.color, minWidth: "1rem", minHeight: "1rem" }}
                                                        />
                                                        <span className="text-sm">{entry.name}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <div className="flex justify-center space-x-4">
                                                {[
                                                    { name: "Recall", color: "#ef4444" },
                                                    { name: "Sanctions", color: "#14b8a6" },
                                                    { name: "Labor Violation", color: "#f97316" },
                                                    { name: "War Zone", color: "#0ea5e9" },
                                                    { name: "Contract Value", color: "#10b981" },
                                                ].map((entry, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <div
                                                            className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                                                            style={{ backgroundColor: entry.color, minWidth: "1rem", minHeight: "1rem" }}
                                                        />
                                                        <span className="text-sm">{entry.name}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>

                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <Accordion type="single" collapsible className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <AccordionItem value="cost" className="border rounded-lg px-4 transition-all duration-300 hover:shadow-lg">
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full transition-all duration-300 hover:scale-110">
                                                <Leaf className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-xl font-semibold">Cost Performance </h3>
                                                <p className="text-sm text-muted-foreground">Financial impact and resource utilization</p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-4 pt-4">
                                        <div className="grid gap-4">
                                            {/* Environmental Score Cards */}
                                            {[
                                                { name: "Unit Price Score", score: unitPriceScore, description: "Benchmarking against unit price standards" },
                                                { name: "Volume Discount Score", score: volumeDiscountScore, description: "Potential for volume-based discounts" },
                                                { name: "Payment Terms Score", score: paymentTermsScore, description: "Flexibility of payment terms" },
                                                { name: "Sanctions Score", score: sanctionsScore, description: "Exposure to sanctions or penalties" },
                                                { name: "Transit Delay Score", score: transitDelayScore, description: "In-transit delay performance" },
                                                { name: "FPY Score", score: fpyScore, description: "First pass yield (quality) score" },
                                                { name: "Recall Score", score: recallScore, description: "Product recall performance" },
                                                { name: "Labor Violation Score", score: laborViolationScore, description: "Risk of labor violations" },
                                                { name: "Trade Policy Score", score: tradePolicyScore, description: "Exposure to trade policy changes" },
                                                { name: "War Zone Score", score: warZoneScore, description: "Exposure to war zones" },
                                                { name: "Contract Value Score", score: contractValueScore, description: "Contract value contribution" },
                                                { name: "Legal Disupte Score", score: legalDisputeScore, description: "Legal Dispute Score" }
                                            ]
                                                .map((item, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                                    >
                                                        <Card className="transition-all duration-300 hover:shadow-md">
                                                            <CardContent className="p-4">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center space-x-2">
                                                                        {getStatusIcon(Number(item.score))}
                                                                        <span className="font-medium">{item.name}</span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-sm font-medium">{Number(item.score).toFixed(1)}/100</span>
                                                                        <Badge variant="outline" className={getStatusColor(Number(item.score))}>
                                                                            {Number(item.score) >= 90
                                                                                ? "excellent"
                                                                                : Number(item.score) >= 75
                                                                                    ? "good"
                                                                                    : Number(item.score) >= 60
                                                                                        ? "fair"
                                                                                        : "poor"}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                                <Progress
                                                                    value={Number(item.score)}
                                                                    className="mb-2 transition-all duration-300"
                                                                />
                                                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </motion.div>

                            <AccordionItem value="Efficiency" className="border rounded-lg px-4">
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                                            <Users className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xl font-semibold">Efficiency Performance</h3>
                                            <p className="text-sm text-muted-foreground">Process performance and resource utilization</p>

                                        </div>

                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">

                                    <div className="grid gap-4">
                                        {/* Retention Score */}
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusIcon(Number(transitDelayScore))}
                                                        <span className="font-medium">Transit Delay Score</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium">{Number(transitDelayScore).toFixed(1)}/100</span>
                                                        <Badge variant="outline" className={getStatusColor(Number(transitDelayScore))}>
                                                            {Number(transitDelayScore) >= 90
                                                                ? "excellent"
                                                                : Number(transitDelayScore) >= 75
                                                                    ? "good"
                                                                    : Number(transitDelayScore) >= 60
                                                                        ? "fair"
                                                                        : "poor"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Progress value={Number(transitDelayScore)} className="mb-2" />
                                                <p className="text-sm text-muted-foreground">Employee retention rate</p>
                                            </CardContent>
                                        </Card>

                                        {/* Safety Score */}
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusIcon(Number(fpyScore))}
                                                        <span className="font-medium">FPY Score</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium">{Number(fpyScore).toFixed(1)}/100</span>
                                                        <Badge variant="outline" className={getStatusColor(Number(fpyScore))}>
                                                            {Number(fpyScore) >= 90
                                                                ? "excellent"
                                                                : Number(fpyScore) >= 75
                                                                    ? "good"
                                                                    : Number(fpyScore) >= 60
                                                                        ? "fair"
                                                                        : "poor"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Progress value={Number(fpyScore)} className="mb-2" />
                                                <p className="text-sm text-muted-foreground">Workplace safety performance</p>
                                            </CardContent>
                                        </Card>

                                        {/* Diversity Score */}
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusIcon(Number(recallScore))}
                                                        <span className="font-medium">Recall Score</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium">{Number(recallScore).toFixed(1)}/100</span>
                                                        <Badge variant="outline" className={getStatusColor(Number(recallScore))}>
                                                            {Number(recallScore) >= 90
                                                                ? "excellent"
                                                                : Number(recallScore) >= 75
                                                                    ? "good"
                                                                    : Number(recallScore) >= 60
                                                                        ? "fair"
                                                                        : "poor"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Progress value={Number(recallScore)} className="mb-2" />
                                                <p className="text-sm text-muted-foreground">Workforce diversity</p>
                                            </CardContent>
                                        </Card>

                                        {/* Community Investment Score */}
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusIcon(Number(laborViolationScore))}
                                                        <span className="font-medium">Labor Violation Score</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium">{Number(laborViolationScore).toFixed(1)}/100</span>
                                                        <Badge variant="outline" className={getStatusColor(Number(laborViolationScore))}>
                                                            {Number(laborViolationScore) >= 90
                                                                ? "excellent"
                                                                : Number(laborViolationScore) >= 75
                                                                    ? "good"
                                                                    : Number(laborViolationScore) >= 60
                                                                        ? "fair"
                                                                        : "poor"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Progress value={Number(laborViolationScore)} className="mb-2" />
                                                <p className="text-sm text-muted-foreground">Community investment level</p>
                                            </CardContent>
                                        </Card>


                                    </div>

                                </AccordionContent>
                            </AccordionItem>


                        </Accordion>



                    </TabsContent>


                </Tabs>
            </div>
            <Chatbot />
        </div>
    )
}