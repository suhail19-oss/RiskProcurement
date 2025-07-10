import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Leaf, Users, AlertCircle, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

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


export default function Risk({ supplier }: { supplier: string}) {

    const [riskScore, setRiskScore] = useState<number | null>(null);
    const [qualityRiskScore, setQualityRiskScore] = useState<number | null>(null);
    const [logisticsRiskScore, setLogisticsRiskScore] = useState<number | null>(null);
    const [operationalRiskScore, setOperationalRiskScore] = useState<number | null>(null);
    const [legalRiskScore, setLegalRiskScore] = useState<number | null>(null);
    const [esgRiskScore, setEsgRiskScore] = useState<number | null>(null);
    const [geoPoliticalRiskScore, setGeoPoliticalRiskScore] = useState<number | null>(null);

    useEffect(() => {
        const fetchSupplierRiskData = async () => {
            if (!supplier) return;
            
            try {
                const encodedName = encodeURIComponent(supplier);
                const response = await fetch(`http://localhost:8000/suppliers/risk/${encodedName}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                const supplierData = data.supplier;
                const risk = supplierData.risk_subfactors || {};

                // Convert raw fields to numbers safely
                const qualityRiskNum = Number(risk.quality_risk_score) || 0;
                const logisticsRiskNum = Number(risk.logistics_risk_score) || 0;
                const operationalRiskNum = Number(risk.operational_risk_score) || 0;
                const legalRiskNum = Number(risk.compliance_legal_risk_score) || 0;
                const esgRiskNum = Number(risk.esg_risk_score) || 0;
                const geoPoliticalRiskNum = Number(risk.geopolitical_risk_score) || 0;
                const riskScore = Number(supplierData.risk_score) || 0;
                
                console.log( riskScore ) ; 

                setRiskScore(riskScore);
                // Set individual risk scores
                setQualityRiskScore(qualityRiskNum);
                setLogisticsRiskScore(logisticsRiskNum);
                setOperationalRiskScore(operationalRiskNum);
                setLegalRiskScore(legalRiskNum);
                setEsgRiskScore(esgRiskNum);
                setGeoPoliticalRiskScore(geoPoliticalRiskNum);

            } catch (error) {
                console.error("Error fetching risk data:", error);
                // Reset all risk states on error
                setRiskScore(null);
                setQualityRiskScore(null);
                setLogisticsRiskScore(null);
                setOperationalRiskScore(null);
                setLegalRiskScore(null);
                setEsgRiskScore(null);
                setGeoPoliticalRiskScore(null);
            }
        };

        fetchSupplierRiskData();
    }, [supplier]);

  if (!supplier) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-64"
      >
        <Card className="text-center p-6">
          <CardTitle className="mb-4">No Supplier Selected</CardTitle>
          <CardDescription>
            Please select a supplier from the list to view ESG data
          </CardDescription>
        </Card>
      </motion.div>
    );
  }

   if ( riskScore === null ) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-64"
      >
        <Card className="text-center p-6">
          <CardTitle className="mb-4">No Risk Data Available</CardTitle>
          <CardDescription className="mb-4">
            {supplier} doesn't have Risk data or the upload wasn't successful
          </CardDescription>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <div>
      <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid lg:grid-cols-2 gap-6"
        >
            { /* overall score component */}
            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <CardHeader>
                    <CardTitle>Overall Risk Score</CardTitle>
                    <CardDescription>
                        {supplier
                            ? `For ${supplier}`
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
                            {riskScore !== null ? riskScore.toFixed(1) : "N/A"}
                        </motion.div>
                        <div className="text-lg text-muted-foreground">out of 100</div>
                        <Badge
                            variant="outline"
                            className={cn(
                                "text-md px-5 py-1.5 rounded-full transition-all duration-300",
                                riskScore !== null && riskScore >= 85
                                    ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                                    : riskScore !== null && riskScore >= 70
                                        ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                                        : riskScore !== null && riskScore >= 50
                                            ? "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200"
                                            : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                            )}
                        >
                            {riskScore !== null
                                ? riskScore >= 85
                                    ? "Excellent"
                                    : riskScore >= 70
                                        ? "Good"
                                        : riskScore >= 50
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
                    <CardTitle>Risk Score Breakdown</CardTitle>
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
                                        { name: "Quality Risk Score", value: parseFloat(Number(qualityRiskScore).toFixed(2)), color: "#22c55e" },
                                        { name: "Logistics Risk Score", value: parseFloat(Number(logisticsRiskScore).toFixed(2)), color: "#3b82f6" },
                                        { name: "Operational Risk Score", value: parseFloat(Number(operationalRiskScore).toFixed(2)), color: "#f59e0b" },
                                        { name: "Legal Risk Score", value: parseFloat(Number(legalRiskScore).toFixed(2)), color: "#ec4899" },
                                        { name: "ESG Risk Score", value: parseFloat(Number(esgRiskScore).toFixed(2)), color: "#8b5cf6" },
                                        { name: "GeoPolitical Risk Score", value: parseFloat(Number(geoPoliticalRiskScore).toFixed(2)), color: "#ef4444" },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
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
                                { name: "Quality Risk", color: "#22c55e" },
                                { name: "Logistics Risk", color: "#3b82f6" },
                                { name: "Operational Risk", color: "#f59e0b" },
                                { name: "Legal Risk", color: "#ec4899" },
                                { name: "ESG Risk", color: "#8b5cf6" },
                                { name: "GeoPolitical Risk", color: "#ef4444" },
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
                <AccordionItem value="risk" className="border rounded-lg px-4 transition-all duration-300 hover:shadow-lg">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full transition-all duration-300 hover:scale-110">
                                <Leaf className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-semibold">Risk Analysis </h3>
                                <p className="text-sm text-muted-foreground">Financial impact and resource utilization</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <div className="grid gap-4">

                            {[
                                {
                                    name: "Quality Risk Score",
                                    score: Number(qualityRiskScore),
                                    description: "Likelihood of quality failures, product defects, and non-conformance to specifications"
                                },
                                {
                                    name: "Logistics Risk Score",
                                    score: Number(logisticsRiskScore),
                                    description: "Potential for delays, disruptions, or inefficiencies in transportation and warehousing"
                                },
                                {
                                    name: "Operational Risk Score",
                                    score: Number(operationalRiskScore),
                                    description: "Vulnerability to internal process failures, system breakdowns, or resource shortages"
                                },
                                {
                                    name: "Legal Risk Score",
                                    score: Number(legalRiskScore),
                                    description: "Exposure to regulatory penalties, contract breaches, and legal disputes"
                                },
                                {
                                    name: "ESG Risk Score",
                                    score: Number(esgRiskScore),
                                    description: "Risks related to environmental, social, and governance factors affecting sustainability"
                                },
                                {
                                    name: "GeoPolitical Risk Score",
                                    score: Number(geoPoliticalRiskScore),
                                    description: "Impact of political instability, conflict, or trade restrictions in relevant regions"
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
        </div>
  );
}