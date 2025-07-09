"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { RefreshCw, TrendingUp, TrendingDown, Info, Send, Bot, User, Mic, MicOff } from "lucide-react"
import { Chatbot } from "@/components/chatbot"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const initialSuppliers = [
  { id: 1, name: "Ford", cost: 85, sustainability: 92, risk: 15, reliability: 88, overallScore: 0 },
]

const tradeOffPresets = [
  { name: "Cost Focused", weights: { cost: 50, sustainability: 20, risk: 15, reliability: 15 } },
  { name: "Sustainability First", weights: { cost: 15, sustainability: 50, risk: 20, reliability: 15 } },
  { name: "Risk Averse", weights: { cost: 20, sustainability: 25, risk: 40, reliability: 15 } },
  { name: "Reliability Priority", weights: { cost: 20, sustainability: 20, risk: 15, reliability: 45 } },
  { name: "Balanced", weights: { cost: 25, sustainability: 25, risk: 25, reliability: 25 } },
]


export default function TradeOffSimulator() {
  const [weights, setWeights] = useState({
    cost: 25,
    sustainability: 25,
    risk: 25,
    reliability: 25,
  })

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

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  useEffect(() => {
    const fetchSuppliers = async () => {
      const res = await fetch("http://localhost:8000/api/suppliers");
      const data = await res.json();
      console.log("Fetched suppliers:", data.suppliers);
      setSuppliers(data.suppliers);
    };

    fetchSuppliers();
  }, []);

  const [esgScore, setEsgScore] = useState<number | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [costEfficiencyScore, setCostEfficiencyScore] = useState<number | null>(null);
  const [reliabilityScore, setReliabilityScore] = useState<number | null>(null);

  const [isAnimating, setIsAnimating] = useState(false)
  const [activeTab, setActiveTab] = useState("simulator")

  const [costWeight, setCostWeight] = useState(25);
  const [sustainabilityWeight, setSustainabilityWeight] = useState(25);
  const [riskWeight, setRiskWeight] = useState(25);
  const [reliabilityWeight, setReliabilityWeight] = useState(25);

  const [overallScore, setOverallScore] = useState(0);
  const [selectedSupplier, setSelectedSupplier] = useState("")

  // for Overall score 
  useEffect(() => {
    if (selectedSupplier) {
      // Find the full supplier data including ESG score
      const supplierWithScore = suppliers.find(s => s.company_name === selectedSupplier);
      setReliabilityScore(supplierWithScore?.reliability_score ?? null);
      setRiskScore(supplierWithScore?.risk_score ?? null);
      setCostEfficiencyScore(supplierWithScore?.cost_score ?? null);
      setEsgScore(80);
    } else {
      setReliabilityScore(0);
      setRiskScore(0);
      setCostEfficiencyScore(0);
    }
  }, [selectedSupplier, suppliers]);

  const totalWeight =
    costWeight +
    sustainabilityWeight +
    riskWeight +
    reliabilityWeight;

  // Create sorted array of suppliers with overallScore attached
  const sortedSuppliers = [...suppliers]
    .map((supplier) => {
      const overallScore =
        (
          supplier.cost_score * costWeight +
          supplier.esg_score * sustainabilityWeight +
          supplier.risk_score * riskWeight +
          supplier.reliability_score * reliabilityWeight
        ) / totalWeight;

      return {
        ...supplier,
        overallScore
      };
    })
    .sort((a, b) => b.overallScore - a.overallScore);


  return (
    <div className="relative pt-20 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Trade-Off Simulator
          </h1>
          <p className="text-xl text-muted-foreground">
            Adjust weights to see how supplier rankings change in real-time with AI-powered insights
          </p>
        </div>

        {/* Trade-Off Simulator Content (single tab) */}
        <div className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Controls Panel */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weight Configuration</CardTitle>
                  <CardDescription>Adjust the importance of each factor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Cost Efficiency</label>
                        <span className="text-sm text-muted-foreground">{costWeight}%</span>
                      </div>
                      <Slider
                        value={[costWeight]}
                        onValueChange={([value]) => setCostWeight(value)}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Sustainability</label>
                        <span className="text-sm text-muted-foreground">{sustainabilityWeight}%</span>
                      </div>
                      <Slider
                        value={[sustainabilityWeight]}
                        onValueChange={([value]) => setSustainabilityWeight(value)}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Risk Management</label>
                        <span className="text-sm text-muted-foreground">{riskWeight}%</span>
                      </div>
                      <Slider
                        value={[riskWeight]}
                        onValueChange={([value]) => setRiskWeight(value)}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Reliability</label>
                        <span className="text-sm text-muted-foreground">{reliabilityWeight}%</span>
                      </div>
                      <Slider
                        value={[reliabilityWeight]}
                        onValueChange={([value]) => setReliabilityWeight(value)}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        setCostWeight(25);
                        setSustainabilityWeight(25);
                        setRiskWeight(25);
                        setReliabilityWeight(25);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Presets</CardTitle>
                  <CardDescription>Apply common weight configurations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      setCostWeight(50);
                      setSustainabilityWeight(20);
                      setRiskWeight(15);
                      setReliabilityWeight(15);
                    }}
                  >
                    Cost Focused
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      setCostWeight(15);
                      setSustainabilityWeight(50);
                      setRiskWeight(20);
                      setReliabilityWeight(15);
                    }}
                  >
                    Sustainability Focused
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      setCostWeight(20);
                      setSustainabilityWeight(25);
                      setRiskWeight(40);
                      setReliabilityWeight(15);
                    }}
                  >
                    Risk Focused
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      setCostWeight(20);
                      setSustainabilityWeight(20);
                      setRiskWeight(15);
                      setReliabilityWeight(45);
                    }}
                  >
                    Reliability Focused
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      setCostWeight(25);
                      setSustainabilityWeight(25);
                      setRiskWeight(25);
                      setReliabilityWeight(25);
                    }}
                  >
                    Balanced Focused
                  </Button>
                </CardContent>
              </Card>


            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Rankings</CardTitle>
                  <CardDescription>Rankings update automatically based on your weight preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`space-y-4 transition-opacity duration-300 ${isAnimating ? "opacity-50" : "opacity-100"
                      }`}
                  >
                    {sortedSuppliers.map((supplier, index) => (
                      <div
                        key={`${supplier.cost_score}_${supplier.reliability_score}_${supplier.email_domain}_${supplier.esg_score}`}
                        className="flex items-center justify-between p-4 border rounded-lg transition-all duration-500 hover:shadow-md"
                        style={{
                          transform: isAnimating ? "translateY(10px)" : "translateY(0)",
                          transition: "all 0.5s ease-in-out",
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-muted-foreground">
                              #{index + 1}
                            </span>
                            {index === 0 && (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            )}
                            {index === sortedSuppliers.length - 1 && (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{supplier.company_name}</h3>
                            <div className="flex space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                Cost: {supplier.cost_score}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                ESG: {supplier.esg_score}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Risk: {supplier.risk_score}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Reliability: {supplier.reliability_score}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {isNaN(supplier.overallScore) || supplier.overallScore === undefined
                              ? "0"
                              : supplier.overallScore.toFixed(2)}
                          </div>

                          <div className="text-sm text-muted-foreground">Overall Score</div>
                        </div>
                      </div>
                    ))}
                  </div>

                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  )
}

