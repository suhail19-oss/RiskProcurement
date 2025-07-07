from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from pydantic import BaseModel, EmailStr , Field
from typing import Dict, Any
import os, json, re, logging
import requests
from dotenv import load_dotenv
from fastapi import Request
from typing import Optional
from app.database import db 
from app.services.gemini_service import gemini_service
import google.generativeai as genai
import traceback
from datetime import datetime  
from fastapi.responses import ORJSONResponse
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
load_dotenv()

router = APIRouter()

# ---------- MODELS ----------
class CostEfficiencyInput(BaseModel):
    final_subfactor_scores: Dict[str, Dict[str, Any]]

class CostEfficiencycalculationRequest(BaseModel):
    result: Dict[str, Any]
    overall_data: Dict[str, Any]

# ---------- INDUSTRY AVERAGES FOR FALLBACK ----------
# As per year 2024
COST_EFFICIENCY_INDUSTRY_AVERAGES = {
    "automotive": {
        "unit_price_benchmarking": 0.78,
        "volume_dicsount_potential": 0.65,
        "payment_terms_flexibility": 0.70,
        "FPY_Normalized": 0.93,
        "legal_disputes_last_6_months": 3.0,
        "legal_dispute_score": 0.10,
        "contract_value": 450_000_000.0,
        "war_zone_norm": 0.02,
        "trade_policy_norm": 0.20,
        "labor_violation_risk": 0.12,
        "recall_score_out_of_100": 8.0,
        "govt_sanctions_penalties": False,
        "war_zone_flag": 0,
        "labor_violations": "None",
        "trade_policy_changes": "Minor",
        "sanction_score": 0.02,
        "in_transit_delays_days": 0.05
    }
}

# ---------- HELPERS ----------
def calculate_category_score(scores):
    valid_scores = [v for v in scores.values() if isinstance(v, (int, float))]
    return round(sum(valid_scores) / len(valid_scores), 2) if valid_scores else 0

# ---------- 1. EXTRACT AND PREFILL ESG DATA ----------
@router.post("/submit-ci-report")
async def submit_ci_report(file: UploadFile = File(...), email: str = Form(...)):
    allowed_extensions = ['.pdf', '.docx']
    file_extension = os.path.splitext(file.filename)[1].lower()

    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    try:
        file_content = await file.read()
        gemini = gemini_service(api_key=os.getenv("GEMINI_API_KEY"))
        result = await gemini.extract_ci_data(file_content, file.filename)

        email_domain = email.split('@')[1]
        supplier = await db.suppliers.find_one({"email_domain": email_domain})

        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")

        update_fields = {
            "cost_subfactors": result.get("result"),
            "cost_upload_status": result.get("status")
        }

        await db.suppliers.update_one({"email_domain": email_domain}, {"$set": update_fields})
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


# ---------- 2. COMBINED: CALCULATE SUBFACTORS, FILL MISSING, FINAL SCORE ----------
class CIResult(BaseModel):
    company_name: str
    reporting_year: Optional[int]
    unit_price_benchmarking: float
    volume_dicsount_potential: float
    payment_terms_flexibility: float
    FPY_Normalized: float
    legal_disputes_last_6_months: float
    legal_dispute_score: float
    contract_value: float
    war_zone_norm: float
    trade_policy_norm: float
    labor_violation_risk: float
    recall_score_out_of_100: float
    govt_sanctions_penalties: Optional[bool]
    war_zone_flag: Optional[int]
    labor_violations: Optional[str]
    trade_policy_changes: Optional[str]
    sanction_score: float
    in_transit_delays_days: float
    
@router.get("/calculate-ci-score")
async def calculate_ci_score_from_db(request: Request):
    try:
        email = request.headers.get("email")
        if not email or "@" not in email:
            raise HTTPException(status_code=400, detail="Invalid or missing email header")

        email_domain = email.split("@")[1]

        # 2) Fetch supplier
        supplier = await db.suppliers.find_one({"email_domain": email_domain})
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")


        # ✅ Instead of ci_upload_result, get cost_subfactors
        if "cost_subfactors" not in supplier or "cost_upload_status" not in supplier:
            raise HTTPException(status_code=404, detail="No cost subfactor data found for this supplier")

        cost_data = supplier["cost_subfactors"]
        status = supplier["cost_upload_status"]

        # Fill missing or null values with industry averages
        averages = COST_EFFICIENCY_INDUSTRY_AVERAGES["automotive"]

        def get_value(key):
            val = cost_data.get(key, None)
            return averages[key] if val is None else val
        
        _raw_sanctions = cost_data.get("govt_sanctions", averages["govt_sanctions_penalties"])
        govt_sanctions_penalties = (
            bool(_raw_sanctions) if isinstance(_raw_sanctions, (bool, int)) else None
        )

        # ✅ Build CIResult using cost_subfactors instead of ci_upload_result
        r = CIResult(
            company_name=supplier.get("company_name", "Unknown"),
            reporting_year=None,  # You can remove or keep if you wish
            unit_price_benchmarking=float(get_value("unit_price_benchmarking")),
            volume_dicsount_potential=float(get_value("volume_discount_potential")),
            payment_terms_flexibility=float(get_value("payment_terms_flexibility")),
            FPY_Normalized=float(get_value("first_pass_yield")),
            legal_disputes_last_6_months=float(get_value("legal_disputes")),
            legal_dispute_score=float(get_value("legal_dispute_score")),
            contract_value=float(get_value("contract_value")),
            war_zone_norm=float(get_value("war_zone_norm")),
            trade_policy_norm=float(get_value("trade_policy_norm")),
            labor_violation_risk=float(get_value("labor_violation_risk")),
            recall_score_out_of_100=float(get_value("recall_score")),
            govt_sanctions_penalties=govt_sanctions_penalties,
            war_zone_flag=cost_data.get("war_zone_flag", averages["war_zone_flag"]),
            labor_violations=cost_data.get("labor_violations", averages["labor_violations"]),
            trade_policy_changes=cost_data.get("trade_policy_changes", averages["trade_policy_changes"]),
            sanction_score=float(get_value("sanction_score")),
            in_transit_delays_days=float(get_value("in_transit_delay_days")),
        )

        # ✅ Compute normalized scores
        unit_price_score = r.unit_price_benchmarking * 100
        volume_discount_score = r.volume_dicsount_potential * 100
        payment_terms_score = r.payment_terms_flexibility * 100
        transit_delay_score = (1 - r.in_transit_delays_days / 30) * 100  # Example normalization
        fpy_score = r.FPY_Normalized * 100
        recall_score = 100 - r.recall_score_out_of_100
        legal_dispute_score = (1 - r.legal_dispute_score) * 100
        sanctions_score = (1 - r.sanction_score) * 100
        labor_violation_score = (1 - r.labor_violation_risk) * 100
        trade_policy_score = (1 - r.trade_policy_norm) * 100
        war_zone_score = (1 - r.war_zone_norm) * 100
        contract_value_score = ((r.contract_value - 100_000_000) / 700_000_000) * 100

        # ✅ Compute final Cost Efficiency Score
        cost_efficiency_score = (
            (unit_price_score * 0.20) +
            (volume_discount_score * 0.10) +
            (payment_terms_score * 0.10) +
            (transit_delay_score * 0.10) +
            (fpy_score * 0.10) +
            (recall_score * 0.10) +
            (legal_dispute_score * 0.05) +
            (sanctions_score * 0.05) +
            (labor_violation_score * 0.05) +
            (trade_policy_score * 0.05) +
            (war_zone_score * 0.05) +
            (contract_value_score * 0.05)
        )


        # ✅ Save normalized scores and replace cost_score
        await db.suppliers.update_one(
            {"email_domain": email_domain},
            {
                "$set": {
                    "cost_score": round(cost_efficiency_score, 2),
                    "cost_efficiency_normalized_scores": {
                        "unit_price_score": round(unit_price_score, 2),
                        "volume_discount_score": round(volume_discount_score, 2),
                        "payment_terms_score": round(payment_terms_score, 2),
                        "transit_delay_score": round(transit_delay_score, 2),
                        "fpy_score": round(fpy_score, 2),
                        "recall_score": round(recall_score, 2),
                        "legal_dispute_score": round(legal_dispute_score, 2),
                        "sanctions_score": round(sanctions_score, 2),
                        "labor_violation_score": round(labor_violation_score, 2),
                        "trade_policy_score": round(trade_policy_score, 2),
                        "war_zone_score": round(war_zone_score, 2),
                        "contract_value_score": round(contract_value_score, 2)
                    }
                }
            }
        )


        # ✅ Return
        return {
            "ci_upload_status": status,
            "cost_efficiency_score": round(cost_efficiency_score, 2),
            "cost_efficiency_normalized_scores": {
                "unit_price_score": round(unit_price_score, 2),
                "volume_discount_score": round(volume_discount_score, 2),
                "payment_terms_score": round(payment_terms_score, 2),
                "transit_delay_score": round(transit_delay_score, 2),
                "fpy_score": round(fpy_score, 2),
                "recall_score": round(recall_score, 2),
                "legal_dispute_score": round(legal_dispute_score, 2),
                "sanctions_score": round(sanctions_score, 2),
                "labor_violation_score": round(labor_violation_score, 2),
                "trade_policy_score": round(trade_policy_score, 2),
                "war_zone_score": round(war_zone_score, 2),
                "contract_value_score": round(contract_value_score, 2)
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating CI score: {str(e)}")

@router.get("/get-cost-prefill")
async def get_cost_prefill(request: Request):
    email = request.headers.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email header is required")

    email_domain = email.split('@')[1]
    supplier = await db.suppliers.find_one({"email_domain": email_domain})

    if not supplier or "cost_subfactors" not in supplier:
        raise HTTPException(status_code=404, detail="No ESG data found")

    return ORJSONResponse(content={
    "status": "success",
    "result": supplier["cost_subfactors"],
    })

