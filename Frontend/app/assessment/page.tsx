"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts"
import {
  CheckCircle,
  AlertTriangle,
  Target,
  BarChart3,
  Shield,
  TrendingUp,
  Award,
  Info,
  RefreshCw,
  FileText,
  Download,
  Calendar,
  Filter,
  Bot,
} from "lucide-react"
import { Chatbot } from "@/components/chatbot"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

const validationSteps = [
  { id: 1, name: "Data Collection", status: "completed", duration: "2 minutes" },
  { id: 2, name: "Document Verification", status: "completed", duration: "5 minutes" },
  { id: 3, name: "Cross-Reference Check", status: "completed", duration: "3 minutes" },
  { id: 4, name: "Industry Benchmarking", status: "in-progress", duration: "4 minutes" },
  { id: 5, name: "Risk Assessment", status: "pending", duration: "3 minutes" },
  { id: 6, name: "Final Scoring", status: "pending", duration: "2 minutes" },
]

const scoringWeights = [
  { name: "Environmental", value: 9, color: "#10b981" },
  { name: "Social", value: 8, color: "#3b82f6" },
  { name: "Governance", value: 8, color: "#8b5cf6" },
  { name: "Cost Efficiency Score", value: 25, color: "#f43f5e" },
  { name: "Risk Score", value: 25, color: "#f59e0b" },
  { name: "Reliability Score", value: 25, color: "#ec4899" },
]

// Reports Data
const reportTemplates = [
  { id: 1, name: "Performance Report", type: "Monthly", lastGenerated: "2024-01-15", status: "Ready" },

]


function getStatusColor(status: string) {
  switch (status) {
    case "Ready":
      return "text-green-600 bg-green-100 dark:bg-green-900/20"
    case "Pending":
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
    case "Overdue":
      return "text-red-600 bg-red-100 dark:bg-red-900/20"
    default:
      return "text-gray-600 bg-gray-100 dark:bg-gray-900/20"
  }
}

export default function AssessmentPage() {
  const [selectedSupplier, setSelectedSupplier] = useState("ford")
  const [validationProgress, setValidationProgress] = useState(0)
  const [isValidating, setIsValidating] = useState(false)
  const [activeTab, setActiveTab] = useState("scoring")

  const [environmental, setEnvironmental] = useState('');
  const [social, setSocial] = useState('');
  const [governance, setGovernance] = useState('');
  const [cost, setCost] = useState('');
  const [risk, setRisk] = useState('');
  const [reliability, setReliability] = useState('');

  const [aiSuggestionE, setAiSuggestionE] = useState('');
  const [aiSuggestionS, setAiSuggestionS] = useState('');
  const [aiSuggestionG, setAiSuggestionG] = useState('');
  const [aiSuggestionC, setAiSuggestionC] = useState('');
  const [aiSuggestionRi, setAiSuggestionRi] = useState('');
  const [aiSuggestionRe, setAiSuggestionRe] = useState('');

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiLoadingS, setIsAiLoadingS] = useState(false);
  const [isAiLoadingG, setIsAiLoadingG] = useState(false);
  const [isAiLoadingC, setIsAiLoadingC] = useState(false);
  const [isAiLoadingRi, setIsAiLoadingRi] = useState(false);
  const [isAiLoadingRe, setIsAiLoadingRe] = useState(false);



  type Supplier = {
    product_id: number;
    company_name: string;
    email_domain: string;
    location: string;
    reliability_score: number;
    risk_score: number;
    cost_score: number;
    esg_score: number;
    esg_final_score: number;
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
  };

  const [esgScore, setEsgScore] = useState<number | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [costEfficiencyScore, setCostEfficiencyScore] = useState<number | null>(null);
  const [reliabilityScore, setReliabilityScore] = useState<number | null>(null);



  //fetchins suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

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


        } else {
          // Fallback if company_name missing
          setSelectedSupplier("");

        }
      } catch (error) {
        console.error("Error fetching profile:", error);

        // Fallback in case of error
        setSelectedSupplier("");

      } finally {

      }
    };

    // Call the async function
    fetchProfileAndSetCompany();
  }, [suppliers]);

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
    setReliabilityScore(parseFloat(reliabilityScoreCal.toFixed(2)));
  }, [selectedSupplier, suppliers]);

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
    setCostEfficiencyScore(parseFloat(costEfficiencyScoreCal.toFixed(2)));

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


  const supplierWithScore = suppliers.find(
    (s) => s.company_name === selectedSupplier
  );

  const handleAiAnalyzeE = async (factor: string) => {
    setIsAiLoading(true);
    try {
      // Compose the prompt with the environmental score
      const prompt = `Current ESG score: ${supplierWithScore?.esg_score} `;
      const response = await fetch("http://localhost:8000/api/gemini-recommendations-eScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      // Join the recommendations into a string for display
      setAiSuggestionE(data.recommendations.join("\n"));
    } catch (error) {
      setAiSuggestionE("Failed to get recommendations.");
    } finally {
      setIsAiLoading(false);
    }
  }

  const handleAiAnalyzeS = async (factor: string) => {
    setIsAiLoadingS(true);
    try {
      // Compose the prompt with the environmental score
      const prompt = `Current cost Effieciency score: ${supplierWithScore?.cost_score} `;
      const response = await fetch("http://localhost:8000/api/gemini-recommendations-sScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      console.log("AI Response:", data);
      // Join the recommendations into a string for display
      setAiSuggestionS(data.recommendations.join("\n"));
    } catch (error) {
      setAiSuggestionS("Failed to get recommendations.");
    } finally {
      setIsAiLoadingS(false);
    }
  };

  const handleAiAnalyzeG = async (factor: string) => {
    setIsAiLoadingG(true);
    try {
      // Compose the prompt with the environmental score
      const prompt = `Current risk score: ${supplierWithScore?.risk_score}`;
      const response = await fetch("http://localhost:8000/api/gemini-recommendations-gScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      console.log("AI Response:", data);
      // Join the recommendations into a string for display
      setAiSuggestionG(data.recommendations.join("\n"));
    } catch (error) {
      setAiSuggestionG("Failed to get recommendations.");
    } finally {
      setIsAiLoadingG(false);
    }
  };

  const handleAiAnalyzeC = async (factor: string) => {
    setIsAiLoadingC(true);
    try {
      // Compose the prompt with the environmental score
      const prompt = `Current reliability score: ${supplierWithScore?.reliability_score} `;
      const response = await fetch("http://localhost:8000/api/gemini-recommendations-cScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      console.log("AI Response:", data);
      // Join the recommendations into a string for display
      setAiSuggestionC(data.recommendations.join("\n"));
    } catch (error) {
      setAiSuggestionC("Failed to get recommendations.");
    } finally {
      setIsAiLoadingC(false);
    }
  };


  const handleDownload = (text: string, filename: string = "environmental_analysis.txt"): void => {
    const element: HTMLAnchorElement = document.createElement("a");
    const file: Blob = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  const handleDownloadS = (text: string, filename: string = "Social_analysis.txt"): void => {
    const element: HTMLAnchorElement = document.createElement("a");
    const file: Blob = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  const handleDownloadG = (text: string, filename: string = "Governance_analysis.txt"): void => {
    const element: HTMLAnchorElement = document.createElement("a");
    const file: Blob = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadRi = (text: string, filename: string = "Risk_analysis.txt"): void => {
    const element: HTMLAnchorElement = document.createElement("a");
    const file: Blob = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  useEffect(() => {
    const completedSteps = validationSteps.filter((step) => step.status === "completed").length
    const inProgressSteps = validationSteps.filter((step) => step.status === "in-progress").length
    setValidationProgress(((completedSteps + inProgressSteps * 0.5) / validationSteps.length) * 100)
  }, [])

  useEffect(() => {
    const fetchSuppliers = async () => {
      const res = await fetch("http://localhost:8000/api/suppliers");
      const data = await res.json();
      console.log("Fetched suppliers:", data.suppliers);
      setSuppliers(data.suppliers);
    };

    fetchSuppliers();
  }, []);


  const downloadReport = async (reportId: number) => {
    try {
      // 1. Extract data from localStorage
      const company_name = "Supplier";

      const supplierWithScore = suppliers.find(s => s.company_name === selectedSupplier);
      const cost_score = costEfficiencyScore ?? 0;
      const risk_score = supplierWithScore?.risk_score ?? 0;
      const reliability_score = reliabilityScore ?? 0;
      const esg_score = supplierWithScore?.esg_score ?? supplierWithScore?.esg_final_score ?? 0;

      console.log("Supplier Scores:", { esg_score, cost_score, risk_score, reliability_score });

      // 3. Prepare payload
      const payload = {
        company_name,
        esg_score,
        cost_score,
        risk_score,
        reliability_score,
        aiSuggestionE,
        aiSuggestionS,
        aiSuggestionG,
        aiSuggestionC
      };

      // 4. Send request to backend
      const response = await fetch("http://localhost:8000/generate-esg-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      console.log("Response status:", response);
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      // 5. Convert response to blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${company_name}_ESG_Report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const [adjustedOnTimeDeliveryRate, setAdjustedOnTimeDeliveryRate] = useState("");
  const [averageLeadTimeDaysScore, setAverageLeadTimeDaysScore] = useState("");
  const [productDefectRate, setProductDefectRate] = useState("");
  const [isoCertificationScore, setIsoCertificationScore] = useState("");
  const [infrastructureDisruptionSeverityScore, setInfrastructureDisruptionSeverityScore] = useState("");
  const [combinedDisruption, setCombinedDisruption] = useState("");

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
  return (
    <div className="relative pt-20 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          
          <h1 className="text-4xl font-bold font-heading mb-4">
             <span className="bg-gradient-to-r from-[#E2142D] via-[#2563eb] to-[#a21caf] bg-clip-text text-transparent animate-gradient-text ">Analysis  & Reporting Center</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive ESG evaluation with real-time validation, benchmarking, and automated reporting
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full justify-between gap-2">
            <TabsTrigger value="scoring" className="flex-1 min-w-5 px-2 py-1 text-xs">
              Scoring
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex-1 min-w-5 px-2 py-1 text-xs">
              Actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Target className="h-6 w-6 mr-3 text-primary" />
                  Scoring Weight Model
                </CardTitle>
                <CardDescription>How different ESG factors contribute to the overall score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={scoringWeights}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={160}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {scoringWeights.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {scoringWeights.map((weight, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: weight.color }} />
                        <span className="text-sm">
                          {weight.name}: {weight.value}%
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="ai" className="space-y-8">
            {/* Horizontal Cards Grid */}
            <div className="grid grid-cols-1 gap-6">
              {/* ESG Card */}
              <Card className="transition-all duration-300 hover:shadow-lg bg-green-100">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-black">ESG</CardTitle>
                    <CardDescription>
                      Current Score: {supplierWithScore?.esg_score ?? supplierWithScore?.esg_final_score ?? "N/A"}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => handleAiAnalyzeE("environmental")}
                    disabled={isAiLoading || !(supplierWithScore?.esg_score || supplierWithScore?.esg_final_score)}
                    className="bg-red-500 text-white hover:bg-red-700 transition-colors"
                  >
                    Analyze
                  </Button>
                </CardHeader>
                <CardContent>
                  {isAiLoading && (
                    <div className="w-full mb-4">
                      <div className="text-sm text-gray-600 mb-1">Analyzing...</div>

                    </div>
                  )}

                  {aiSuggestionE && (
                    <div className="mt-4">
                      <Accordion type="single" collapsible>
                        <AccordionItem value="esg-suggestion">
                          <AccordionTrigger className="text-sm font-medium">
                            View AI Suggestions
                          </AccordionTrigger>
                          <AccordionContent className="p-4 bg-gray-50 rounded-lg mt-2">
                            <div className="prose prose-sm max-w-none">
                              {aiSuggestionE.split('\n').map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                              ))}
                            </div>
                            <Button
                              size="sm"
                              className="mt-4 bg-red-500 text-white hover:bg-red-700 transition-colors"
                              onClick={() => handleDownload(aiSuggestionE)}
                            >
                              Download Analysis
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Cost Efficiency Score Card */}
              <Card className="transition-all duration-300 hover:shadow-lg bg-blue-100">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-black">Cost Efficiency Score</CardTitle>
                    <CardDescription>
                      Current Score: {costEfficiencyScore ?? "N/A"}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => handleAiAnalyzeS("social")}
                    disabled={isAiLoadingS || !costEfficiencyScore}
                    className="bg-red-500 text-white hover:bg-red-700 transition-colors"
                  >
                    Analyze
                  </Button>
                </CardHeader>
                <CardContent>
                  {isAiLoadingS && (
                    <div className="w-full mb-4">
                      <div className="text-sm text-gray-600 mb-1">Analyzing...</div>

                    </div>
                  )}
                  {aiSuggestionS && (
                    <div className="mt-4">
                      <Accordion type="single" collapsible>
                        <AccordionItem value="cost-suggestion">
                          <AccordionTrigger className="text-sm font-medium">
                            View AI Suggestions
                          </AccordionTrigger>
                          <AccordionContent className="p-4 bg-gray-50 rounded-lg mt-2">
                            <div className="prose prose-sm max-w-none">
                              {aiSuggestionS.split('\n').map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                              ))}
                            </div>
                            <Button
                              size="sm"
                              className="mt-4 bg-red-500 text-white hover:bg-red-700 transition-colors"
                              onClick={() => handleDownloadS(aiSuggestionS)}
                            >
                              Download Analysis
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Overall Risk Score Card */}
              <Card className="transition-all duration-300 hover:shadow-lg bg-yellow-100">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-black">Overall Risk Score</CardTitle>
                    <CardDescription>
                      Current Score: {supplierWithScore?.risk_score.toFixed(2) ?? "N/A"}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => handleAiAnalyzeG("governance")}
                    disabled={isAiLoadingG || !(supplierWithScore?.risk_score)}
                    className="bg-red-500 text-white hover:bg-red-700 transition-colors"
                  >
                    Analyze
                  </Button>
                </CardHeader>
                <CardContent>
                  {isAiLoadingG && (
                    <div className="w-full mb-4">
                      <div className="text-sm text-gray-600 mb-1">Analyzing...</div>

                    </div>
                  )}
                  {aiSuggestionG && (
                    <div className="mt-4">
                      <Accordion type="single" collapsible>
                        <AccordionItem value="risk-suggestion">
                          <AccordionTrigger className="text-sm font-medium">
                            View AI Suggestions
                          </AccordionTrigger>
                          <AccordionContent className="p-4 bg-gray-50 rounded-lg mt-2">
                            <div className="prose prose-sm max-w-none">
                              {aiSuggestionG.split('\n').map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                              ))}
                            </div>
                            <Button
                              size="sm"
                              className="mt-4 bg-red-500 text-white hover:bg-red-700 transition-colors"
                              onClick={() => handleDownloadG(aiSuggestionG)}
                            >
                              Download Analysis
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reliability Card */}
              <Card className="transition-all duration-300 hover:shadow-lg bg-pink-100">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-black">Reliability Factor</CardTitle>
                    <CardDescription>
                      Current Score: {reliabilityScore ?? "N/A"}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => handleAiAnalyzeC("reliability")}
                    disabled={isAiLoadingC || !reliabilityScore}
                    className="bg-red-500 text-white hover:bg-red-700 transition-colors"
                  >
                    Analyze
                  </Button>
                </CardHeader>
                <CardContent>
                  {isAiLoadingC && (
                    <div className="w-full mb-4">
                      <div className="text-sm text-gray-600 mb-1">Analyzing...</div>

                    </div>
                  )}
                  {aiSuggestionC && (
                    <div className="mt-4">
                      <Accordion type="single" collapsible>
                        <AccordionItem value="reliability-suggestion">
                          <AccordionTrigger className="text-sm font-medium">
                            View AI Suggestions
                          </AccordionTrigger>
                          <AccordionContent className="p-4 bg-gray-50 rounded-lg mt-2">
                            <div className="prose prose-sm max-w-none">
                              {aiSuggestionC.split('\n').map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                              ))}
                            </div>
                            <Button
                              size="sm"
                              className="mt-4 bg-red-500 text-white hover:bg-red-700 transition-colors"
                              onClick={() => handleDownloadRi(aiSuggestionC)}
                            >
                              Download Analysis
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Report Card (stays the same) */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center">
                      <FileText className="h-6 w-6 mr-3 text-primary" />
                      Report
                    </CardTitle>
                    <CardDescription>Generate and download comprehensive reports</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportTemplates.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{report.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{report.type}</span>
                            <span>•</span>
                            <span>Last generated: {report.lastGenerated}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadReport(report.id)}
                            disabled={report.status !== "Ready"}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Chatbot />
    </div>
  )
}
