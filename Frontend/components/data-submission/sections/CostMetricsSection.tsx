"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const shouldDisableField = (fieldValue: string) => {
  return !fieldValue;
};

export function CostMetricsSection({
  unitPriceBenchmarking,
  setUnitPriceBenchmarking,
  volumeDiscountPotential,
  setVolumeDiscountPotential,
  paymentTermsFlexibility,
  setPaymentTermsFlexibility,
  contractValue,
  setContractValue
}: {
  unitPriceBenchmarking: string;
  setUnitPriceBenchmarking: (value: string) => void;
  volumeDiscountPotential: string;
  setVolumeDiscountPotential: (value: string) => void;
  paymentTermsFlexibility: string;
  setPaymentTermsFlexibility: (value: string) => void;
  contractValue: string;
  setContractValue: (value: string) => void;
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

                <p>Comparison to market average (0-1 scale)</p>

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

          placeholder="0-1 scale"
          disabled={shouldDisableField(unitPriceBenchmarking)}

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

          placeholder="0-1 scale"
          disabled={shouldDisableField(volumeDiscountPotential)}
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
          placeholder="0-1 scale"
          disabled={shouldDisableField(paymentTermsFlexibility)}
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
    </div>
  );
}
