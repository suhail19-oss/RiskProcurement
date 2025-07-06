"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const shouldDisableField = (fieldValue: string) => {
  return !fieldValue;
};

export function ESGRiskSection({
  environmentScore, setEnvironmentScore,
  socialScore, setSocialScore,
  governanceScore, setGovernanceScore,
  esgScore, setEsgScore,
  laborViolations, setLaborViolations,
  laborViolationRisk, setLaborViolationRisk,
  newsSentiment, setNewsSentiment,
  sentimentRisk, setSentimentRisk,
  esgRiskScore, setEsgRiskScore,
  esgRisk, setEsgRisk
}: {
  environmentScore: string; setEnvironmentScore: (value: string) => void;
  socialScore: string; setSocialScore: (value: string) => void;
  governanceScore: string; setGovernanceScore: (value: string) => void;
  esgScore: string; setEsgScore: (value: string) => void;
  laborViolations: string; setLaborViolations: (value: string) => void;
  laborViolationRisk: string; setLaborViolationRisk: (value: string) => void;
  newsSentiment: string; setNewsSentiment: (value: string) => void;
  sentimentRisk: string; setSentimentRisk: (value: string) => void;
  esgRiskScore: string; setEsgRiskScore: (value: string) => void;
  esgRisk: string; setEsgRisk: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Environment Score */}
      <div className="space-y-2">
        <Label htmlFor="environmentScore">Environment Score</Label>
        <Input
          id="environmentScore"
          type="number"
          min="0"
          max="100"
          value={environmentScore}
          onChange={(e) => setEnvironmentScore(e.target.value)}
          placeholder="0-100 score"
          disabled={shouldDisableField(environmentScore)}
        />
      </div>

      {/* Social Score */}
      <div className="space-y-2">
        <Label htmlFor="socialScore">Social Score</Label>
        <Input
          id="socialScore"
          type="number"
          min="0"
          max="100"
          value={socialScore}
          onChange={(e) => setSocialScore(e.target.value)}
          placeholder="0-100 score"
          disabled={shouldDisableField(socialScore)}
        />
      </div>

      {/* Governance Score */}
      <div className="space-y-2">
        <Label htmlFor="governanceScore">Governance Score</Label>
        <Input
          id="governanceScore"
          type="number"
          min="0"
          max="100"
          value={governanceScore}
          onChange={(e) => setGovernanceScore(e.target.value)}
          placeholder="0-100 score"
          disabled={shouldDisableField(governanceScore)}
        />
      </div>

      {/* ESG Score */}
      <div className="space-y-2">
        <Label htmlFor="esgScore">ESG Score</Label>
        <Input
          id="esgScore"
          type="number"
          min="0"
          max="100"
          value={esgScore}
          onChange={(e) => setEsgScore(e.target.value)}
          placeholder="0-100 score"
          disabled={shouldDisableField(esgScore)}
        />
      </div>

      {/* Labor Violations */}
      <div className="space-y-2">
        <Label htmlFor="laborViolations">Labor Violations (6 Months)</Label>
        <Select 
          value={laborViolations} 
          onValueChange={setLaborViolations}
          disabled={shouldDisableField(laborViolations)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">None</SelectItem>
            <SelectItem value="Minor">Minor</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="Major">Major</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Labor Violation Risk */}
      <div className="space-y-2">
        <Label htmlFor="laborViolationRisk">Labor Violation Risk</Label>
        <Input
          id="laborViolationRisk"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={laborViolationRisk}
          onChange={(e) => setLaborViolationRisk(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(laborViolationRisk)}
        />
      </div>

      {/* News Sentiment */}
      <div className="space-y-2">
        <Label htmlFor="newsSentiment">News Sentiment Score</Label>
        <Input
          id="newsSentiment"
          type="number"
          min="-1"
          max="1"
          step="0.01"
          value={newsSentiment}
          onChange={(e) => setNewsSentiment(e.target.value)}
          placeholder="-1 to 1 scale"
          disabled={shouldDisableField(newsSentiment)}
        />
      </div>

      {/* Sentiment Risk */}
      <div className="space-y-2">
        <Label htmlFor="sentimentRisk">Sentiment Risk</Label>
        <Input
          id="sentimentRisk"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={sentimentRisk}
          onChange={(e) => setSentimentRisk(e.target.value)}
          placeholder="0-1 scale"
          disabled={shouldDisableField(sentimentRisk)}
        />
      </div>

      {/* ESG Risk Score */}
      <div className="space-y-2">
        <Label htmlFor="esgRiskScore">ESG Risk Score</Label>
        <Input
          id="esgRiskScore"
          type="number"
          min="0"
          max="100"
          value={esgRiskScore}
          onChange={(e) => setEsgRiskScore(e.target.value)}
          placeholder="0-100 score"
          disabled = {shouldDisableField(esgRiskScore)}
        />
      </div>

      {/* ESG Risk */}
      <div className="space-y-2">
        <Label htmlFor="esgRisk">ESG Risk</Label>
        <Input
          id="esgRisk"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={esgRisk}
          onChange={(e) => setEsgRisk(e.target.value)}
          placeholder="0-1 scale"
          disabled = {shouldDisableField(esgRisk) }
        />
      </div>
    </div>
  );
}