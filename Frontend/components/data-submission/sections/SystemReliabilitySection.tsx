"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

<<<<<<< HEAD
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
=======
export function SystemReliabilitySection({
  uptimePercentage,
  setUptimePercentage,
  meanTimeBetweenFailures,
  setMeanTimeBetweenFailures,
  meanTimeToRepair,
  setMeanTimeToRepair,
  criticalFailureRate,
  setCriticalFailureRate
}: {
  uptimePercentage: string
  setUptimePercentage: (value: string) => void
  meanTimeBetweenFailures: string
  setMeanTimeBetweenFailures: (value: string) => void
  meanTimeToRepair: string
  setMeanTimeToRepair: (value: string) => void
  criticalFailureRate: string
  setCriticalFailureRate: (value: string) => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Uptime Percentage */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="uptime">System Uptime (%)</Label>
>>>>>>> supplier
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent>
<<<<<<< HEAD
                <p>Standardized score based on ISO certification level (0-1 scale)</p>
=======
                <p>Percentage of time systems are operational</p>
>>>>>>> supplier
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
<<<<<<< HEAD
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
=======
          id="uptime"
          type="number"
          min="0"
          max="100"
          value={uptimePercentage}
          onChange={(e) => setUptimePercentage(e.target.value)}
          placeholder="Enter uptime percentage"
        />
      </div>

      {/* MTBF */}
      <div className="space-y-2">
        <Label htmlFor="mtbf">Mean Time Between Failures (hours)</Label>
        <Input
          id="mtbf"
          type="number"
          value={meanTimeBetweenFailures}
          onChange={(e) => setMeanTimeBetweenFailures(e.target.value)}
          placeholder="Enter MTBF"
        />
      </div>

      {/* MTTR */}
      <div className="space-y-2">
        <Label htmlFor="mttr">Mean Time To Repair (hours)</Label>
        <Input
          id="mttr"
          type="number"
          value={meanTimeToRepair}
          onChange={(e) => setMeanTimeToRepair(e.target.value)}
          placeholder="Enter MTTR"
        />
      </div>

      {/* Critical Failure Rate */}
      <div className="space-y-2">
        <Label htmlFor="failureRate">Critical Failure Rate (%)</Label>
        <Input
          id="failureRate"
          type="number"
          min="0"
          max="100"
          value={criticalFailureRate}
          onChange={(e) => setCriticalFailureRate(e.target.value)}
          placeholder="Enter failure rate"
>>>>>>> supplier
        />
      </div>
    </div>
  );
}