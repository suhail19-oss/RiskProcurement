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


function getRiskColor(risk: string) {
  switch (risk) {
    case "Low":
      return "text-green-600 bg-green-100 dark:bg-green-900/20"
    case "Medium":
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
    case "High":
      return "text-red-600 bg-red-100 dark:bg-red-900/20"
    default:
      return "text-gray-600 bg-gray-100 dark:bg-gray-900/20"
  }
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case "improving":
      return <TrendingUp className="h-4 w-4 text-green-600" />
    case "declining":
      return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
    default:
      return <div className="h-4 w-4 rounded-full bg-gray-400" />
  }
}

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
  };

  const [esgScore, setEsgScore] = useState<number | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [costEfficiencyScore, setCostEfficiencyScore] = useState<number | null>(null);
  const [reliabilityScore, setReliabilityScore] = useState<number | null>(null);


  //fetchins suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

   const supplierWithScore = suppliers.find(
    (s) => s.company_name === selectedSupplier
  );

  const handleAiAnalyzeE = async (factor: string) => {
    setIsAiLoading(true);
    try {
      // Compose the prompt with the environmental score
      const prompt = `Current ESG score: ${supplierWithScore?.esg_score} and Target Score is: ${esgScore}`;
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
      const prompt = `Current cost Effieciency score: ${supplierWithScore?.cost_score} and Target Score is: ${costEfficiencyScore}`;
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
      const prompt = `Current risk score: ${supplierWithScore?.risk_score} and Target Score is: ${riskScore}`;
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
      const prompt = `Current reliability score: ${supplierWithScore?.reliability_score} and Target Score is: ${reliabilityScore}`;
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
    const cost_score = supplierWithScore?.cost_score?? 0;
    const risk_score = supplierWithScore?.risk_score ?? 0;
    const reliability_score = supplierWithScore?.reliability_score ?? 0;
    const esg_score = supplierWithScore?.esg_score ?? 0;

    console.log("Supplier Scores:", { esg_score, cost_score, risk_score, reliability_score });

    // 3. Prepare payload
    const payload = {
      company_name,
      esg_score,
      cost_score,
      risk_score,
      reliability_score
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

 


  return (
    <div className="relative pt-20 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold font-heading mb-4">
            Analysis & <span className="gradient-text">Reporting Center</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive ESG evaluation with real-time validation, benchmarking, and automated reporting
          </p>
        </div>

        {/* Supplier Selection */}
        <div className="flex justify-center">
          <Select
            value={selectedSupplier}
            onValueChange={setSelectedSupplier}
          >
            <SelectTrigger className="w-64 transition-all duration-300 hover:shadow-lg">
              <SelectValue placeholder="Select a supplier">
                {selectedSupplier || "Select a supplier"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem
                  key={`${supplier.company_name}_${supplier.email_domain}_${supplier.product_id}`}
                  value={String(supplier.company_name)}

                >
                  {supplier.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>



        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Reduce tab width so all 6 tabs fit in a line */}
          <TabsList className="flex w-full justify-between gap-2">
            <TabsTrigger value="scoring" className="flex-1 min-w-5 px-2 py-1 text-xs">
              Scoring
            </TabsTrigger>

            <TabsTrigger value="risk" className="flex-1 min-w-5 px-2 py-1 text-xs">
              Risk Analysis
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex-1 min-w-5 px-2 py-1 text-xs">
              AI Analysis
            </TabsTrigger>
            <TabsTrigger value="benchmarking" className="flex-1 min-w-5 px-2 py-1 text-xs">
              Benchmarking
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
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Bot className="h-6 w-6 mr-3 text-primary" />
                  AI Analysis & Optimization
                </CardTitle>
                <CardDescription>
                  Enter your scores for each factor and let AI suggest optimization techniques.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Environmental */}
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold mr-3">ESG</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        {`Current Score: ${supplierWithScore?.esg_score ?? "N/A"}`}
                      </span>
                    </div>

                    <Input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Enter Target Score"
                      value={esgScore !== null ? esgScore : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEsgScore(val === "" ? null : Number(val));
                      }}
                      className="mb-2"
                    />

                    <Button
                      size="sm"
                      onClick={() => handleAiAnalyzeE("environmental")}
                      disabled={isAiLoading || !esgScore}
                    >
                      Analyze
                    </Button>
                    <Textarea
                      className="mt-2"
                      rows={4}
                      value={aiSuggestionE}
                      readOnly
                      placeholder="AI optimization suggestions will appear here."
                    />
                    <Button
                      size="sm"
                      className="mt-2 bg-red-600 text-white hover:bg-green-700 transition-colors"
                      onClick={() => handleDownload(aiSuggestionE)}
                      disabled={!aiSuggestionE}
                    >
                      Download Analysis
                    </Button>
                  </div>
                  {/* Social */}
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold mr-3">Cost Efficiency Score</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        {`Current Score: ${supplierWithScore?.cost_score ?? "N/A"}`}
                      </span>
                    </div>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Enter Target Score"
                      value={costEfficiencyScore !== null ? costEfficiencyScore : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCostEfficiencyScore(val === "" ? null : Number(val));
                      }}
                      className="mb-2"
                    />

                    <Button
                      size="sm"
                      onClick={() => handleAiAnalyzeS("social")}
                      disabled={isAiLoadingS || !costEfficiencyScore}
                    >
                      Analyze
                    </Button>
                    <Textarea
                      className="mt-2"
                      rows={4}
                      value={aiSuggestionS}
                      readOnly
                      placeholder="AI optimization suggestions will appear here."
                    />
                    <Button
                      size="sm"
                      className="mt-2 bg-red-600 text-white hover:bg-green-700 transition-colors"
                      onClick={() => handleDownloadS(aiSuggestionS)}
                      disabled={!aiSuggestionS}
                    >
                      Download Analysis
                    </Button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  {/* Governance */}
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold mr-3">Overall Risk Score</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        {`Current Score: ${supplierWithScore?.risk_score ?? "N/A"}`}
                      </span>
                    </div>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Enter Target Score"
                      value={riskScore !== null ? riskScore : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRiskScore(val === "" ? null : Number(val));
                      }}
                      className="mb-2"
                    />

                    <Button
                      size="sm"
                      onClick={() => handleAiAnalyzeG("governance")}
                      disabled={isAiLoadingG || !riskScore}
                    >
                      Analyze
                    </Button>
                    <Textarea
                      className="mt-2"
                      rows={4}
                      value={aiSuggestionG}
                      readOnly
                      placeholder="AI optimization suggestions will appear here."
                    />
                    <Button
                      size="sm"
                      className="mt-2 bg-red-600 text-white hover:bg-green-700 transition-colors"
                      onClick={() => handleDownloadG(aiSuggestionG)}
                      disabled={!aiSuggestionG}
                    >
                      Download Analysis
                    </Button>
                  </div>
                  {/* Risk Factor */}
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold mr-3">Reliability Factor</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        {`Current Score: ${supplierWithScore?.reliability_score ?? "N/A"}`}
                      </span>
                    </div>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Enter Target Score"
                      value={reliabilityScore !== null ? reliabilityScore : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setReliabilityScore(val === "" ? null : Number(val));
                      }}
                      className="mb-2"
                    />

                    <Button
                      size="sm"
                      onClick={() => handleAiAnalyzeC("risk")}
                      disabled={isAiLoadingRi || !reliabilityScore}
                    >
                      Analyze
                    </Button>
                    <Textarea
                      className="mt-2"
                      rows={4}
                      value={aiSuggestionRi}
                      readOnly
                      placeholder="AI optimization suggestions will appear here."
                    />
                    <Button
                      size="sm"
                      className="mt-2 bg-red-600 text-white hover:bg-green-700 transition-colors"
                      onClick={() => handleDownloadRi(aiSuggestionRi)}
                      disabled={!aiSuggestionRi}
                    >
                      Download Analysis
                    </Button>
                  </div>
                </div>

              </CardContent>

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
            </Card>
          </TabsContent>



        </Tabs>
      </div>
      <Chatbot />
    </div>
  )
}
