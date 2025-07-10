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
from fastapi.responses import JSONResponse
import math

router = APIRouter()

@router.get("/company_name")
async def get_company_name(email_domain: str):
    try:
        supplier = await db.suppliers.find_one(
            {"email_domain": {"$regex": f"^{email_domain}$", "$options": "i"}},
            {"_id": 0, "company_name": 1}  # Only return company_name
        )
        
        if not supplier:
            return JSONResponse(
                status_code=404,
                content={"error": f"No supplier found with email domain '{email_domain}'"},
            )

        return {"company_name": supplier["company_name"]}
        
    except Exception as e:
        logger.error(f"Error fetching company for domain {email_domain}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to lookup company"},
        )
    
@router.get("/suppliers/esg/{company_name}")
async def get_supplier_esg_data(company_name: str):
    try:
        # Case-insensitive exact match for company name
        supplier = await db.suppliers.find_one(
            {"company_name": {"$regex": f"^{company_name}$", "$options": "i"}},
            {
                "_id": 0,
                "company_name": 1,
                "esg_final_score": 1,
                "esg_E_score": 1,
                "esg_S_score": 1,
                "esg_G_score": 1,
                "esg_subfactor_scores": 1
            }
        )
        
        if not supplier:
            return JSONResponse(
                status_code=404,
                content={"error": f"Supplier '{company_name}' not found"},
            )

        # Structure the minimal required response
        response_data = {
            "company_name": supplier.get("company_name"),
            "esg_final_score": supplier.get("esg_final_score"),
            "esg_E_score": supplier.get("esg_E_score"),
            "esg_S_score": supplier.get("esg_S_score"),
            "esg_G_score": supplier.get("esg_G_score"),
            "esg_subfactor_scores": supplier.get("esg_subfactor_scores", {})
        }

        # Sanitize NaN/Infinity values
        def sanitize(data):
            if isinstance(data, dict):
                return {k: sanitize(v) for k, v in data.items()}
            elif isinstance(data, list):
                return [sanitize(item) for item in data]
            elif isinstance(data, float):
                if math.isnan(data) or math.isinf(data):
                    return None
                return data
            return data

        return {"supplier": sanitize(response_data)}

    except Exception as e:
        logger.error(f"Error fetching ESG data for {company_name}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to fetch ESG data"},
        )
        
@router.get("/suppliers/cost/{company_name}")
async def get_supplier_cost_data(company_name: str):
    try:
        # Case-insensitive exact match for company name
        supplier = await db.suppliers.find_one(
            {"company_name": {"$regex": f"^{company_name}$", "$options": "i"}},
            {
                "_id": 0,
                "company_name": 1,
                "reporting_year": 1,
                "cost_subfactors": 1 
            }
        )
        
        if not supplier:
            return JSONResponse(
                status_code=404,
                content={"error": f"Supplier '{company_name}' not found"},
            )

        # Structure the response with cost subfactors
        response_data = {
            "cost_subfactors": supplier.get("cost_subfactors", {})
        }

        # Sanitize NaN/Infinity values
        def sanitize(data):
            if isinstance(data, dict):
                return {k: sanitize(v) for k, v in data.items()}
            elif isinstance(data, list):
                return [sanitize(item) for item in data]
            elif isinstance(data, float):
                if math.isnan(data) or math.isinf(data):
                    return None
                return data
            return data

        return {"supplier": sanitize(response_data)}

    except Exception as e:
        logger.error(f"Error fetching cost data for {company_name}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to fetch cost data"},
        )

@router.get("/suppliers/reliability/{company_name}")
async def get_supplier_reliability_data(company_name: str):
    try:
        # Case-insensitive exact match for company name
        supplier = await db.suppliers.find_one(
            {"company_name": {"$regex": f"^{company_name}$", "$options": "i"}},
            {
                "_id": 0,
                "company_name": 1,
                "reliability_score": 1,
                "reliability_subfactors": 1,
                "reliability_upload_status": 1
            }
        )
        
        if not supplier:
            return JSONResponse(
                status_code=404,
                content={"error": f"Supplier '{company_name}' not found"},
            )

        # Structure the response
        response_data = {
            "reliability_score": supplier.get("reliability_score"),
            "reliability_upload_status": supplier.get("reliability_upload_status"),
            "reliability_subfactors": supplier.get("reliability_subfactors", {})
        }

        # Sanitize NaN/Infinity values
        def sanitize(data):
            if isinstance(data, dict):
                return {k: sanitize(v) for k, v in data.items()}
            elif isinstance(data, list):
                return [sanitize(item) for item in data]
            elif isinstance(data, float):
                if math.isnan(data) or math.isinf(data):
                    return None
                return data
            return data

        return {"supplier": sanitize(response_data)}

    except Exception as e:
        logger.error(f"Error fetching reliability data for {company_name}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to fetch reliability data"},
        )

@router.get("/suppliers/risk/{company_name}")
async def get_supplier_risk_data(company_name: str):
    try:
        # Case-insensitive exact match for company name
        supplier = await db.suppliers.find_one(
            {"company_name": {"$regex": f"^{company_name}$", "$options": "i"}},
            {
                "_id": 0,
                "company_name": 1,
                "risk_score": 1,
                "risk_subfactors": 1,
                "risk_upload_status": 1
            }
        )
        
        if not supplier:
            return JSONResponse(
                status_code=404,
                content={"error": f"Supplier '{company_name}' not found"},
            )

        # Structure the response
        response_data = {
            "risk_score": supplier.get("risk_score"),
            "risk_upload_status": supplier.get("risk_upload_status"),
            "risk_subfactors": supplier.get("risk_subfactors", {})
        }

        # Sanitize NaN/Infinity values
        def sanitize(data):
            if isinstance(data, dict):
                return {k: sanitize(v) for k, v in data.items()}
            elif isinstance(data, list):
                return [sanitize(item) for item in data]
            elif isinstance(data, float):
                if math.isnan(data) or math.isinf(data):
                    return None
                return data
            return data

        return {"supplier": sanitize(response_data)}

    except Exception as e:
        logger.error(f"Error fetching reliability data for {company_name}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to fetch reliability data"},
        )
        