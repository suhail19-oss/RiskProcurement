"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, CheckCircle, AlertTriangle, Shield, Activity, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
<<<<<<< HEAD
import { OperationalRiskSection } from "@/components/data-submission/sections/OperationalRiskSection"
import { ComplianceLegalRiskSection } from "@/components/data-submission/sections/ComplianceLegalRiskSection"
import { QualityRiskSection } from "@/components/data-submission/sections/QualityRiskSection"
import { ESGRiskSection } from "@/components/data-submission/sections/ESGRiskSection"
import { GeopoliticalRiskSection } from "@/components/data-submission/sections/GeopoliticalRiskSection"
import { LogisticsRiskSection } from "@/components/data-submission/sections/LogisticsRiskSection"
import { DatabaseSync } from "node:sqlite"

type SectionId = 'operational' | 'compliance' | 'quality' | 'esg' | 'geopolitical' | 'logistics' | 'documents';

const sections = [
  { id: "operational", title: "Operational Risk", icon: Activity, description: "Operational performance metrics" },
  { id: "compliance", title: "Compliance & Legal Risk", icon: Shield, description: "Legal and regulatory compliance metrics" },
  { id: "quality", title: "Quality Risk", icon: CheckCircle, description: "Product quality and safety metrics" },
  { id: "esg", title: "ESG Risk", icon: AlertCircle, description: "Environmental, Social, and Governance factors" },
  { id: "geopolitical", title: "Geopolitical Risk", icon: AlertTriangle, description: "Political and trade-related risks" },
  { id: "logistics", title: "Logistics Risk", icon: Activity, description: "Supply chain and delivery metrics" },
=======
import { RiskOverviewSection } from "@/components/data-submission/sections/RiskOverviewSection"
import { RiskMitigationSection } from "@/components/data-submission/sections/RiskMitigationSection"

type SectionId = 'overview' | 'mitigation' | 'documents';

const sections = [
  { id: "overview", title: "Risk Overview", icon: AlertCircle, description: "Key risk indicators and exposures" },
  { id: "mitigation", title: "Risk Mitigation", icon: Shield, description: "Risk control measures and strategies" },
>>>>>>> supplier
  { id: "documents", title: "Documents", icon: Upload, description: "Supporting documentation" }
]

const userData = JSON.parse(localStorage.getItem("userData") || "{}");
const email = userData.email;

export default function Risk() {
<<<<<<< HEAD
  // Operational Risk State
  const [firstPassYield, setFirstPassYield] = useState("");
  const [fpyNormalized, setFpyNormalized] = useState("");
  const [onTimeDeliveryRate, setOnTimeDeliveryRate] = useState("");
  const [oldOnTimeDeliveryRate, setOldOnTimeDeliveryRate] = useState("");
  const [onTimeDeliveryNorm, setOnTimeDeliveryNorm] = useState("");
  const [strikeDays, setStrikeDays] = useState("");
  const [strikeIntensityNorm, setStrikeIntensityNorm] = useState("");
  const [operationalRiskScore, setOperationalRiskScore] = useState("");
  const [operationalRisk, setOperationalRisk] = useState("");

  // Compliance & Legal Risk State
  const [legalDisputes, setLegalDisputes] = useState("");
  const [legalDisputeScore, setLegalDisputeScore] = useState("");
  const [govtSanctions, setGovtSanctions] = useState("");
  const [sanctionScore, setSanctionScore] = useState("");
  const [complianceRiskScore, setComplianceRiskScore] = useState("");
  const [complianceLegalRisk, setComplianceLegalRisk] = useState("");

  // Quality Risk State
  const [productDefectRate, setProductDefectRate] = useState("");
  const [productDefectRateNorm, setProductDefectRateNorm] = useState("");
  const [newReturnRate, setNewReturnRate] = useState("");
  const [recallIncidents, setRecallIncidents] = useState("");
  const [recallScore, setRecallScore] = useState("");
  const [qualityRiskScore, setQualityRiskScore] = useState("");
  const [totalUnitsSold, setTotalUnitsSold] = useState("");

  // ESG Risk State
  const [environmentScore, setEnvironmentScore] = useState("");
  const [socialScore, setSocialScore] = useState("");
  const [governanceScore, setGovernanceScore] = useState("");
  const [esgScore, setEsgScore] = useState("");
  const [laborViolations, setLaborViolations] = useState("");
  const [laborViolationRisk, setLaborViolationRisk] = useState("");
  const [newsSentiment, setNewsSentiment] = useState("");
  const [sentimentRisk, setSentimentRisk] = useState("");
  const [esgRiskScore, setEsgRiskScore] = useState("");
  const [esgRisk, setEsgRisk] = useState("");

  // Geopolitical Risk State
  const [naturalDisasterFrequency, setNaturalDisasterFrequency] = useState("");
  const [naturalDisasterNorm, setNaturalDisasterNorm] = useState("");
  const [tradePolicyChanges, setTradePolicyChanges] = useState("");
  const [tradePolicyNorm, setTradePolicyNorm] = useState("");
  const [warZoneFlag, setWarZoneFlag] = useState("");
  const [warZoneNorm, setWarZoneNorm] = useState("");
  const [geopoliticalRiskScore, setGeopoliticalRiskScore] = useState("");

  // Logistics Risk State
  const [inTransitDelays, setInTransitDelays] = useState("");
  const [inTransitDelayFactor, setInTransitDelayFactor] = useState("");
  const [inTransitDelayFactorNorm, setInTransitDelayFactorNorm] = useState("");
  const [infrastructureDisruption, setInfrastructureDisruption] = useState("");
  const [logisticsRiskScore, setLogisticsRiskScore] = useState("");

  // Certification & Contract
  const [isoCertificationScore, setIsoCertificationScore] = useState("");
  const [contractValue, setContractValue] = useState("");

=======
  // Risk state variables
  const [financialRiskScore, setFinancialRiskScore] = useState("");
  const [operationalRiskScore, setOperationalRiskScore] = useState("");
  const [complianceRiskScore, setComplianceRiskScore] = useState("");
  const [reputationRiskScore, setReputationRiskScore] = useState("");
  const [cyberRiskScore, setCyberRiskScore] = useState("");
  const [supplyChainRiskScore, setSupplyChainRiskScore] = useState("");
  
  // Mitigation state variables
  const [riskMitigationBudget, setRiskMitigationBudget] = useState("");
  const [riskTrainingHours, setRiskTrainingHours] = useState("");
  const [incidentsLastYear, setIncidentsLastYear] = useState("");
  const [insuranceCoverageAmount, setInsuranceCoverageAmount] = useState("");
  const [businessContinuityPlans, setBusinessContinuityPlans] = useState("");
  
>>>>>>> supplier
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ riskDocument?: File }>({});

  const [expandedSections, setExpandedSections] = useState({
<<<<<<< HEAD
    operational: true,
    compliance: false,
    quality: false,
    esg: false,
    geopolitical: false,
    logistics: false,
=======
    overview: true,
    mitigation: false,
>>>>>>> supplier
    documents: false
  });

  const toggleSection = (sectionId: SectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  };

<<<<<<< HEAD
  const updateRiskFormFields = (data: any) => {
    // Operational Risk
    setFirstPassYield(data.first_pass_yield?.toString() || "");
    setFpyNormalized(data.fpy_normalized?.toString() || "");
    setOnTimeDeliveryRate(data.adjusted_on_time_delivery_rate?.toString() || "");
    setOldOnTimeDeliveryRate(data.old_on_time_delivery_rate?.toString() || "");
    setOnTimeDeliveryNorm(data.ontime_deliver_norm?.toString() || "");
    setStrikeDays(data.strike_days?.toString() || "");
    setStrikeIntensityNorm(data.strike_intensity_norm?.toString() || "");
    setOperationalRiskScore(data.operational_risk_score?.toString() || "");
    setOperationalRisk(data.operational_risk?.toString() || "");

    // Compliance & Legal Risk
    setLegalDisputes(data.legal_disputes_last_6_months?.toString() || "");
    setLegalDisputeScore(data.legal_dispute_score?.toString() || "");
    setGovtSanctions(data.govt_sanctions_penalties?.toString() || "0");
    setSanctionScore(data.sanction_score?.toString() || "0");
    setComplianceRiskScore(data.compliance_legal_risk_score?.toString() || "");
    setComplianceLegalRisk(data.compliance_legal_risk?.toString() || "");

    // Quality Risk
    setProductDefectRate(data.product_defect_rate?.toString() || "");
    setProductDefectRateNorm(data.product_defect_rate_norm?.toString() || "");
    setNewReturnRate(data.new_return_rate?.toString() || "");
    setRecallIncidents(data.product_recall_incidents?.toString() || "");
    setRecallScore(data.recall_score_out_of_100?.toString() || "");
    setQualityRiskScore(data.quality_risk_score?.toString() || "");
    setTotalUnitsSold(data.total_units_sold?.toString() || "");

    // ESG Risk
    setEnvironmentScore(data.environment?.toString() || "");
    setSocialScore(data.social?.toString() || "");
    setGovernanceScore(data.governance?.toString() || "");
    setEsgScore(data.esg?.toString() || "");
    setLaborViolations(data['labor_violations_(6_months)'] || "");
    setLaborViolationRisk(data.labor_violation_risk?.toString() || "");
    setNewsSentiment(data.news_sentiment_score?.toString() || "");
    setSentimentRisk(data.sentiment_risk?.toString() || "");
    setEsgRiskScore(data.esg_risk_score?.toString() || "");
    setEsgRisk(data.esg_risk?.toString() || "");

    // Geopolitical Risk
    setNaturalDisasterFrequency(data['natural_disaster_frequency_(last_6_months)']?.toString() || "");
    setNaturalDisasterNorm(data.natural_disaster_norm?.toString() || "");
    setTradePolicyChanges(data['trade_policy_changes_(tariffs,_bans)'] || "");
    setTradePolicyNorm(data.trade_policy_norm?.toString() || "");
    setWarZoneFlag(data.war_zone_flag?.toString() || "");
    setWarZoneNorm(data.war_zone_norm?.toString() || "");
    setGeopoliticalRiskScore(data.geopolitical_risk_score?.toString() || "");

    // Logistics Risk
    setInTransitDelays(data.in_transit_delays_days?.toString() || "");
    setInTransitDelayFactor(data.new_in_transit_delay_factor?.toString() || "");
    setInTransitDelayFactorNorm(data.in_transit_delay_factor_norm?.toString() || "");
    setInfrastructureDisruption(data.infrastructure_disruption_severity?.toString() || "");
    setLogisticsRiskScore(data.logistics_risk_score?.toString() || "");

    // Certification & Contract
    setIsoCertificationScore(data.iso_certification_score?.toString() || "");
    setContractValue(data.contract_value?.toString() || "");
  };

  useEffect(() => {
    const checkData = async () => {
      try {
        const dbResponse = await fetch('http://localhost:8000/get-risk-prefill', 
        {
          headers: { "email": email }
        });
        
        if (dbResponse.ok) {
          const dbData = await dbResponse.json();
          console.log("Prefilled from DB:", dbData.result);
          setHasData(true);
          updateRiskFormFields(dbData.result);
          console.log( dbData.result )
          return;
        }
        
        setHasData(false);
      } catch (err) {
        console.error("error:", err);
      }
    }
    checkData();
  }, [])
=======
  // Placeholder for data prefilling
>>>>>>> supplier

  const handleFileUpload = async (key: string, file: File) => {
    // Placeholder implementation
    return;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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
                <p className="font-medium text-foreground">Risk data successfully processed</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Risk factors analyzed.{" "}
                  <a 
                    href="/risk-analysis" 
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
                <p className="font-medium text-foreground">Risk assessment required</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please upload your risk assessment documents
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
<<<<<<< HEAD
              {section.id === "operational" && (
                <OperationalRiskSection
                  firstPassYield={firstPassYield}
                  setFirstPassYield={setFirstPassYield}
                  fpyNormalized={fpyNormalized}
                  setFpyNormalized={setFpyNormalized}
                  onTimeDeliveryRate={onTimeDeliveryRate}
                  setOnTimeDeliveryRate={setOnTimeDeliveryRate}
                  oldOnTimeDeliveryRate={oldOnTimeDeliveryRate}
                  setOldOnTimeDeliveryRate={setOldOnTimeDeliveryRate}
                  onTimeDeliveryNorm={onTimeDeliveryNorm}
                  setOnTimeDeliveryNorm={setOnTimeDeliveryNorm}
                  strikeDays={strikeDays}
                  setStrikeDays={setStrikeDays}
                  strikeIntensityNorm={strikeIntensityNorm}
                  setStrikeIntensityNorm={setStrikeIntensityNorm}
                  operationalRiskScore={operationalRiskScore}
                  setOperationalRiskScore={setOperationalRiskScore}
                  operationalRisk={operationalRisk}
                  setOperationalRisk={setOperationalRisk}
                />
              )}

              {section.id === "compliance" && (
                <ComplianceLegalRiskSection
                  legalDisputes={legalDisputes}
                  setLegalDisputes={setLegalDisputes}
                  legalDisputeScore={legalDisputeScore}
                  setLegalDisputeScore={setLegalDisputeScore}
                  govtSanctions={govtSanctions}
                  setGovtSanctions={setGovtSanctions}
                  sanctionScore={sanctionScore}
                  setSanctionScore={setSanctionScore}
                  complianceRiskScore={complianceRiskScore}
                  setComplianceRiskScore={setComplianceRiskScore}
                  complianceLegalRisk={complianceLegalRisk}
                  setComplianceLegalRisk={setComplianceLegalRisk}
                />
              )}

              {section.id === "quality" && (
                <QualityRiskSection
                  productDefectRate={productDefectRate}
                  setProductDefectRate={setProductDefectRate}
                  productDefectRateNorm={productDefectRateNorm}
                  setProductDefectRateNorm={setProductDefectRateNorm}
                  newReturnRate={newReturnRate}
                  setNewReturnRate={setNewReturnRate}
                  recallIncidents={recallIncidents}
                  setRecallIncidents={setRecallIncidents}
                  recallScore={recallScore}
                  setRecallScore={setRecallScore}
                  qualityRiskScore={qualityRiskScore}
                  setQualityRiskScore={setQualityRiskScore}
                  totalUnitsSold={totalUnitsSold}
                  setTotalUnitsSold={setTotalUnitsSold}
                />
              )}

              {section.id === "esg" && (
                <ESGRiskSection
                  environmentScore={environmentScore}
                  setEnvironmentScore={setEnvironmentScore}
                  socialScore={socialScore}
                  setSocialScore={setSocialScore}
                  governanceScore={governanceScore}
                  setGovernanceScore={setGovernanceScore}
                  esgScore={esgScore}
                  setEsgScore={setEsgScore}
                  laborViolations={laborViolations}
                  setLaborViolations={setLaborViolations}
                  laborViolationRisk={laborViolationRisk}
                  setLaborViolationRisk={setLaborViolationRisk}
                  newsSentiment={newsSentiment}
                  setNewsSentiment={setNewsSentiment}
                  sentimentRisk={sentimentRisk}
                  setSentimentRisk={setSentimentRisk}
                  esgRiskScore={esgRiskScore}
                  setEsgRiskScore={setEsgRiskScore}
                  esgRisk={esgRisk}
                  setEsgRisk={setEsgRisk}
                />
              )}

              {section.id === "geopolitical" && (
                <GeopoliticalRiskSection
                  naturalDisasterFrequency={naturalDisasterFrequency}
                  setNaturalDisasterFrequency={setNaturalDisasterFrequency}
                  naturalDisasterNorm={naturalDisasterNorm}
                  setNaturalDisasterNorm={setNaturalDisasterNorm}
                  tradePolicyChanges={tradePolicyChanges}
                  setTradePolicyChanges={setTradePolicyChanges}
                  tradePolicyNorm={tradePolicyNorm}
                  setTradePolicyNorm={setTradePolicyNorm}
                  warZoneFlag={warZoneFlag}
                  setWarZoneFlag={setWarZoneFlag}
                  warZoneNorm={warZoneNorm}
                  setWarZoneNorm={setWarZoneNorm}
                  geopoliticalRiskScore={geopoliticalRiskScore}
                  setGeopoliticalRiskScore={setGeopoliticalRiskScore}
                />
              )}

              {section.id === "logistics" && (
                <LogisticsRiskSection
                  inTransitDelays={inTransitDelays}
                  setInTransitDelays={setInTransitDelays}
                  inTransitDelayFactor={inTransitDelayFactor}
                  setInTransitDelayFactor={setInTransitDelayFactor}
                  inTransitDelayFactorNorm={inTransitDelayFactorNorm}
                  setInTransitDelayFactorNorm={setInTransitDelayFactorNorm}
                  infrastructureDisruption={infrastructureDisruption}
                  setInfrastructureDisruption={setInfrastructureDisruption}
                  logisticsRiskScore={logisticsRiskScore}
                  setLogisticsRiskScore={setLogisticsRiskScore}
                  isoCertificationScore={isoCertificationScore}
                  setIsoCertificationScore={setIsoCertificationScore}
                  contractValue={contractValue}
                  setContractValue={setContractValue}
=======
              {section.id === "overview" && (
                <RiskOverviewSection
                  financialRiskScore={financialRiskScore}
                  setFinancialRiskScore={setFinancialRiskScore}
                  operationalRiskScore={operationalRiskScore}
                  setOperationalRiskScore={setOperationalRiskScore}
                  complianceRiskScore={complianceRiskScore}
                  setComplianceRiskScore={setComplianceRiskScore}
                  reputationRiskScore={reputationRiskScore}
                  setReputationRiskScore={setReputationRiskScore}
                  cyberRiskScore={cyberRiskScore}
                  setCyberRiskScore={setCyberRiskScore}
                  supplyChainRiskScore={supplyChainRiskScore}
                  setSupplyChainRiskScore={setSupplyChainRiskScore}
                />
              )}

              {section.id === "mitigation" && (
                <RiskMitigationSection
                  riskMitigationBudget={riskMitigationBudget}
                  setRiskMitigationBudget={setRiskMitigationBudget}
                  riskTrainingHours={riskTrainingHours}
                  setRiskTrainingHours={setRiskTrainingHours}
                  incidentsLastYear={incidentsLastYear}
                  setIncidentsLastYear={setIncidentsLastYear}
                  insuranceCoverageAmount={insuranceCoverageAmount}
                  setInsuranceCoverageAmount={setInsuranceCoverageAmount}
                  businessContinuityPlans={businessContinuityPlans}
                  setBusinessContinuityPlans={setBusinessContinuityPlans}
>>>>>>> supplier
                />
              )}

              {section.id === "documents" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Risk Assessment Document</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-float" />
                      <p className="text-lg font-medium mb-2">Upload Risk Report</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload your comprehensive risk assessment (PDF, Word, Excel)
                      </p>

                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload("riskDocument", file)
                        }}
                        className="hidden"
                        id="risk-document-upload"
                        accept=".pdf,.docx,.xlsx"
                      />

                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("risk-document-upload")?.click()}
                        className="transition-all duration-300 hover:scale-105"
                      >
                        Choose File
                      </Button>

                      <p className="text-xs text-muted-foreground mt-2">Max file size: 10MB</p>

                      {uploadedFiles.riskDocument && (
                        <p className="text-sm text-green-600 mt-2 flex items-center justify-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          {uploadedFiles.riskDocument.name}
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