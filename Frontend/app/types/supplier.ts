export interface Supplier {
  id: string;
  name: string;
  category: string;
  riskLevel: "low" | "medium" | "high";
  lastAssessment: string;
  complianceScore: number;
  location: string;
  contractValue: number;
  geminiRaw?: string;
}

export interface RiskViolation {
  id: string;
  supplierId: string;
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  detectedDate: string;
  status: "open" | "investigating" | "resolved";
  source: string;
}

export interface SuggestedAction {
  id: string;
  supplierId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  estimatedImpact: string;
  recommendedBy: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected" | "completed";
  lastAssessedAt?: string;
  violation?: string;
  geminiRaw?: string;
}