"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const shouldDisableField = (fieldValue: string) => {
  return !fieldValue;
};

export function ComplianceMetricsSection({
  legalDisputes,
  setLegalDisputes,
  legalDisputeScore,
  setLegalDisputeScore,
  warZoneFlag,
  setWarZoneFlag,
  warZoneNorm,
  setWarZoneNorm,
  tradePolicyChanges,
  setTradePolicyChanges,
  tradePolicyNorm,
  setTradePolicyNorm,
  laborViolations,
  setLaborViolations,
  laborViolationRisk,
  setLaborViolationRisk,
  recallScore,
  setRecallScore,
  govtSanctions,
  setGovtSanctions,
  sanctionScore,
  setSanctionScore
}: {
  legalDisputes: string;
  setLegalDisputes: (value: string) => void;
  legalDisputeScore: string;
  setLegalDisputeScore: (value: string) => void;
  warZoneFlag: string;
  setWarZoneFlag: (value: string) => void;
  warZoneNorm: string;
  setWarZoneNorm: (value: string) => void;
  tradePolicyChanges: string;
  setTradePolicyChanges: (value: string) => void;
  tradePolicyNorm: string;
  setTradePolicyNorm: (value: string) => void;
  laborViolations: string;
  setLaborViolations: (value: string) => void;
  laborViolationRisk: string;
  setLaborViolationRisk: (value: string) => void;
  recallScore: string;
  setRecallScore: (value: string) => void;
  govtSanctions: string;
  setGovtSanctions: (value: string) => void;
  sanctionScore: string;
  setSanctionScore: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Legal Disputes */}
      <div className="space-y-2">
        <Label htmlFor="legalDisputes">Legal Disputes</Label>
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

      {/* War Zone Flag */}
      <div className="space-y-2">
        <Label htmlFor="warZoneFlag">War Zone Flag</Label>
        <Select 
          value={warZoneFlag} 
          onValueChange={setWarZoneFlag}
          disabled={shouldDisableField(warZoneFlag)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">No</SelectItem>
            <SelectItem value="1">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* War Zone Norm */}
      <div className="space-y-2">
        <Label htmlFor="warZoneNorm">War Zone Norm</Label>
        <Input
          id="warZoneNorm"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={warZoneNorm}
          onChange={(e) => setWarZoneNorm(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(warZoneNorm)}
        />
      </div>

      {/* Trade Policy Changes */}
      <div className="space-y-2">
        <Label htmlFor="tradePolicyChanges">Trade Policy Changes</Label>
        <Select 
          value={tradePolicyChanges} 
          onValueChange={setTradePolicyChanges}
          disabled={shouldDisableField(tradePolicyChanges)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select impact" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">None</SelectItem>
            <SelectItem value="Minor">Minor</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="Major">Major</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trade Policy Norm */}
      <div className="space-y-2">
        <Label htmlFor="tradePolicyNorm">Trade Policy Norm</Label>
        <Input
          id="tradePolicyNorm"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={tradePolicyNorm}
          onChange={(e) => setTradePolicyNorm(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(tradePolicyNorm)}
        />
      </div>

      {/* Labor Violations */}
      <div className="space-y-2">
        <Label htmlFor="laborViolations">Labor Violations</Label>
        <Select 
          value={laborViolations} 
          onValueChange={setLaborViolations}
          disabled={shouldDisableField(laborViolations)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">None</SelectItem>
            <SelectItem value="Minor">Minor</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="Major">Major</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Labor Violation Risk */}
      <div className="space-y-2">
        <Label htmlFor="laborViolationRisk">Labor Violation Risk</Label>
        <Input
          id="laborViolationRisk"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={laborViolationRisk}
          onChange={(e) => setLaborViolationRisk(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(laborViolationRisk)}
        />
      </div>

      {/* Recall Score */}
      <div className="space-y-2">
        <Label htmlFor="recallScore">Recall Score</Label>
        <Input
          id="recallScore"
          type="number"
          min="0"
          max="100"
          value={recallScore}
          onChange={(e) => setRecallScore(e.target.value)}
          placeholder="0-100 score"
          disabled={shouldDisableField(recallScore)}
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
    </div>
  );
}