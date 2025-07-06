"use client";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const shouldDisableField = (fieldValue: string) => {
  return !fieldValue;
};

export function EfficiencyMetricsSection({
  inTransitDelayDays,
  setInTransitDelayDays,
  inTransitDelayFactor,
  setInTransitDelayFactor,
  normalizedInTransitDelayFactor,
  setNormalizedInTransitDelayFactor,
  firstPassYield,
  setFirstPassYield
}: {
  inTransitDelayDays: string;
  setInTransitDelayDays: (value: string) => void;
  inTransitDelayFactor: string;
  setInTransitDelayFactor: (value: string) => void;
  normalizedInTransitDelayFactor: string;
  setNormalizedInTransitDelayFactor: (value: string) => void;
  firstPassYield: string;
  setFirstPassYield: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* In-Transit Delay Days */}
      <div className="space-y-2">
        <Label htmlFor="inTransitDelayDays">In-Transit Delay Days</Label>
        <Input
          id="inTransitDelayDays"
          type="number"
          min="0"
          value={inTransitDelayDays}
          onChange={(e) => setInTransitDelayDays(e.target.value)}
          placeholder="Number of days"
          disabled={shouldDisableField(inTransitDelayDays)}
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

      {/* Normalized In-Transit Delay Factor */}
      <div className="space-y-2">
        <Label htmlFor="normalizedInTransitDelayFactor">Normalized Delay Factor</Label>
        <Input
          id="normalizedInTransitDelayFactor"
          type="number"
          min="0"
          max="1"
          step="0.001"
          value={normalizedInTransitDelayFactor}
          onChange={(e) => setNormalizedInTransitDelayFactor(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(normalizedInTransitDelayFactor)}
        />
      </div>

      {/* First Pass Yield */}
      <div className="space-y-2">
        <Label htmlFor="firstPassYield">First Pass Yield</Label>
        <Input
          id="firstPassYield"
          type="number"
          min="0"
          max="1"
          step="0.001"
          value={firstPassYield}
          onChange={(e) => setFirstPassYield(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(firstPassYield)}
        />
      </div>
    </div>
  );
}
