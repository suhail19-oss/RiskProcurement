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



export default function ReliabilityAnalysis() {
    const [selectedSupplier, setSelectedSupplier] = useState("")
    const [selectedSupplierC, setSelectedSupplierC] = useState("")

    const [activeTab, setActiveTab] = useState("reliability-analysis")
    const [adjustedOnTimeDeliveryRate, setAdjustedOnTimeDeliveryRate] = useState("");
    const [averageLeadTimeDaysScore, setAverageLeadTimeDaysScore] = useState("");
    const [productDefectRate, setProductDefectRate] = useState("");
    const [isoCertificationScore, setIsoCertificationScore] = useState("");
    const [infrastructureDisruptionSeverityScore, setInfrastructureDisruptionSeverityScore] = useState("");
    const [combinedDisruption, setCombinedDisruption] = useState("");

    const [reliabilityScore, setReliabilityScore] = useState<number | null>(null);
    const [reliabilityScoreC, setReliabilityScoreC] = useState<number | null>(null);
    const { toast } = useToast()
    type Supplier = {
        product_id: number;
        company_name: string;
        email_domain: string;
        location: string;
        reliability_score: number;
        reliability_upload_status: "success" | "pending" | "failed";
        reliability_subfactors: {
            adjusted_on_time_delivery_rate: number;
            average_lead_time_days: number;
            product_defect_rate: number;
            iso_certification_score: number;
            infrastructure_disruption_severity: number;
            strike_days: number;
            natural_disaster_frequency: number;
            reporting_year: number;
        };
        reliability_normalized_scores: {
            adjusted_on_time_delivery_rate: number;
            average_lead_time_days_score: number;
            product_defect_rate: number;
            iso_certification_score: number;
            infrastructure_disruption_severity_score: number;
            combined_disruption: number;
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
        const fetchSuppliers = async () => {
            const res = await fetch("http://localhost:8000/api/suppliers");
            const data = await res.json();
            console.log("Fetched suppliers:", data.suppliers);
            setSuppliersC(data.suppliers);
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

                    setReliabilityScore(supplierWithScore?.reliability_score ?? 0);
                } else {
                    // Fallback if company_name missing
                    setSelectedSupplier("");
                    setReliabilityScore(0);
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
                setReliabilityScore(0);
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
                    setReliabilityScore(supplier.reliability_score || 0);

                } else {
                    setReliabilityScore(0);
                }
            } catch (err) {

            }
        };

        fetchCompanyESGData();
    }, [selectedSupplier]);

    useEffect(() => {
        const supplier = suppliers.find(s => s.company_name === selectedSupplier);

        if (!supplier || !supplier.reliability_subfactors) return;

        const reliability = supplier.reliability_subfactors;

        // Convert to numbers safely
        const adjustedOnTimeDeliveryRateNum = Number(reliability.adjusted_on_time_delivery_rate) || 0;
        const averageLeadTimeDaysNum = Number(reliability.average_lead_time_days) || 0;
        const productDefectRateNum = Number(reliability.product_defect_rate) || 0;
        const isoCertificationScoreNum = Number(reliability.iso_certification_score) || 0;
        const infrastructureDisruptionSeverityNum = Number(reliability.infrastructure_disruption_severity) || 0;
        const strikeDaysNum = Number(reliability.strike_days) || 0;
        const naturalDisasterFrequencyNum = Number(reliability.natural_disaster_frequency) || 0;

        // R1
        const r1Score = adjustedOnTimeDeliveryRateNum;

        // R2
        const r2Score = Math.max(0, 100 - (averageLeadTimeDaysNum * 3.33));

        // R3
        const defectRatePercent = productDefectRateNum < 1 ? productDefectRateNum * 100 : productDefectRateNum;
        const r3Score = Math.max(0, 100 - (defectRatePercent * 20));

        // R4
        const r4Score = isoCertificationScoreNum * 100;

        // R5
        const r5Score = (1 - infrastructureDisruptionSeverityNum) * 100;

        // Combined Disruption
        const combinedDisruptionValue = Math.min(1.0, (strikeDaysNum / 30) + (naturalDisasterFrequencyNum / 5));

        // R6
        const r6Score = (1 - combinedDisruptionValue) * 100;

        const reliabilityScoreCal =
            (r1Score * 0.25) +
            (r2Score * 0.15) +
            (r3Score * 0.15) +
            (r4Score * 0.15) +
            (r5Score * 0.15) +
            (r6Score * 0.15);
        // ✅ SET SCORES INTO YOUR STATE HOOKS:
        setAdjustedOnTimeDeliveryRate(r1Score.toFixed(2));
        setAverageLeadTimeDaysScore(r2Score.toFixed(2));
        setProductDefectRate(r3Score.toFixed(2));
        setIsoCertificationScore(r4Score.toFixed(2));
        setInfrastructureDisruptionSeverityScore(r5Score.toFixed(2));
        setCombinedDisruption(combinedDisruptionValue.toFixed(2));
        setReliabilityScoreC(parseFloat(reliabilityScoreCal.toFixed(2)));
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

        // // Set reliability Subfactors
        // if (supplier.reliability_subfactors) {
        //     const reliability = supplier.reliability_normalized_scores;

        //     setAdjustedOnTimeDeliveryRate(reliability.adjusted_on_time_delivery_rate?.toString() ?? "");
        //     setAverageLeadTimeDaysScore(reliability.average_lead_time_days_score?.toString() ?? "");
        //     setProductDefectRate(reliability.product_defect_rate?.toString() ?? "");
        //     setIsoCertificationScore(reliability.iso_certification_score?.toString() ?? "");
        //     setInfrastructureDisruptionSeverityScore(reliability.infrastructure_disruption_severity_score?.toString() ?? "");
        //     setCombinedDisruption(reliability.combined_disruption?.toString() ?? "");
        // }
    }, [selectedSupplier, suppliers]);


    const resetAllScores = () => {
        setAdjustedOnTimeDeliveryRate("");
        setAverageLeadTimeDaysScore("");
        setProductDefectRate("");
        setIsoCertificationScore("");
        setInfrastructureDisruptionSeverityScore("");
        setCombinedDisruption("");
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
        if (!supplier || !supplier.reliability_subfactors) return;

        const reliability = supplier.reliability_subfactors;

        // Convert to numbers safely
        const adjustedOnTimeDeliveryRateNum = Number(reliability.adjusted_on_time_delivery_rate) || 0;
        const averageLeadTimeDaysNum = Number(reliability.average_lead_time_days) || 0;
        const productDefectRateNum = Number(reliability.product_defect_rate) || 0;
        const isoCertificationScoreNum = Number(reliability.iso_certification_score) || 0;
        const infrastructureDisruptionSeverityNum = Number(reliability.infrastructure_disruption_severity) || 0;
        const strikeDaysNum = Number(reliability.strike_days) || 0;
        const naturalDisasterFrequencyNum = Number(reliability.natural_disaster_frequency) || 0;

        // R1
        const r1Score = adjustedOnTimeDeliveryRateNum;

        // R2
        const r2Score = Math.max(0, 100 - (averageLeadTimeDaysNum * 3.33));

        // R3
        const defectRatePercent = productDefectRateNum < 1 ? productDefectRateNum * 100 : productDefectRateNum;
        const r3Score = Math.max(0, 100 - (defectRatePercent * 20));

        // R4
        const r4Score = isoCertificationScoreNum * 100;

        // R5
        const r5Score = (1 - infrastructureDisruptionSeverityNum) * 100;

        // Combined Disruption
        const combinedDisruptionValue = Math.min(1.0, (strikeDaysNum / 30) + (naturalDisasterFrequencyNum / 5));

        // R6
        const r6Score = (1 - combinedDisruptionValue) * 100;

        const reliabilityScoreCal =
            (r1Score * 0.25) +
            (r2Score * 0.15) +
            (r3Score * 0.15) +
            (r4Score * 0.15) +
            (r5Score * 0.15) +
            (r6Score * 0.15);
        // ✅ SET SCORES INTO YOUR STATE HOOKS:
        setAdjustedOnTimeDeliveryRate(r1Score.toFixed(2));
        setAverageLeadTimeDaysScore(r2Score.toFixed(2));
        setProductDefectRate(r3Score.toFixed(2));
        setIsoCertificationScore(r4Score.toFixed(2));
        setInfrastructureDisruptionSeverityScore(r5Score.toFixed(2));
        setCombinedDisruption(combinedDisruptionValue.toFixed(2));
        setReliabilityScoreC(parseFloat(reliabilityScoreCal.toFixed(2)));
    }, [selectedSupplierC, suppliersC]);




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
                        <span className="bg-gradient-to-r from-[#E2142D] via-[#2563eb] to-[#a21caf] bg-clip-text text-transparent animate-gradient-text ">Reliability Analysis</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Comprehensive reliability evaluation of the supplier
                    </p>
                </motion.div>

                {JSON.parse(localStorage.getItem("userData") || "{}")?.role !== "Supplier" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex justify-center"
                    >
                        {activeTab === "reliability-analysis" && (
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
                                            disabled={supplier.reliability_upload_status !== "success"}
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
                    <TabsContent value="reliability-analysis" className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="grid lg:grid-cols-2 gap-6"
                        >
                            { /* overall score component */}
                            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                                <CardHeader>
                                    <CardTitle>Overall Reliability Score</CardTitle>
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
                                            {reliabilityScoreC !== null ? reliabilityScoreC.toFixed(1) : "N/A"}
                                        </motion.div>
                                        <div className="text-lg text-muted-foreground">out of 100</div>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-md px-5 py-1.5 rounded-full transition-all duration-300",
                                                reliabilityScore !== null && reliabilityScore >= 85
                                                    ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                                                    : reliabilityScore !== null && reliabilityScore >= 70
                                                        ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                                                        : reliabilityScore !== null && reliabilityScore >= 50
                                                            ? "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200"
                                                            : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                                            )}
                                        >
                                            {reliabilityScoreC !== null
                                                ? reliabilityScoreC >= 85
                                                    ? "Excellent"
                                                    : reliabilityScoreC >= 70
                                                        ? "Good"
                                                        : reliabilityScoreC >= 50
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
                                    <CardTitle>Reliability Score Breakdown</CardTitle>
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
                                                        { name: "Adjusted On time Delievery Rate", value: Number(adjustedOnTimeDeliveryRate), color: "#22c55e" },
                                                        { name: "Average Lead Time Delay Score", value: Number(averageLeadTimeDaysScore), color: "#3b82f6" },
                                                        { name: "Product Defect rate", value: Number(productDefectRate), color: "#f59e0b" },
                                                        { name: "ISO Certification Score", value: Number(isoCertificationScore), color: "#ec4899" },
                                                        { name: "Infrastructure Disruption Severity Score", value: Number(infrastructureDisruptionSeverityScore), color: "#8b5cf6" },
                                                        { name: "Combined Disruption Score", value: Number(combinedDisruption), color: "#ef4444" },
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={100}
                                                    outerRadius={140}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                    animationBegin={500}
                                                    animationDuration={1000}
                                                    animationEasing="ease-out"

                                                    labelLine={false}
                                                >
                                                    {[
                                                        { name: "Adjusted On time Delievery Rate", color: "#22c55e" },
                                                        { name: "Average Lead Time Delay Score", color: "#3b82f6" },
                                                        { name: "Product Defect rate", color: "#f59e0b" },
                                                        { name: "ISO Certification Score", color: "#ec4899" },
                                                        { name: "Infrastructure Disruption Severity Score", color: "#8b5cf6" },
                                                        { name: "RCombined Disruption Scoreecall", color: "#ef4444" },

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

                                        <div className="flex justify-center space-x-4 mt-4">
                                            {[
                                                { name: "Adjusted On time Delivery Rate", color: "#22c55e" },
                                                { name: "Average Lead Time Delay Score", color: "#3b82f6" },
                                                { name: "Product Defect rate", color: "#f59e0b" },
                                                { name: "ISO Certification Score", color: "#ec4899" },
                                                { name: "Infrastructure Disruption Severity Score", color: "#8b5cf6" },
                                                { name: "Combined Disruption Score", color: "#ef4444" },
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
                                <AccordionItem value="reliability" className="border rounded-lg px-4 transition-all duration-300 hover:shadow-lg">
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full transition-all duration-300 hover:scale-110">
                                                <Leaf className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-xl font-semibold">Reliability Analysis </h3>
                                                <p className="text-sm text-muted-foreground">Financial impact and resource utilization</p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-4 pt-4">
                                        <div className="grid gap-4">

                                            {[
                                                {
                                                    name: "Adjusted On time Delivery Rate",
                                                    score: Number(adjustedOnTimeDeliveryRate),
                                                    description: "Performance relative to agreed delivery timelines"
                                                },
                                                {
                                                    name: "Average Lead Time Delay Score",
                                                    score: Number(averageLeadTimeDaysScore),
                                                    description: "Assessment of average delays in lead times"
                                                },
                                                {
                                                    name: "Product Defect Rate",
                                                    score: Number(productDefectRate),
                                                    description: "Frequency of defects identified in delivered products"
                                                },
                                                {
                                                    name: "ISO Certification Score",
                                                    score: Number(isoCertificationScore),
                                                    description: "Compliance with ISO quality and process standards"
                                                },
                                                {
                                                    name: "Infrastructure Disruption Severity Score",
                                                    score: Number(infrastructureDisruptionSeverityScore),
                                                    description: "Impact of infrastructure-related disruptions"
                                                },
                                                {
                                                    name: "Combined Disruption Score",
                                                    score: Number(combinedDisruption),
                                                    description: "Overall exposure to operational and supply disruptions"
                                                }
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

                        </Accordion>



                    </TabsContent>


                </Tabs>
            </div>
            <Chatbot />
        </div>
    )
}