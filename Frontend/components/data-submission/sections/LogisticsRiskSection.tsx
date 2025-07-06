"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const shouldDisableField = (fieldValue: string) => {
  return !fieldValue;
};

export function LogisticsRiskSection({
  inTransitDelays, setInTransitDelays,
  inTransitDelayFactor, setInTransitDelayFactor,
  inTransitDelayFactorNorm, setInTransitDelayFactorNorm,
  infrastructureDisruption, setInfrastructureDisruption,
  logisticsRiskScore, setLogisticsRiskScore,
  isoCertificationScore, setIsoCertificationScore,
  contractValue, setContractValue
}: {
  inTransitDelays: string; setInTransitDelays: (value: string) => void;
  inTransitDelayFactor: string; setInTransitDelayFactor: (value: string) => void;
  inTransitDelayFactorNorm: string; setInTransitDelayFactorNorm: (value: string) => void;
  infrastructureDisruption: string; setInfrastructureDisruption: (value: string) => void;
  logisticsRiskScore: string; setLogisticsRiskScore: (value: string) => void;
  isoCertificationScore: string; setIsoCertificationScore: (value: string) => void;
  contractValue: string; setContractValue: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* In-Transit Delays */}
      <div className="space-y-2">
        <Label htmlFor="inTransitDelays">In-Transit Delays (Days)</Label>
        <Input
          id="inTransitDelays"
          type="number"
          min="0"
          value={inTransitDelays}
          onChange={(e) => setInTransitDelays(e.target.value)}
          placeholder="Number of days"
          disabled={shouldDisableField(inTransitDelays)}
        />
      </div>

      {/* In-Transit Delay Factor */}
      <div className="space-y-2">
        <Label htmlFor="inTransitDelayFactor">In-Transit Delay Factor</Label>
        <Input
          id="inTransitDelayFactor"
          type="number"
          min="0"
          max="1"
          step="0.001"
          value={inTransitDelayFactor}
          onChange={(e) => setInTransitDelayFactor(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(inTransitDelayFactor)}
        />
      </div>

      {/* In-Transit Delay Factor Norm */}
      <div className="space-y-2">
        <Label htmlFor="inTransitDelayFactorNorm">Delay Factor Norm</Label>
        <Input
          id="inTransitDelayFactorNorm"
          type="number"
          min="0"
          max="1"
          step="0.001"
          value={inTransitDelayFactorNorm}
          onChange={(e) => setInTransitDelayFactorNorm(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(inTransitDelayFactorNorm)}
        />
      </div>

      {/* Infrastructure Disruption */}
      <div className="space-y-2">
        <Label htmlFor="infrastructureDisruption">Infrastructure Disruption</Label>
        <Input
          id="infrastructureDisruption"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={infrastructureDisruption}
          onChange={(e) => setInfrastructureDisruption(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(infrastructureDisruption)}
        />
      </div>

      {/* ISO Certification Score */}
      <div className="space-y-2">
        <Label htmlFor="isoCertificationScore">ISO Certification Score</Label>
        <Input
          id="isoCertificationScore"
          type="number"
          min="0"
          max="1"
          step="0.001"
          value={isoCertificationScore}
          onChange={(e) => setIsoCertificationScore(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(isoCertificationScore)}
        />
      </div>

      {/* Contract Value */}
      <div className="space-y-2">
        <Label htmlFor="contractValue">Contract Value</Label>
        <Input
          id="contractValue"
          type="number"
          min="0"
          value={contractValue}
          onChange={(e) => setContractValue(e.target.value)}
          placeholder="Value in USD"
          disabled={shouldDisableField(contractValue)}
        />
      </div>

      {/* Logistics Risk Score */}
      <div className="space-y-2">
        <Label htmlFor="logisticsRiskScore">Logistics Risk Score</Label>
        <Input
          id="logisticsRiskScore"
          type="number"
          min="0"
          max="100"
          value={logisticsRiskScore}
          onChange={(e) => setLogisticsRiskScore(e.target.value)}
          placeholder="0-100 score"
          disabled = {shouldDisableField(logisticsRiskScore)}
        />
      </div>
    </div>
  );
}