"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const shouldDisableField = (fieldValue: string) => {
  return !fieldValue;
};

export function OperationalRiskSection({
  firstPassYield, setFirstPassYield,
  fpyNormalized, setFpyNormalized,
  onTimeDeliveryRate, setOnTimeDeliveryRate,
  oldOnTimeDeliveryRate, setOldOnTimeDeliveryRate,
  onTimeDeliveryNorm, setOnTimeDeliveryNorm,
  strikeDays, setStrikeDays,
  strikeIntensityNorm, setStrikeIntensityNorm,
  operationalRiskScore, setOperationalRiskScore,
  operationalRisk, setOperationalRisk
}: {
  firstPassYield: string; setFirstPassYield: (value: string) => void;
  fpyNormalized: string; setFpyNormalized: (value: string) => void;
  onTimeDeliveryRate: string; setOnTimeDeliveryRate: (value: string) => void;
  oldOnTimeDeliveryRate: string; setOldOnTimeDeliveryRate: (value: string) => void;
  onTimeDeliveryNorm: string; setOnTimeDeliveryNorm: (value: string) => void;
  strikeDays: string; setStrikeDays: (value: string) => void;
  strikeIntensityNorm: string; setStrikeIntensityNorm: (value: string) => void;
  operationalRiskScore: string; setOperationalRiskScore: (value: string) => void;
  operationalRisk: string; setOperationalRisk: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* First Pass Yield */}
      <div className="space-y-2">
        <Label htmlFor="firstPassYield">First Pass Yield (%)</Label>
        <Input
          id="firstPassYield"
          type="number"
          min="0"
          max="100"
          value={firstPassYield}
          onChange={(e) => setFirstPassYield(e.target.value)}
          placeholder="Enter percentage"
          disabled={shouldDisableField(firstPassYield)}
        />
      </div>

      {/* FPY Normalized */}
      <div className="space-y-2">
        <Label htmlFor="fpyNormalized">FPY Normalized</Label>
        <Input
          id="fpyNormalized"
          type="number"
          min="0"
          max="1"
          step="0.001"
          value={fpyNormalized}
          onChange={(e) => setFpyNormalized(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(fpyNormalized)}
        />
      </div>

      {/* On-Time Delivery Rate */}
      <div className="space-y-2">
        <Label htmlFor="onTimeDeliveryRate">On-Time Delivery Rate (%)</Label>
        <Input
          id="onTimeDeliveryRate"
          type="number"
          min="0"
          max="100"
          value={onTimeDeliveryRate}
          onChange={(e) => setOnTimeDeliveryRate(e.target.value)}
          placeholder="Current rate"
          disabled={shouldDisableField(onTimeDeliveryRate)}
        />
      </div>

      {/* Old On-Time Delivery Rate */}
      <div className="space-y-2">
        <Label htmlFor="oldOnTimeDeliveryRate">Previous On-Time Rate</Label>
        <Input
          id="oldOnTimeDeliveryRate"
          type="number"
          min="0"
          max="1"
          step="0.001"
          value={oldOnTimeDeliveryRate}
          onChange={(e) => setOldOnTimeDeliveryRate(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(oldOnTimeDeliveryRate)}
        />
      </div>

      {/* On-Time Delivery Norm */}
      <div className="space-y-2">
        <Label htmlFor="onTimeDeliveryNorm">On-Time Delivery Norm</Label>
        <Input
          id="onTimeDeliveryNorm"
          type="number"
          min="0"
          max="1"
          step="0.001"
          value={onTimeDeliveryNorm}
          onChange={(e) => setOnTimeDeliveryNorm(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(onTimeDeliveryNorm)}
        />
      </div>

      {/* Strike Days */}
      <div className="space-y-2">
        <Label htmlFor="strikeDays">Strike Days (Last 6 Months)</Label>
        <Input
          id="strikeDays"
          type="number"
          min="0"
          value={strikeDays}
          onChange={(e) => setStrikeDays(e.target.value)}
          placeholder="Number of days"
          disabled={shouldDisableField(strikeDays)}
        />
      </div>

      {/* Strike Intensity Norm */}
      <div className="space-y-2">
        <Label htmlFor="strikeIntensityNorm">Strike Intensity Norm</Label>
        <Input
          id="strikeIntensityNorm"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={strikeIntensityNorm}
          onChange={(e) => setStrikeIntensityNorm(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(strikeIntensityNorm)}
        />
      </div>

      {/* Operational Risk Score */}
      <div className="space-y-2">
        <Label htmlFor="operationalRiskScore">Operational Risk Score</Label>
        <Input
          id="operationalRiskScore"
          type="number"
          min="0"
          max="100"
          value={operationalRiskScore}
          onChange={(e) => setOperationalRiskScore(e.target.value)}
          placeholder="0-100 score"
          disabled = {shouldDisableField(operationalRiskScore)}
        />
      </div>

      {/* Operational Risk */}
      <div className="space-y-2">
        <Label htmlFor="operationalRisk">Operational Risk</Label>
        <Input
          id="operationalRisk"
          type="number"
          min="0"
          max="1"
          step="0.001"
          value={operationalRisk}
          onChange={(e) => setOperationalRisk(e.target.value)}
          placeholder="0-1 scale"
          disabled = {shouldDisableField(operationalRisk)}
        />
      </div>
    </div>
  );
}