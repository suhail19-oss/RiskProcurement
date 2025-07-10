import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Leaf, Users, Shield, AlertCircle, CheckCircle, Star, TrendingUp, Award, Filter, Search } from "lucide-react"
import { Progress } from "@/components/ui/progress"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

interface Supplier {
  company_name: string;
  esg_final_score?: number;
  esg_E_score?: number;
  esg_S_score?: number;
  esg_G_score?: number;
  esg_subfactor_scores?: {
    Environmental?: {
      "GHG Score"?: number;
      "Energy Score"?: number;
      "Water Score"?: number;
      "Waste Score"?: number;
      "Compliance Score"?: number;
      "Renewable Score"?: number;
      "Biodiversity Score"?: number;
      "Climate Risk Score"?: number;
    };
    Social?: {
      "Retention Score"?: number;
      "Safety Score"?: number;
      "Diversity Score"?: number;
      "Community Score"?: number;
      "Customer Score"?: number;
      "Human Rights Score"?: number;
      "Training Score"?: number;
    };
    Governance?: {
      "Board Independence"?: number;
      "Compensation Score"?: number;
      "Audit Score"?: number;
      "Shareholder Score"?: number;
      "Transparency Score"?: number;
      "Anti-Corruption"?: number;
      "Tax Transparency"?: number;
    };
  };
}

function getStatusIcon(status: string) {
  switch (status) {
    case "excellent":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "good":
      return <CheckCircle className="h-4 w-4 text-blue-600" />
    case "fair":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    default:
      return <AlertCircle className="h-4 w-4 text-red-600" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "excellent":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "good":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "fair":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    default:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }
}

export default function Esg({ supplier }: { supplier: string }) {
  // State for overall scores
  const [eScore, setEScore] = useState<number | null>(null);
  const [sScore, setSScore] = useState<number | null>(null);
  const [gScore, setGScore] = useState<number | null>(null);
  const [esgScore, setESGScore] = useState<number | null>(null);
  
  // Environmental sub-scores
  const [ghgScore, setGhgScore] = useState<number | null>(null);
  const [energyEfficiencyScore, setEnergyEfficiencyScore] = useState<number | null>(null);
  const [waterEfficiencyScore, setWaterEfficiencyScore] = useState<number | null>(null);
  const [wasteRecyclingScore, setWasteRecyclingScore] = useState<number | null>(null);
  const [complianceScore, setComplianceScore] = useState<number | null>(null);
  const [renewableEnergyScore, setRenewableEnergyScore] = useState<number | null>(null);
  const [biodiversityScore, setBiodiversityScore] = useState<number | null>(null);
  const [climateRiskManagementScore, setClimateRiskManagementScore] = useState<number | null>(null);
  
  // Social sub-scores
  const [retentionScore, setRetentionScore] = useState<number | null>(null);
  const [safetyScore, setSafetyScore] = useState<number | null>(null);
  const [diversityScore, setDiversityScore] = useState<number | null>(null);
  const [communityInvestmentScore, setCommunityInvestmentScore] = useState<number | null>(null);
  const [customerSatisfactionScore, setCustomerSatisfactionScore] = useState<number | null>(null);
  const [humanRightsScore, setHumanRightsScore] = useState<number | null>(null);
  const [trainingScore, setTrainingScore] = useState<number | null>(null);
  
  // Governance sub-scores
  const [boardIndependenceScore, setBoardIndependenceScore] = useState<number | null>(null);
  const [compensationAlignmentScore, setCompensationAlignmentScore] = useState<number | null>(null);
  const [auditCommitteeScore, setAuditCommitteeScore] = useState<number | null>(null);
  const [shareholderRightsScore, setShareholderRightsScore] = useState<number | null>(null);
  const [transparencyScore, setTransparencyScore] = useState<number | null>(null);
  const [antiCorruptionScore, setAntiCorruptionScore] = useState<number | null>(null);
  const [taxTransparencyScore, setTaxTransparencyScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchSupplierData = async () => {
      if (!supplier) return;
      
      try {
        const encodedName = encodeURIComponent(supplier);
        const response = await fetch(`http://localhost:8000/suppliers/esg/${encodedName}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const supplierData: Supplier = data.supplier;

        // Set overall scores
        setESGScore(supplierData.esg_final_score || null);
        setEScore(supplierData.esg_E_score || null);
        setSScore(supplierData.esg_S_score || null);
        setGScore(supplierData.esg_G_score || null);

        // Set environmental sub-scores
        if (supplierData.esg_subfactor_scores?.Environmental) {
          const env = supplierData.esg_subfactor_scores.Environmental;
          setGhgScore(env["GHG Score"] || null);
          setEnergyEfficiencyScore(env["Energy Score"] || null);
          setWaterEfficiencyScore(env["Water Score"] || null);
          setWasteRecyclingScore(env["Waste Score"] || null);
          setComplianceScore(env["Compliance Score"] || null);
          setRenewableEnergyScore(env["Renewable Score"] || null);
          setBiodiversityScore(env["Biodiversity Score"] || null);
          setClimateRiskManagementScore(env["Climate Risk Score"] || null);
        }

        // Set social sub-scores
        if (supplierData.esg_subfactor_scores?.Social) {
          const social = supplierData.esg_subfactor_scores.Social;
          setRetentionScore(social["Retention Score"] || null);
          setSafetyScore(social["Safety Score"] || null);
          setDiversityScore(social["Diversity Score"] || null);
          setCommunityInvestmentScore(social["Community Score"] || null);
          setCustomerSatisfactionScore(social["Customer Score"] || null);
          setHumanRightsScore(social["Human Rights Score"] || null);
          setTrainingScore(social["Training Score"] || null);
        }

        // Set governance sub-scores
        if (supplierData.esg_subfactor_scores?.Governance) {
          const gov = supplierData.esg_subfactor_scores.Governance;
          setBoardIndependenceScore(gov["Board Independence"] || null);
          setCompensationAlignmentScore(gov["Compensation Score"] || null);
          setAuditCommitteeScore(gov["Audit Score"] || null);
          setShareholderRightsScore(gov["Shareholder Score"] || null);
          setTransparencyScore(gov["Transparency Score"] || null);
          setAntiCorruptionScore(gov["Anti-Corruption"] || null);
          setTaxTransparencyScore(gov["Tax Transparency"] || null);
        }

      } catch (error) {
        console.error("Error fetching supplier data:", error);
        // Optionally set error state here
      }
    };

    fetchSupplierData();
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

   if ( esgScore === null ) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-64"
      >
        <Card className="text-center p-6">
          <CardTitle className="mb-4">No ESG Data Available</CardTitle>
          <CardDescription className="mb-4">
            {supplier} doesn't have ESG data or the upload wasn't successful
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
      <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        <CardHeader>
          <CardTitle>Overall ESG Score</CardTitle>
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
              {esgScore !== null ? esgScore.toFixed(1) : "N/A"}
            </motion.div>
            <div className="text-lg text-muted-foreground">out of 100</div>
            <Badge
              variant="outline"
              className={cn(
                "text-md px-5 py-1.5 rounded-full transition-all duration-300",
                esgScore !== null && esgScore >= 85
                  ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                  : esgScore !== null && esgScore >= 70
                    ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                    : esgScore !== null && esgScore >= 50
                      ? "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200"
                      : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
              )}
            >
              {esgScore !== null
                ? esgScore >= 85
                  ? "Excellent"
                  : esgScore >= 70
                    ? "Good"
                    : esgScore >= 50
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
        <CardTitle>ESG Breakdown</CardTitle>
        <CardDescription>Score distribution across pillars</CardDescription>
        </CardHeader>
        <CardContent>
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
            <Pie
                data={[
                { name: "Environmental", value: eScore, color: "#22c55e" },
                { name: "Social", value: sScore, color: "#3b82f6" },
                { name: "Governance", value: gScore, color: "#f59e0b" },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
            >
                <Cell fill="#22c55e" />
                <Cell fill="#3b82f6" />
                <Cell fill="#f59e0b" />
            </Pie>
            </PieChart>
        </ResponsiveContainer>

        <div className="flex justify-center space-x-4 mt-4">
            {[
            { name: "Environmental", value: eScore || 0, color: "#22c55e" },
            { name: "Social", value: sScore || 0, color: "#3b82f6" },
            { name: "Governance", value: gScore || 0, color: "#f59e0b" },
            ].map((entry, index) => (
            <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="flex items-center space-x-2"
            >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm">
                {entry.name}: {entry.value.toFixed(1)}
                </span>
            </motion.div>
            ))}
        </div>
        </CardContent>
    </Card>
    </motion.div>

    <Accordion type="single" collapsible className="space-y-4">
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        >
        <AccordionItem value="environmental" className="border rounded-lg px-4 transition-all duration-300 hover:shadow-lg">
            <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full transition-all duration-300 hover:scale-110">
                <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                <h3 className="text-xl font-semibold">Environmental</h3>
                <p className="text-sm text-muted-foreground">Climate impact and resource management</p>
                </div>
            </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
            <div className="grid gap-4">
                {/* Environmental Score Cards */}
                {[
                { name: "GHG Score", score: ghgScore, description: "Greenhouse gas emissions performance" },
                { name: "Energy Efficiency Score", score: energyEfficiencyScore, description: "Energy consumption efficiency" },
                { name: "Water Efficiency Score", score: waterEfficiencyScore, description: "Water usage efficiency" },
                { name: "Waste Recycling Score", score: wasteRecyclingScore, description: "Waste recycling rate" },
                { name: "Compliance Score", score: complianceScore, description: "Environmental compliance record" },
                { name: "Renewable Energy Score", score: renewableEnergyScore, description: "Renewable energy usage" },
                { name: "Biodiversity Score", score: biodiversityScore, description: "Biodiversity impact" },
                { name: "Climate Risk Management Score", score: climateRiskManagementScore, description: "Climate risk measures" },
                ].map((item, index) => (
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
                            {getStatusIcon("fair")}
                            <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{Number(item.score).toFixed(1)}/100</span>
                            <Badge variant="outline" className={getStatusColor("fair")}>
                            fair
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

        <AccordionItem value="social" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-left">
                <h3 className="text-xl font-semibold">Social</h3>
                <p className="text-sm text-muted-foreground">Employee welfare and community impact</p>
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
                    {getStatusIcon("fair")}
                    <span className="font-medium">Retention Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{Number(retentionScore).toFixed(1)}/100</span>
                    <Badge variant="outline" className={getStatusColor("fair")}>fair</Badge>
                    </div>
                </div>
                <Progress value={Number(retentionScore)} className="mb-2" />
                <p className="text-sm text-muted-foreground">Employee retention rate</p>
                </CardContent>
            </Card>

            {/* Safety Score */}
            <Card>
                <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                    {getStatusIcon("fair")}
                    <span className="font-medium">Safety Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{Number(safetyScore).toFixed(1)}/100</span>
                    <Badge variant="outline" className={getStatusColor("fair")}>fair</Badge>
                    </div>
                </div>
                <Progress value={Number(safetyScore)} className="mb-2" />
                <p className="text-sm text-muted-foreground">Workplace safety performance</p>
                </CardContent>
            </Card>

            {/* Diversity Score */}
            <Card>
                <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                    {getStatusIcon("fair")}
                    <span className="font-medium">Diversity Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{Number(diversityScore).toFixed(1)}/100</span>
                    <Badge variant="outline" className={getStatusColor("fair")}>fair</Badge>
                    </div>
                </div>
                <Progress value={Number(diversityScore)} className="mb-2" />
                <p className="text-sm text-muted-foreground">Workforce diversity</p>
                </CardContent>
            </Card>

            {/* Community Investment Score */}
            <Card>
                <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                    {getStatusIcon("fair")}
                    <span className="font-medium">Community Investment Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{Number(communityInvestmentScore).toFixed(1)}/100</span>
                    <Badge variant="outline" className={getStatusColor("fair")}>fair</Badge>
                    </div>
                </div>
                <Progress value={Number(communityInvestmentScore)} className="mb-2" />
                <p className="text-sm text-muted-foreground">Community investment level</p>
                </CardContent>
            </Card>

            {/* Customer Satisfaction Score */}
            <Card>
                <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                    {getStatusIcon("fair")}
                    <span className="font-medium">Customer Satisfaction Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{Number(customerSatisfactionScore).toFixed(1)}/100</span>
                    <Badge variant="outline" className={getStatusColor("fair")}>fair</Badge>
                    </div>
                </div>
                <Progress value={Number(customerSatisfactionScore)} className="mb-2" />
                <p className="text-sm text-muted-foreground">Customer satisfaction (NPS)</p>
                </CardContent>
            </Card>

            {/* Human Rights Score */}
            <Card>
                <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                    {getStatusIcon("fair")}
                    <span className="font-medium">Human Rights Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{Number(humanRightsScore).toFixed(1)}/100</span>
                    <Badge variant="outline" className={getStatusColor("fair")}>fair</Badge>
                    </div>
                </div>
                <Progress value={Number(humanRightsScore)} className="mb-2" />
                <p className="text-sm text-muted-foreground">Human rights compliance</p>
                </CardContent>
            </Card>

            {/* Training Score */}
            <Card>
                <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                    {getStatusIcon("fair")}
                    <span className="font-medium">Training Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{Number(trainingScore).toFixed(1)}/100</span>
                    <Badge variant="outline" className={getStatusColor("fair")}>fair</Badge>
                    </div>
                </div>
                <Progress value={Number(trainingScore)} className="mb-2" />
                <p className="text-sm text-muted-foreground">Employee training hours</p>
                </CardContent>
            </Card>
            </div>

        </AccordionContent>
        </AccordionItem>

        <AccordionItem value="governance" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-left">
                <h3 className="text-xl font-semibold">Governance</h3>
                <p className="text-sm text-muted-foreground">Leadership and ethical practices</p>
            </div>

            </div>
        </AccordionTrigger>

        <AccordionContent className="space-y-4 pt-4">

            <div className="grid gap-4">
            {/* Board Independence Score */}
            <Card>
                <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                    {getStatusIcon("fair")}
                    <span className="font-medium">Board Independence Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{Number(boardIndependenceScore).toFixed(1)}/100</span>
                    <Badge variant="outline" className={getStatusColor("fair")}>fair</Badge>
                    </div>
                </div>
                <Progress value={Number(boardIndependenceScore)} className="mb-2" />
                <p className="text-sm text-muted-foreground">Proportion of independent board members</p>
                </CardContent>
            </Card>

            {/* Compensation Alignment Score */}
            <Card>
                <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                    {getStatusIcon("fair")}
                    <span className="font-medium">Compensation Alignment Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{Number(compensationAlignmentScore).toFixed(1)}/100</span>
                    <Badge variant="outline" className={getStatusColor("fair")}>fair</Badge>
                    </div>
                </div>
                <Progress value={Number(compensationAlignmentScore)} className="mb-2" />
                <p className="text-sm text-muted-foreground">Executive compensation alignment</p>
                </CardContent>
            </Card>

            {/* Audit Committee Score */}
            <Card>
                <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                    {getStatusIcon("fair")}
                    <span className="font-medium">Audit Committee Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{Number(auditCommitteeScore).toFixed(1)}/100</span>
                    <Badge variant="outline" className={getStatusColor("fair")}>fair</Badge>
                    </div>
                </div>
                <Progress value={Number(auditCommitteeScore)} className="mb-2" />
                <p className="text-sm text-muted-foreground">Audit committee independence and effectiveness</p>
                </CardContent>
            </Card>

            {/* Shareholder Rights Score */}
            <Card>
                <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                    {getStatusIcon("fair")}
                    <span className="font-medium">Shareholder Rights Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{Number(shareholderRightsScore).toFixed(1)}/100</span>
                    <Badge variant="outline" className={getStatusColor("fair")}>fair</Badge>
                    </div>
                </div>
                <Progress value={Number(shareholderRightsScore)} className="mb-2" />
                <p className="text-sm text-muted-foreground">Strength of shareholder voting rights</p>
                </CardContent>
            </Card>

            {/* Transparency Score */}
            <Card>
                <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                    {getStatusIcon("fair")}
                    <span className="font-medium">Transparency Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{Number(transparencyScore).toFixed(1)}/100</span>
                    <Badge variant="outline" className={getStatusColor("fair")}>fair</Badge>
                    </div>
                </div>
                <Progress value={Number(transparencyScore)} className="mb-2" />
                <p className="text-sm text-muted-foreground">Disclosure and transparency of governance practices</p>
                </CardContent>
            </Card>

            {/* Anti-Corruption Score */}
            <Card>
                <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                    {getStatusIcon("fair")}
                    <span className="font-medium">Anti-Corruption Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{Number(antiCorruptionScore).toFixed(1)}/100</span>
                    <Badge variant="outline" className={getStatusColor("fair")}>fair</Badge>
                    </div>
                </div>
                <Progress value={Number(antiCorruptionScore)} className="mb-2" />
                <p className="text-sm text-muted-foreground">Anti-corruption policies and measures</p>
                </CardContent>
            </Card>

            {/* Tax Transparency Score */}
            <Card>
                <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                    {getStatusIcon("fair")}
                    <span className="font-medium">Tax Transparency Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{Number(taxTransparencyScore).toFixed(1)}/100</span>
                    <Badge variant="outline" className={getStatusColor("fair")}>fair</Badge>
                    </div>
                </div>
                <Progress value={Number(taxTransparencyScore)} className="mb-2" />
                <p className="text-sm text-muted-foreground">Transparency of tax payments and policies</p>
                </CardContent>
            </Card>
            </div>

        </AccordionContent>

        </AccordionItem>
    </Accordion>
    </div>
  );
}