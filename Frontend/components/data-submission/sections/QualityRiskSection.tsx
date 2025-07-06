"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const shouldDisableField = (fieldValue: string) => {
  return !fieldValue;
};

export function QualityRiskSection({
  productDefectRate, setProductDefectRate,
  productDefectRateNorm, setProductDefectRateNorm,
  newReturnRate, setNewReturnRate,
  recallIncidents, setRecallIncidents,
  recallScore, setRecallScore,
  qualityRiskScore, setQualityRiskScore,
  totalUnitsSold, setTotalUnitsSold
}: {
  productDefectRate: string; setProductDefectRate: (value: string) => void;
  productDefectRateNorm: string; setProductDefectRateNorm: (value: string) => void;
  newReturnRate: string; setNewReturnRate: (value: string) => void;
  recallIncidents: string; setRecallIncidents: (value: string) => void;
  recallScore: string; setRecallScore: (value: string) => void;
  qualityRiskScore: string; setQualityRiskScore: (value: string) => void;
  totalUnitsSold: string; setTotalUnitsSold: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Product Defect Rate */}
      <div className="space-y-2">
        <Label htmlFor="productDefectRate">Product Defect Rate (%)</Label>
        <Input
          id="productDefectRate"
          type="number"
          min="0"
          max="100"
          step="0.001"
          value={productDefectRate}
          onChange={(e) => setProductDefectRate(e.target.value)}
          placeholder="Percentage"
          disabled={shouldDisableField(productDefectRate)}
        />
      </div>

      {/* Product Defect Rate Norm */}
      <div className="space-y-2">
        <Label htmlFor="productDefectRateNorm">Defect Rate Norm</Label>
        <Input
          id="productDefectRateNorm"
          type="number"
          min="0"
          max="1"
          step="0.001"
          value={productDefectRateNorm}
          onChange={(e) => setProductDefectRateNorm(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(productDefectRateNorm)}
        />
      </div>

      {/* New Return Rate */}
      <div className="space-y-2">
        <Label htmlFor="newReturnRate">New Return Rate</Label>
        <Input
          id="newReturnRate"
          type="number"
          min="0"
          max="1"
          step="0.001"
          value={newReturnRate}
          onChange={(e) => setNewReturnRate(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(newReturnRate)}
        />
      </div>

      {/* Recall Incidents */}
      <div className="space-y-2">
        <Label htmlFor="recallIncidents">Recall Incidents</Label>
        <Input
          id="recallIncidents"
          type="number"
          min="0"
          value={recallIncidents}
          onChange={(e) => setRecallIncidents(e.target.value)}
          placeholder="Number of recalls"
          disabled={shouldDisableField(recallIncidents)}
        />
      </div>

      {/* Recall Score */}
      <div className="space-y-2">
        <Label htmlFor="recallScore">Recall Score (Out of 100)</Label>
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

      {/* Total Units Sold */}
      <div className="space-y-2">
        <Label htmlFor="totalUnitsSold">Total Units Sold</Label>
        <Input
          id="totalUnitsSold"
          type="number"
          min="0"
          value={totalUnitsSold}
          onChange={(e) => setTotalUnitsSold(e.target.value)}
          placeholder="Total units"
          disabled={shouldDisableField(totalUnitsSold)}
        />
      </div>

      {/* Quality Risk Score */}
      <div className="space-y-2">
        <Label htmlFor="qualityRiskScore">Quality Risk Score</Label>
        <Input
          id="qualityRiskScore"
          type="number"
          min="0"
          max="100"
          value={qualityRiskScore}
          onChange={(e) => setQualityRiskScore(e.target.value)}
          placeholder="0-100 score"
          disabled = {shouldDisableField(qualityRiskScore)}
        />
      </div>
    </div>
  );
}