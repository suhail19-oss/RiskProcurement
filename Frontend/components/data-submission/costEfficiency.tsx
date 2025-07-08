"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, CheckCircle, AlertTriangle, DollarSign, TrendingDown, BarChart2, ChevronDown, ChevronUp } from "lucide-react"
import { CostMetricsSection } from "@/components/data-submission/sections/CostMetricsSection"
import { EfficiencyMetricsSection } from "@/components/data-submission/sections/EfficiencyMetricsSection"
import { ComplianceMetricsSection } from "@/components/data-submission/sections/ComplianceMetricsSection"
import Loading from "./loading"

type SectionId = 'costs' | 'efficiency' | 'compliance' | 'documents';

const sections = [
  { id: "costs", title: "Cost Metrics", icon: DollarSign, description: "Direct and indirect cost measurements" },
  { id: "efficiency", title: "Efficiency Metrics", icon: TrendingDown, description: "Operational efficiency indicators" },
  { id: "compliance", title: "Compliance Metrics", icon: BarChart2, description: "Regulatory and legal compliance factors" },
  { id: "documents", title: "Documents", icon: Upload, description: "Supporting documentation" }
]

const userData = JSON.parse(localStorage.getItem("userData") || "{}");
const email = userData.email;

export default function CostEfficiency() {

  

  // Cost Metrics State
  const [unitPriceBenchmarking, setUnitPriceBenchmarking] = useState("");
  const [volumeDiscountPotential, setVolumeDiscountPotential] = useState("");
  const [paymentTermsFlexibility, setPaymentTermsFlexibility] = useState("");
  const [contractValue, setContractValue] = useState("");

  // Efficiency Metrics State
  const [inTransitDelayDays, setInTransitDelayDays] = useState("");
  const [inTransitDelayFactor, setInTransitDelayFactor] = useState("");
  const [normalizedInTransitDelayFactor, setNormalizedInTransitDelayFactor] = useState("");
  const [firstPassYield, setFirstPassYield] = useState("");

  // Compliance Metrics State
  const [legalDisputes, setLegalDisputes] = useState("");
  const [legalDisputeScore, setLegalDisputeScore] = useState("");
  const [warZoneFlag, setWarZoneFlag] = useState("");
  const [warZoneNorm, setWarZoneNorm] = useState("");
  const [tradePolicyChanges, setTradePolicyChanges] = useState("");
  const [tradePolicyNorm, setTradePolicyNorm] = useState("");
  const [laborViolations, setLaborViolations] = useState("");
  const [laborViolationRisk, setLaborViolationRisk] = useState("");
  const [recallScore, setRecallScore] = useState("");
  const [govtSanctions, setGovtSanctions] = useState("");
  const [sanctionScore, setSanctionScore] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  
  const [uploadedFiles, setUploadedFiles] = useState<{ costDocument?: File }>({});

  const [expandedSections, setExpandedSections] = useState({
    costs: true,
    efficiency: false,
    compliance: false,
    documents: false
  });

  const toggleSection = (sectionId: SectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  };

  const updateCostFormFields = (data: any) => {
    // Cost Metrics
    setUnitPriceBenchmarking(data.unit_price_benchmarking?.toString() || "");
    setVolumeDiscountPotential(data.volume_discount_potential?.toString() || "");
    setPaymentTermsFlexibility(data.payment_terms_flexibility?.toString() || "");
    setContractValue(data.contract_value?.toString() || "");

    // Efficiency Metrics
    setInTransitDelayDays(data.in_transit_delay_days?.toString() || "");
    setInTransitDelayFactor(data.new_in_transit_delay_factor?.toString() || "");
    setNormalizedInTransitDelayFactor(data.normalized_in_transit_delay_factor?.toString() || "");
    setFirstPassYield(data.first_pass_yield?.toString() || "");

    // Compliance Metrics
    setLegalDisputes(data.legal_disputes?.toString() || "");
    setLegalDisputeScore(data.legal_dispute_score?.toString() || "");
    setWarZoneFlag(data.war_zone_flag?.toString() || "");
    setWarZoneNorm(data.war_zone_norm?.toString() || "");
    setTradePolicyChanges(data.trade_policy_changes || "");
    setTradePolicyNorm(data.trade_policy_norm?.toString() || "");
    setLaborViolations(data.labor_violations || "");
    setLaborViolationRisk(data.labor_violation_risk?.toString() || "");
    setRecallScore(data.recall_score?.toString() || "");
    setGovtSanctions(data.govt_sanctions?.toString() || "0");
    setSanctionScore(data.sanction_score?.toString() || "0");
  };

  useEffect(() => {
    const checkData = async () => {
      try {
        const dbResponse = await fetch('http://localhost:8000/get-cost-prefill', 
        {
          headers: { "email": email }
        });
        
        if (dbResponse.ok) {
          const dbData = await dbResponse.json();
          console.log("Prefilled from DB:", dbData.result);
          setHasData(true);
          updateCostFormFields(dbData.result);
          return;
        }
        
        setHasData(false);
      } catch (err) {
        console.error("error:", err);
      }
    }
    checkData();
  }, [])

  const handleFinalCostSubmit = async () => {
    try {
        const response = await fetch("http://localhost:8000/calculate-ci-score", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Send as JSON
        });

        if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to calculate ESG score");
        }

        const data = await response.json();
        
        console.log("ESG scores calculated:", data);
        return data;
    } catch (err: any) {
        console.error("ESG Calculation Error:", err);
        throw err;
    }
    };

      // <---- Handles file uploads ---->
  const handleFileUpload = async (key: string, file: File) => {
  try {
    setIsLoading(true);
    setUploadedFiles((prev) => ({ ...prev, [key]: file }));
    setUploadProgress(10);

    const formData = new FormData();
    formData.append("file", file);

    // Get email from localStorage (or any other auth provider)
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const email = userData.email || "";
    formData.append("email", email);

    console.log("Uploading file:", file.name);

    setUploadProgress(30);
    const response = await fetch("http://localhost:8000/submit-ci-report", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to upload ESG report.");
    }

    const data = await response.json();
    updateCostFormFields( data.result)
    setUploadProgress(50);
    console.log("Upload and extraction successful:", data);

    // Optionally: you can store result in state or trigger a re-fetch of prefill
    setHasData( true ); 

    // calling function to 
    try {
      await handleFinalCostSubmit();
      setUploadProgress(100);
    } catch (err) {
    console.error("Final submission failed (non-blocking):", err);
    } 

    setUploadProgress(100);
    setIsLoading(false);
  } catch (err) {
    setIsLoading(false);
    setUploadProgress(0);
    console.error("Upload error:", err);
    alert("Failed to upload ESG report. Please try again.");
  }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <Loading isLoading = {isLoading} uploadProgress= {uploadProgress} />

      {/* Progress Bar with Status Message */}
      <div className="max-w-6xl mx-auto mb-8 animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-foreground">Submission Progress</span>
          <span className="text-sm text-muted-foreground">{hasData ? 100 : uploadProgress}% Complete</span>
        </div>
        <Progress 
          value={hasData ? 100 : uploadProgress} 
          className="h-2 transition-all duration-500"
        />
        
        <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 transition-colors duration-200
            ${hasData 
              ? "bg-background border border-primary/30" 
              : "bg-background border border-destructive/30"
            }`}
        >
          {hasData ? (
            <>
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Cost data successfully processed</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Efficiency metrics calculated.{" "}
                  <a 
                    href="/cost-analysis" 
                    className="text-primary hover:text-primary/80 underline transition-colors"
                  >
                    View full analysis
                  </a>
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Cost analysis required</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please upload your cost efficiency documents
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {sections.map((section) => (
        <Card
          key={section.id}
          className={`transition-all duration-300 hover:shadow-lg ${expandedSections[section.id as SectionId] ? 'border-primary/30' : ''}`}
        >
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors duration-200 rounded-t-lg"
            onClick={() => toggleSection(section.id as SectionId)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <section.icon className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-primary" />
                <CardTitle className="text-xl lg:text-2xl">{section.title}</CardTitle>
              </div>
              {expandedSections[section.id as SectionId] ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <CardDescription>{section.description}</CardDescription>
          </CardHeader>

          {expandedSections[section.id as SectionId] && (
            <CardContent className="space-y-6 animate-fade-in">
              {section.id === "costs" && (
                <CostMetricsSection
                  unitPriceBenchmarking={unitPriceBenchmarking}
                  setUnitPriceBenchmarking={setUnitPriceBenchmarking}
                  volumeDiscountPotential={volumeDiscountPotential}
                  setVolumeDiscountPotential={setVolumeDiscountPotential}
                  paymentTermsFlexibility={paymentTermsFlexibility}
                  setPaymentTermsFlexibility={setPaymentTermsFlexibility}
                  contractValue={contractValue}
                  setContractValue={setContractValue}
                />
              )}

              {section.id === "efficiency" && (
                <EfficiencyMetricsSection
                  inTransitDelayDays={inTransitDelayDays}
                  setInTransitDelayDays={setInTransitDelayDays}
                  inTransitDelayFactor={inTransitDelayFactor}
                  setInTransitDelayFactor={setInTransitDelayFactor}
                  normalizedInTransitDelayFactor={normalizedInTransitDelayFactor}
                  setNormalizedInTransitDelayFactor={setNormalizedInTransitDelayFactor}
                  firstPassYield={firstPassYield}
                  setFirstPassYield={setFirstPassYield}
                />
              )}

              {section.id === "compliance" && (
                <ComplianceMetricsSection
                  legalDisputes={legalDisputes}
                  setLegalDisputes={setLegalDisputes}
                  legalDisputeScore={legalDisputeScore}
                  setLegalDisputeScore={setLegalDisputeScore}
                  warZoneFlag={warZoneFlag}
                  setWarZoneFlag={setWarZoneFlag}
                  warZoneNorm={warZoneNorm}
                  setWarZoneNorm={setWarZoneNorm}
                  tradePolicyChanges={tradePolicyChanges}
                  setTradePolicyChanges={setTradePolicyChanges}
                  tradePolicyNorm={tradePolicyNorm}
                  setTradePolicyNorm={setTradePolicyNorm}
                  laborViolations={laborViolations}
                  setLaborViolations={setLaborViolations}
                  laborViolationRisk={laborViolationRisk}
                  setLaborViolationRisk={setLaborViolationRisk}
                  recallScore={recallScore}
                  setRecallScore={setRecallScore}
                  govtSanctions={govtSanctions}
                  setGovtSanctions={setGovtSanctions}
                  sanctionScore={sanctionScore}
                  setSanctionScore={setSanctionScore}
                />
              )}

              {section.id === "documents" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Cost Efficiency Report</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-float" />
                      <p className="text-lg font-medium mb-2">Upload Cost Report</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload your cost efficiency analysis (PDF, Word, Excel)
                      </p>

                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload("costDocument", file)
                        }}
                        className="hidden"
                        id="cost-document-upload"
                        accept=".pdf,.docx,.xlsx"
                      />

                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("cost-document-upload")?.click()}
                        className="transition-all duration-300 hover:scale-105"
                      >
                        Choose File
                      </Button>

                      <p className="text-xs text-muted-foreground mt-2">Max file size: 10MB</p>

                      {uploadedFiles.costDocument && (
                        <p className="text-sm text-green-600 mt-2 flex items-center justify-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          {uploadedFiles.costDocument.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}