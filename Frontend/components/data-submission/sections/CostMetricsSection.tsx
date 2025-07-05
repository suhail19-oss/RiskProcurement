"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function CostMetricsSection({
  unitPriceBenchmarking,
  setUnitPriceBenchmarking,
  volumeDiscountPotential,
  setVolumeDiscountPotential,
  paymentTermsFlexibility,
  setPaymentTermsFlexibility,
  contractValue,
  setContractValue,
  tradePolicyNorm,
  setTradePolicyNorm,
  sanctionScore,
  setSanctionScore,
  warZoneNorm,
  setWarZoneNorm,
  tradePolicyChanges,
  setTradePolicyChanges,
  govtSanctionsPenalties,
  setGovtSanctionsPenalties
}: {
  unitPriceBenchmarking: string;
  setUnitPriceBenchmarking: (value: string) => void;
  volumeDiscountPotential: string;
  setVolumeDiscountPotential: (value: string) => void;
  paymentTermsFlexibility: string;
  setPaymentTermsFlexibility: (value: string) => void;
  contractValue: string;
  setContractValue: (value: string) => void;
  tradePolicyNorm: string;
  setTradePolicyNorm: (value: string) => void;
  sanctionScore: string;
  setSanctionScore: (value: string) => void;
  warZoneNorm: string;
  setWarZoneNorm: (value: string) => void;
  tradePolicyChanges: string;
  setTradePolicyChanges: (value: string) => void;
  govtSanctionsPenalties: string;
  setGovtSanctionsPenalties: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Unit Price Benchmarking */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="unitPriceBenchmarking">Unit Price Benchmarking</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent>
                <p>Fractional benchmarked price (0-1)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="unitPriceBenchmarking"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={unitPriceBenchmarking}
          onChange={(e) => setUnitPriceBenchmarking(e.target.value)}
          placeholder="e.g., 0.78"
        />
      </div>

      {/* Volume Discount Potential */}
      <div className="space-y-2">
        <Label htmlFor="volumeDiscountPotential">Volume Discount Potential</Label>
        <Input
          id="volumeDiscountPotential"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={volumeDiscountPotential}
          onChange={(e) => setVolumeDiscountPotential(e.target.value)}
          placeholder="e.g., 0.65"
        />
      </div>

      {/* Payment Terms Flexibility */}
      <div className="space-y-2">
        <Label htmlFor="paymentTermsFlexibility">Payment Terms Flexibility</Label>
        <Input
          id="paymentTermsFlexibility"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={paymentTermsFlexibility}
          onChange={(e) => setPaymentTermsFlexibility(e.target.value)}
          placeholder="e.g., 0.70"
        />
      </div>

      {/* Contract Value */}
      <div className="space-y-2">
        <Label htmlFor="contractValue">Contract Value (USD)</Label>
        <Input
          id="contractValue"
          type="number"
          min="0"
          value={contractValue}
          onChange={(e) => setContractValue(e.target.value)}
          placeholder="e.g., 450000000"
        />
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
          placeholder="e.g., 0.20"
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
          placeholder="e.g., 0.02"
        />
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
          placeholder="e.g., 0.02"
        />
      </div>

      {/* Trade Policy Changes */}
      <div className="space-y-2">
        <Label htmlFor="tradePolicyChanges">Trade Policy Changes</Label>
        <Input
          id="tradePolicyChanges"
          type="text"
          value={tradePolicyChanges}
          onChange={(e) => setTradePolicyChanges(e.target.value)}
          placeholder="e.g., Minor, Major"
        />
      </div>

      {/* Government Sanctions Penalties */}
      <div className="space-y-2">
        <Label htmlFor="govtSanctionsPenalties">Govt Sanctions Penalties</Label>
        <Input
          id="govtSanctionsPenalties"
          type="text"
          value={govtSanctionsPenalties}
          onChange={(e) => setGovtSanctionsPenalties(e.target.value)}
          placeholder="e.g., Yes / No"
        />
      </div>
    </div>
  );
}
