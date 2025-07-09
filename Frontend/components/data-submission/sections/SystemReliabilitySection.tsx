"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const shouldDisableField = (fieldValue: string) => {
  return !fieldValue;
};

export function SystemReliabilitySection({
  isoCertificationScore,
  setIsoCertificationScore,
  infrastructureDisruptionSeverity,
  setInfrastructureDisruptionSeverity,
  averageLeadTimeDays,
  setAverageLeadTimeDays
}: {
  isoCertificationScore: string
  setIsoCertificationScore: (value: string) => void
  infrastructureDisruptionSeverity: string
  setInfrastructureDisruptionSeverity: (value: string) => void
  averageLeadTimeDays: string
  setAverageLeadTimeDays: (value: string) => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ISO Certification Score */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="iso-certification">ISO Certification Score</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent>
                <p>Standardized score based on ISO certification level (0-1 scale)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="iso-certification"
          type="number"
          min="0"
          max="1"
          step="0.001"
          value={isoCertificationScore}
          onChange={(e) => setIsoCertificationScore(e.target.value)}
          placeholder="0.000 - 1.000"
          disabled={shouldDisableField(isoCertificationScore)}
        />
      </div>

      {/* Infrastructure Disruption Severity */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="disruption-severity">Infrastructure Disruption Severity</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent>
                <p>Severity score of infrastructure disruptions (0-1 scale)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="disruption-severity"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={infrastructureDisruptionSeverity}
          onChange={(e) => setInfrastructureDisruptionSeverity(e.target.value)}
          placeholder="0.00 - 1.00"
          disabled={shouldDisableField(infrastructureDisruptionSeverity)}
        />
      </div>

      {/* Average Lead Time Days */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="lead-time">Average Lead Time (days)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent>
                <p>Average time from order to delivery in days</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="lead-time"
          type="number"
          min="0"
          value={averageLeadTimeDays}
          onChange={(e) => setAverageLeadTimeDays(e.target.value)}
          placeholder="Enter average lead time"
          disabled={shouldDisableField(averageLeadTimeDays)}
        />
      </div>
    </div>
  );
}