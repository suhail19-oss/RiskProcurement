"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EfficiencyMetricsSection({
  fpyNormalized,
  setFpyNormalized,
  inTransitDelaysDays,
  setInTransitDelaysDays,
  recallScoreOutOf100,
  setRecallScoreOutOf100,
  legalDisputesLast6Months,
  setLegalDisputesLast6Months,
  legalDisputeScore,
  setLegalDisputeScore,
  laborViolationRisk,
  setLaborViolationRisk,
  warZoneFlag,
  setWarZoneFlag,
  laborViolations,
  setLaborViolations
}: {
  fpyNormalized: string;
  setFpyNormalized: (value: string) => void;
  inTransitDelaysDays: string;
  setInTransitDelaysDays: (value: string) => void;
  recallScoreOutOf100: string;
  setRecallScoreOutOf100: (value: string) => void;
  legalDisputesLast6Months: string;
  setLegalDisputesLast6Months: (value: string) => void;
  legalDisputeScore: string;
  setLegalDisputeScore: (value: string) => void;
  laborViolationRisk: string;
  setLaborViolationRisk: (value: string) => void;
  warZoneFlag: string;
  setWarZoneFlag: (value: string) => void;
  laborViolations: string;
  setLaborViolations: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* FPY Normalized */}
      <div className="space-y-2">
        <Label htmlFor="fpyNormalized">First Pass Yield (Normalized, 0-1)</Label>
        <Input
          id="fpyNormalized"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={fpyNormalized}
          onChange={(e) => setFpyNormalized(e.target.value)}
          placeholder="e.g., 0.93"
        />
      </div>

      {/* In Transit Delays */}
      <div className="space-y-2">
        <Label htmlFor="inTransitDelaysDays">In-Transit Delays (Days)</Label>
        <Input
          id="inTransitDelaysDays"
          type="number"
          min="0"
          value={inTransitDelaysDays}
          onChange={(e) => setInTransitDelaysDays(e.target.value)}
          placeholder="e.g., 0.05"
        />
      </div>

      {/* Recall Score */}
      <div className="space-y-2">
        <Label htmlFor="recallScoreOutOf100">Recall Score (Out of 100)</Label>
        <Input
          id="recallScoreOutOf100"
          type="number"
          min="0"
          max="100"
          value={recallScoreOutOf100}
          onChange={(e) => setRecallScoreOutOf100(e.target.value)}
          placeholder="e.g., 8"
        />
      </div>

      {/* Legal Disputes Count */}
      <div className="space-y-2">
        <Label htmlFor="legalDisputesLast6Months">Legal Disputes (Last 6 Months)</Label>
        <Input
          id="legalDisputesLast6Months"
          type="number"
          min="0"
          value={legalDisputesLast6Months}
          onChange={(e) => setLegalDisputesLast6Months(e.target.value)}
          placeholder="e.g., 3"
        />
      </div>

      {/* Legal Dispute Score */}
      <div className="space-y-2">
        <Label htmlFor="legalDisputeScore">Legal Dispute Score (0-1)</Label>
        <Input
          id="legalDisputeScore"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={legalDisputeScore}
          onChange={(e) => setLegalDisputeScore(e.target.value)}
          placeholder="e.g., 0.10"
        />
      </div>

      {/* Labor Violation Risk */}
      <div className="space-y-2">
        <Label htmlFor="laborViolationRisk">Labor Violation Risk (0-1)</Label>
        <Input
          id="laborViolationRisk"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={laborViolationRisk}
          onChange={(e) => setLaborViolationRisk(e.target.value)}
          placeholder="e.g., 0.12"
        />
      </div>

      {/* War Zone Flag */}
      <div className="space-y-2">
        <Label htmlFor="warZoneFlag">War Zone Flag (0/1)</Label>
        <Input
          id="warZoneFlag"
          type="number"
          min="0"
          max="1"
          value={warZoneFlag}
          onChange={(e) => setWarZoneFlag(e.target.value)}
          placeholder="0 or 1"
        />
      </div>

      {/* Labor Violations Description */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="laborViolations">Labor Violations</Label>
        <Input
          id="laborViolations"
          type="text"
          value={laborViolations}
          onChange={(e) => setLaborViolations(e.target.value)}
          placeholder="e.g., None, Minor, Major"
        />
      </div>
    </div>
  );
}
