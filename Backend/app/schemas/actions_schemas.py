from pydantic import BaseModel
from typing import List
from datetime import datetime

class Violation(BaseModel):
    id: str
    supplierId: str
    type: str
    severity: str
    description: str
    source: str = "Gemini AI"
    status: str = "pending"
    detectedDate: datetime

class ActionItem(BaseModel):
    id: str
    supplierId: str
    title: str
    description: str
    priority: str
    category: str
    estimatedImpact: str
    recommendedBy: str = "Gemini AI"
    createdAt: datetime
    status: str = "pending"
    lastAssessedAt: datetime
    violation: str
    geminiRaw: str

class ActionDocument(BaseModel):
    company_name: str
    location: str
    id: str
    risk_score: int
    risk_level: str
    product_id: int
    violations: List[Violation]
    actions: List[ActionItem]
    contract_value: int
    penalty: int
    class Config:
        from_attributes = True