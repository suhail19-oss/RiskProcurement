"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const shouldDisableField = (fieldValue: string) => {
  return !fieldValue;
};

export function ComplianceLegalRiskSection({
  legalDisputes, setLegalDisputes,
  legalDisputeScore, setLegalDisputeScore,
  govtSanctions, setGovtSanctions,
  sanctionScore, setSanctionScore,
  complianceRiskScore, setComplianceRiskScore,
  complianceLegalRisk, setComplianceLegalRisk
}: {
  legalDisputes: string; setLegalDisputes: (value: string) => void;
  legalDisputeScore: string; setLegalDisputeScore: (value: string) => void;
  govtSanctions: string; setGovtSanctions: (value: string) => void;
  sanctionScore: string; setSanctionScore: (value: string) => void;
  complianceRiskScore: string; setComplianceRiskScore: (value: string) => void;
  complianceLegalRisk: string; setComplianceLegalRisk: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Legal Disputes */}
      <div className="space-y-2">
        <Label htmlFor="legalDisputes">Legal Disputes (Last 6 Months)</Label>
        <Input
          id="legalDisputes"
          type="number"
          min="0"
          value={legalDisputes}
          onChange={(e) => setLegalDisputes(e.target.value)}
          placeholder="Number of disputes"
          disabled={shouldDisableField(legalDisputes)}
        />
      </div>

      {/* Legal Dispute Score */}
      <div className="space-y-2">
        <Label htmlFor="legalDisputeScore">Legal Dispute Score</Label>
        <Input
          id="legalDisputeScore"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={legalDisputeScore}
          onChange={(e) => setLegalDisputeScore(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(legalDisputeScore)}
        />
      </div>

      {/* Government Sanctions */}
      <div className="space-y-2">
        <Label htmlFor="govtSanctions">Government Sanctions</Label>
        <Input
          id="govtSanctions"
          type="number"
          min="0"
          value={govtSanctions}
          onChange={(e) => setGovtSanctions(e.target.value)}
          placeholder="Number of sanctions"
          disabled={shouldDisableField(govtSanctions)}
        />
      </div>

      {/* Sanction Score */}
      <div className="space-y-2">
        <Label htmlFor="sanctionScore">Sanction Score</Label>
        <Input
          id="sanctionScore"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={sanctionScore}
          onChange={(e) => setSanctionScore(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(sanctionScore)}
        />
      </div>

      {/* Compliance Risk Score */}
      <div className="space-y-2">
        <Label htmlFor="complianceRiskScore">Compliance Risk Score</Label>
        <Input
          id="complianceRiskScore"
          type="number"
          min="0"
          max="100"
          value={complianceRiskScore}
          onChange={(e) => setComplianceRiskScore(e.target.value)}
          placeholder="0-100 score"
          disabled = {shouldDisableField(complianceRiskScore) }
        />
      </div>

      {/* Compliance Legal Risk */}
      <div className="space-y-2">
        <Label htmlFor="complianceLegalRisk">Compliance Legal Risk</Label>
        <Input
          id="complianceLegalRisk"
          type="number"
          min="0"
          max="1"
          step="0.001"
          value={complianceLegalRisk}
          onChange={(e) => setComplianceLegalRisk(e.target.value)}
          placeholder="0-1 scale"
          disabled = {shouldDisableField(complianceLegalRisk)}
        />
      </div>
    </div>
  );
}