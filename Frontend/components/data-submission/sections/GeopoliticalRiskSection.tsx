"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const shouldDisableField = (fieldValue: string) => {
  return !fieldValue;
};

export function GeopoliticalRiskSection({
  naturalDisasterFrequency, setNaturalDisasterFrequency,
  naturalDisasterNorm, setNaturalDisasterNorm,
  tradePolicyChanges, setTradePolicyChanges,
  tradePolicyNorm, setTradePolicyNorm,
  warZoneFlag, setWarZoneFlag,
  warZoneNorm, setWarZoneNorm,
  geopoliticalRiskScore, setGeopoliticalRiskScore
}: {
  naturalDisasterFrequency: string; setNaturalDisasterFrequency: (value: string) => void;
  naturalDisasterNorm: string; setNaturalDisasterNorm: (value: string) => void;
  tradePolicyChanges: string; setTradePolicyChanges: (value: string) => void;
  tradePolicyNorm: string; setTradePolicyNorm: (value: string) => void;
  warZoneFlag: string; setWarZoneFlag: (value: string) => void;
  warZoneNorm: string; setWarZoneNorm: (value: string) => void;
  geopoliticalRiskScore: string; setGeopoliticalRiskScore: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Natural Disaster Frequency */}
      <div className="space-y-2">
        <Label htmlFor="naturalDisasterFrequency">Natural Disasters (6 Months)</Label>
        <Input
          id="naturalDisasterFrequency"
          type="number"
          min="0"
          value={naturalDisasterFrequency}
          onChange={(e) => setNaturalDisasterFrequency(e.target.value)}
          placeholder="Number of disasters"
          disabled={shouldDisableField(naturalDisasterFrequency)}
        />
      </div>

      {/* Natural Disaster Norm */}
      <div className="space-y-2">
        <Label htmlFor="naturalDisasterNorm">Natural Disaster Norm</Label>
        <Input
          id="naturalDisasterNorm"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={naturalDisasterNorm}
          onChange={(e) => setNaturalDisasterNorm(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(naturalDisasterNorm)}
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

      {/* War Zone Flag */}
      <div className="space-y-2">
        <Label htmlFor="warZoneFlag">Operating in War Zone</Label>
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

      {/* Geopolitical Risk Score */}
      <div className="space-y-2">
        <Label htmlFor="geopoliticalRiskScore">Geopolitical Risk Score</Label>
        <Input
          id="geopoliticalRiskScore"
          type="number"
          min="0"
          max="100"
          value={geopoliticalRiskScore}
          onChange={(e) => setGeopoliticalRiskScore(e.target.value)}
          placeholder="0-100 score"
          disabled = {shouldDisableField(geopoliticalRiskScore)}
        />
      </div>
    </div>
  );
}