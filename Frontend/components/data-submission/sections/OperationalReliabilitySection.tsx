"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const shouldDisableField = (fieldValue: string) => {
  return !fieldValue;
};

export function OperationalReliabilitySection({
  adjustedOnTimeDeliveryRate,
  setAdjustedOnTimeDeliveryRate,
  productDefectRate,
  setProductDefectRate,
  strikeDays,
  setStrikeDays,
  naturalDisasterFrequency,
  setNaturalDisasterFrequency
}: {
  adjustedOnTimeDeliveryRate: string
  setAdjustedOnTimeDeliveryRate: (value: string) => void
  productDefectRate: string
  setProductDefectRate: (value: string) => void
  strikeDays: string
  setStrikeDays: (value: string) => void
  naturalDisasterFrequency: string
  setNaturalDisasterFrequency: (value: string) => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Adjusted On-Time Delivery Rate */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="delivery-rate">Adjusted On-Time Delivery Rate (%)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent>
                <p>Percentage of orders delivered on time, adjusted for external factors</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="delivery-rate"
          type="number"
          min="0"
          max="100"
          value={adjustedOnTimeDeliveryRate}
          onChange={(e) => setAdjustedOnTimeDeliveryRate(e.target.value)}
          placeholder="0 - 100"
          disabled={shouldDisableField(adjustedOnTimeDeliveryRate)}
        />
      </div>

      {/* Product Defect Rate */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="defect-rate">Product Defect Rate</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent>
                <p>Proportion of defective products (0-1 scale)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="defect-rate"
          type="number"
          min="0"
          max="1"
          step="0.001"
          value={productDefectRate}
          onChange={(e) => setProductDefectRate(e.target.value)}
          placeholder="0.000 - 1.000"
          disabled={shouldDisableField(productDefectRate)}
        />
      </div>

      {/* Strike Days */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="strike-days">Strike Days (last year)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent>
                <p>Number of days operations were affected by labor strikes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="strike-days"
          type="number"
          min="0"
          value={strikeDays}
          onChange={(e) => setStrikeDays(e.target.value)}
          placeholder="Enter number of strike days"
          disabled={shouldDisableField(strikeDays)}
        />
      </div>

      {/* Natural Disaster Frequency */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="disaster-freq">Natural Disaster Frequency</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent>
                <p>Number of natural disasters affecting operations last year</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="disaster-freq"
          type="number"
          min="0"
          value={naturalDisasterFrequency}
          onChange={(e) => setNaturalDisasterFrequency(e.target.value)}
          placeholder="Enter frequency count"
          disabled={shouldDisableField(naturalDisasterFrequency)}
        />
      </div>
    </div>
  );
}