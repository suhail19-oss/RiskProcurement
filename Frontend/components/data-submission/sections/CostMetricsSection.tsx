<<<<<<< HEAD
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
=======
"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function CostMetricsSection({
  productionCostPerUnit,
  setProductionCostPerUnit,
  logisticsCostPerUnit,
  setLogisticsCostPerUnit,
  overheadCostPercentage,
  setOverheadCostPercentage,
  employeeCostPercentage,
  setEmployeeCostPercentage
}: {
  productionCostPerUnit: string
  setProductionCostPerUnit: (value: string) => void
  logisticsCostPerUnit: string
  setLogisticsCostPerUnit: (value: string) => void
  overheadCostPercentage: string
  setOverheadCostPercentage: (value: string) => void
  employeeCostPercentage: string
  setEmployeeCostPercentage: (value: string) => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Production Cost */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="productionCost">Production Cost/Unit (USD)</Label>
>>>>>>> supplier
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent>
<<<<<<< HEAD

                <p>Comparison to market average (0-1 scale)</p>

=======
                <p>Total production cost divided by units produced</p>
>>>>>>> supplier
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
<<<<<<< HEAD
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
=======
          id="productionCost"
          type="number"
          value={productionCostPerUnit}
          onChange={(e) => setProductionCostPerUnit(e.target.value)}
          placeholder="Enter cost per unit"
        />
      </div>

      {/* Logistics Cost */}
      <div className="space-y-2">
        <Label htmlFor="logisticsCost">Logistics Cost/Unit (USD)</Label>
        <Input
          id="logisticsCost"
          type="number"
          value={logisticsCostPerUnit}
          onChange={(e) => setLogisticsCostPerUnit(e.target.value)}
          placeholder="Enter cost per unit"
        />
      </div>

      {/* Overhead Cost */}
      <div className="space-y-2">
        <Label htmlFor="overheadCost">Overhead Cost (%)</Label>
        <Input
          id="overheadCost"
          type="number"
          min="0"
          max="100"
          value={overheadCostPercentage}
          onChange={(e) => setOverheadCostPercentage(e.target.value)}
          placeholder="Enter percentage"
        />
      </div>

      {/* Employee Cost */}
      <div className="space-y-2">
        <Label htmlFor="employeeCost">Employee Cost (%)</Label>
        <Input
          id="employeeCost"
          type="number"
          min="0"
          max="100"
          value={employeeCostPercentage}
          onChange={(e) => setEmployeeCostPercentage(e.target.value)}
          placeholder="Enter percentage"
>>>>>>> supplier
        />
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> supplier
