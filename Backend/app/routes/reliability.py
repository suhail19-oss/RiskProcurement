from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from pydantic import BaseModel
from typing import Dict, Any
import os, json, re, logging
import requests
from dotenv import load_dotenv
from app.database import db
from app.services.gemini_service import gemini_service
import google.generativeai as genai
import traceback
from datetime import datetime
from typing import Optional

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
load_dotenv()

router = APIRouter()

# ---------- MODELS ----------

class ReliabilityInput(BaseModel):
    final_reliability_scores: Dict[str, Any]

class ReliabilityCalculationRequest(BaseModel):
    result: Dict[str, Any]
    overall_data: Dict[str, Any]

class EmailRequest(BaseModel):
    email: str

# ---------- INDUSTRY AVERAGES FOR FALLBACK ----------
# As per year 2024
RELIABILITY_INDUSTRY_AVERAGES = {
    "automotive": {
        "adjusted_on_time_delivery_rate": 92.0,
        "average_lead_time_days": 15.0,
        "product_defect_rate": 0.025,  # 2.5%
        "iso_certification_score": 0.65,
        "infrastructure_disruption_severity": 0.4,
        "strike_days": 5,
        "natural_disaster_frequency": 2
    }
}


# ---------- 1. EXTRACT AND STORE RELIABILITY DATA ----------

@router.post("/submit-reliability-report")
async def submit_reliability_report(file: UploadFile = File(...), email: str = Form(...)):
    allowed_extensions = ['.pdf', '.docx']
    file_extension = os.path.splitext(file.filename)[1].lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    try:
        file_content = await file.read()
        gemini = gemini_service(api_key=os.getenv("GEMINI_API_KEY"))
        result = await gemini.extract_reliability_data(file_content, file.filename)
        
        email_domain = email.split('@')[1]
        supplier = await db.suppliers.find_one({"email_domain": email_domain})
        
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
        
        # Store ONLY the required fields
        update_fields = {
            "reliability_subfactors": result.get("result"),
            "reliability_upload_status": result.get("status")
        }
        
        await db.suppliers.update_one({"email_domain": email_domain}, {"$set": update_fields})
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

# ---------- 2. CALCULATE RELIABILITY SCORE FROM DATABASE ----------
class ReliabilityResult(BaseModel):
    adjusted_on_time_delivery_rate: float
    average_lead_time_days: float
    product_defect_rate: float
    iso_certification_score: float
    infrastructure_disruption_severity: float
    strike_days: float
    natural_disaster_frequency: float

@router.get("/calculate-reliability-score")
async def calculate_reliability_score_from_db(request: Request):
    try:
        # 1) Read email header
        email = request.headers.get("email")
        if not email or "@" not in email:
            raise HTTPException(status_code=400, detail="Invalid or missing email header")

        email_domain = email.split("@")[1]

        # 2) Fetch supplier
        supplier = await db.suppliers.find_one({"email_domain": email_domain})
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")

        # 3) Extract result dict and status
        result_data = supplier.get("reliability_subfactors")
        status = supplier.get("reliability_upload_status")

        # Fallback to industry averages if missing
        averages = RELIABILITY_INDUSTRY_AVERAGES["automotive"]
        if not result_data:
            result_data = averages

        # 4) Validate result_data against ReliabilityResult
        r = ReliabilityResult(
            adjusted_on_time_delivery_rate=float(result_data.get("adjusted_on_time_delivery_rate", averages["adjusted_on_time_delivery_rate"])),
            average_lead_time_days=float(result_data.get("average_lead_time_days", averages["average_lead_time_days"])),
            product_defect_rate=float(result_data.get("product_defect_rate", averages["product_defect_rate"])),
            iso_certification_score=float(result_data.get("iso_certification_score", averages["iso_certification_score"])),
            infrastructure_disruption_severity=float(result_data.get("infrastructure_disruption_severity", averages["infrastructure_disruption_severity"])),
            strike_days=float(result_data.get("strike_days", averages["strike_days"])),
            natural_disaster_frequency=float(result_data.get("natural_disaster_frequency", averages["natural_disaster_frequency"])),
        )

        # 5) Compute normalized subfactor scores
        # R1: On-Time Delivery Rate (higher is better, 0-100)
        r1_score = r.adjusted_on_time_delivery_rate

        # R2: Lead Time (lower is better, 0-100)
        r2_score = max(0, 100 - (r.average_lead_time_days * 3.33))  # 30 days = 0, 0 days = 100

        # R3: Defect Rate (lower is better, 0-100)
        defect_rate_percent = r.product_defect_rate * 100 if r.product_defect_rate < 1 else r.product_defect_rate
        r3_score = max(0, 100 - (defect_rate_percent * 20))  # 5% = 0, 0% = 100

        # R4: Certifications (0-1 scale to 0-100)
        r4_score = r.iso_certification_score * 100

        # R5: Infrastructure Disruption (lower is better, 0-100)
        r5_score = (1 - r.infrastructure_disruption_severity) * 100

        # R6: Supply Chain Disruption (lower is better, 0-100)
        combined_disruption = min(1.0, (r.strike_days / 30) + (r.natural_disaster_frequency / 5))
        r6_score = (1 - combined_disruption) * 100

        # 6) Compute final weighted reliability score
        reliability_score = (
            (r1_score * 0.25) +
            (r2_score * 0.15) +
            (r3_score * 0.15) +
            (r4_score * 0.15) +
            (r5_score * 0.15) +
            (r6_score * 0.15)
        )

        # ✅ Save normalized scores and replace cost_score
        await db.suppliers.update_one(
            {"email_domain": email_domain},
            {
                "$set": {
                    "reliability_score": round(reliability_score, 2),
                    "reliability_normalized_scores": {
                        "adjusted_on_time_delivery_rate": round(r1_score, 2),
                        "average_lead_time_days_score": round(r2_score, 2),
                        "product_defect_rate": round(r3_score, 2),
                        "iso_certification_score": round(r4_score, 2),
                        "infrastructure_disruption_severity_score": round(r5_score, 2),
                        "combined_disruption": round(r6_score, 2),
                    }
                }
            }
        )

        # 7) Return
        return {
            "reliability_upload_status": status,
            "reliability_score": round(reliability_score, 2),
            "normalized_scores": {
                "on_time_delivery_score": round(r1_score, 2),
                "lead_time_score": round(r2_score, 2),
                "defect_rate_score": round(r3_score, 2),
                "certification_score": round(r4_score, 2),
                "infrastructure_disruption_score": round(r5_score, 2),
                "supply_chain_disruption_score": round(r6_score, 2)
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating reliability score: {str(e)}")
    
    
# function to prefill input feilds 
@router.get("/get-reliability-prefill")
async def get_reliability_prefill(request: Request):
    email = request.headers.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email header is required")

    email_domain = email.split('@')[1]
    supplier = await db.suppliers.find_one({"email_domain": email_domain})

    if not supplier or "reliability_subfactors" not in supplier:
        raise HTTPException(status_code=404, detail="No ESG data found")

    return {
        "status": "success",
        "result": supplier["reliability_subfactors"],
    }
    
    
# function to prefill datasets for risk 
@router.get("/get-risk-prefill")
async def get_risk_prefill(request: Request):
    email = request.headers.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email header is required")

    email_domain = email.split('@')[1]
    supplier = await db.suppliers.find_one({"email_domain": email_domain})

    if not supplier or "risk_subfactors" not in supplier:
        raise HTTPException(status_code=404, detail="No risk data found")

    return {
        "status": "success",
        "result": supplier["risk_subfactors"],
    }
    