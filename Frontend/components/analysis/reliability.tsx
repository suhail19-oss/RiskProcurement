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


export default function Reliability({ supplier }: { supplier: string}) {

    const [reliabilityScore, setReliabilityScore] = useState<number | null>(null);
const [adjustedOnTimeDeliveryRate, setAdjustedOnTimeDeliveryRate] = useState<number | null>(null);
const [averageLeadTimeDaysScore, setAverageLeadTimeDaysScore] = useState<number | null>(null);
const [productDefectRate, setProductDefectRate] = useState<number | null>(null);
const [isoCertificationScore, setIsoCertificationScore] = useState<number | null>(null);
const [infrastructureDisruptionSeverityScore, setInfrastructureDisruptionSeverityScore] = useState<number | null>(null);
const [combinedDisruption, setCombinedDisruption] = useState<number | null>(null);

useEffect(() => {
    const fetchSupplierReliabilityData = async () => {
        if (!supplier) return;
        
        try {
            const encodedName = encodeURIComponent(supplier);
            const response = await fetch(`http://localhost:8000/suppliers/reliability/${encodedName}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const supplierData = data.supplier;
            const reliability = supplierData.reliability_subfactors || {};

            // Convert to numbers safely
            const adjustedOnTimeDeliveryRateNum = Number(reliability.adjusted_on_time_delivery_rate) || 0;
            const averageLeadTimeDaysNum = Number(reliability.average_lead_time_days) || 0;
            const productDefectRateNum = Number(reliability.product_defect_rate) || 0;
            const isoCertificationScoreNum = Number(reliability.iso_certification_score) || 0;
            const infrastructureDisruptionSeverityNum = Number(reliability.infrastructure_disruption_severity) || 0;
            const strikeDaysNum = Number(reliability.strike_days) || 0;
            const naturalDisasterFrequencyNum = Number(reliability.natural_disaster_frequency) || 0;

            // Calculate individual scores
            const r1Score = adjustedOnTimeDeliveryRateNum;
            const r2Score = Math.max(0, 100 - (averageLeadTimeDaysNum * 3.33));
            const defectRatePercent = productDefectRateNum < 1 ? productDefectRateNum * 100 : productDefectRateNum;
            const r3Score = Math.max(0, 100 - (defectRatePercent * 20));
            const r4Score = isoCertificationScoreNum * 100;
            const r5Score = (1 - infrastructureDisruptionSeverityNum) * 100;
            const combinedDisruptionValue = Math.min(1.0, (strikeDaysNum / 30) + (naturalDisasterFrequencyNum / 5));
            const r6Score = (1 - combinedDisruptionValue) * 100;

            // Calculate weighted reliability score
            const reliabilityScoreCal = (r1Score * 0.25) +
                                      (r2Score * 0.15) +
                                      (r3Score * 0.15) +
                                      (r4Score * 0.15) +
                                      (r5Score * 0.15) +
                                      (r6Score * 0.15);

            // Set all states
            setReliabilityScore(parseFloat(reliabilityScoreCal.toFixed(2)));
            setAdjustedOnTimeDeliveryRate(parseFloat(r1Score.toFixed(2)));
            setAverageLeadTimeDaysScore(parseFloat(r2Score.toFixed(2)));
            setProductDefectRate(parseFloat(r3Score.toFixed(2)));
            setIsoCertificationScore(parseFloat(r4Score.toFixed(2)));
            setInfrastructureDisruptionSeverityScore(parseFloat(r5Score.toFixed(2)));
            setCombinedDisruption(parseFloat(combinedDisruptionValue.toFixed(2)));

        } catch (error) {
            console.error("Error fetching reliability data:", error);
            // Reset all states on error
            setReliabilityScore(null);
            setAdjustedOnTimeDeliveryRate(null);
            setAverageLeadTimeDaysScore(null);
            setProductDefectRate(null);
            setIsoCertificationScore(null);
            setInfrastructureDisruptionSeverityScore(null);
            setCombinedDisruption(null);
        }
    };

    fetchSupplierReliabilityData();
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

   if ( reliabilityScore === null ) {
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
                <CardTitle>Overall Reliability Score</CardTitle>
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
                        {reliabilityScore !== null ? reliabilityScore.toFixed(1) : "N/A"}
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
                        {reliabilityScore !== null
                            ? reliabilityScore >= 85
                                ? "Excellent"
                                : reliabilityScore >= 70
                                    ? "Good"
                                    : reliabilityScore >= 50
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
        </div>
  );
}