# main.py

import os
import json
import logging
from dotenv import load_dotenv
from datetime import datetime
from typing import Dict, List, Optional, Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder

from app.routes import profile

# Google Gemini
import google.generativeai as genai

# PDF generation
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from fpdf import FPDF

# App internals
from app.database import db
from app.routes import test, auth, esg, recommendations, reportGeneration, costEfficiency, reliability
from app.services.gemini_service import gemini_service

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# ------------------- FastAPI App Initialization -------------------
app = FastAPI(title="ESG Auto-Fill System", version="1.0.0")

# ------------------- Logger Setup -------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ------------------- CORS Middleware -------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- Include Routers -------------------
app.include_router(test.router)
app.include_router(auth.router)
app.include_router(esg.router, prefix="/api")
app.include_router(recommendations.router)
app.include_router(reportGeneration.router)
app.include_router(profile.router)
app.include_router(costEfficiency.router)
app.include_router(reliability.router)

# ------------------- Custom Exception Handler -------------------
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {exc.errors()}")
    logger.error(f"Request body: {exc.body}")
    return JSONResponse(
        status_code=422,
        content=jsonable_encoder({
            "detail": exc.errors(),
            "body": exc.body,
            "message": "Validation failed"
        }),
    )

# ------------------- Health Check Routes -------------------
@app.get("/")
async def root():
    return {"message": "ESG Auto-Fill System API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/ping")
async def ping_db():
    return {"msg": "Pretend MongoDB is connected (DB removed in this version)"}

# ------------------- Supplier Endpoint -------------------
@app.get("/api/suppliers")
async def get_all_suppliers():
    try:
        cursor = db.suppliers.find({}, {"_id": 0})
        suppliers = await cursor.to_list(length=None)
        return {"suppliers": suppliers}
    except Exception as e:
        logger.exception("Error fetching suppliers")
        return {"error": str(e)}

@app.get("/api/suppliers-with-products")
async def get_suppliers_with_products():
    try:
        # Use MongoDB aggregation to join suppliers with products
        pipeline = [
            {
                "$lookup": {
                    "from": "products",
                    "localField": "product_id", 
                    "foreignField": "id",
                    "as": "product_info"
                }
            },
            {
                "$unwind": {
                    "path": "$product_info",
                    "preserveNullAndEmptyArrays": True
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "company_name": 1,
                    "email_domain": 1,
                    "industry": 1,
                    "product_id": 1,
                    "product_name": "$product_info.product",
                    "risk_upload_status": 1,
                    "cost_upload_status": 1,
                    "reliability_upload_status": 1,
                    "esg_upload_status": 1
                }
            }
        ]
        
        suppliers = await db.suppliers.aggregate(pipeline).to_list(length=None)
        
        # Clean NaN values
        cleaned_suppliers = clean_nan_values(suppliers)
        
        # Calculate document status for each supplier
        for supplier in cleaned_suppliers:
            # Ensure all status fields exist
            supplier["risk_upload_status"] = supplier.get("risk_upload_status")
            supplier["cost_upload_status"] = supplier.get("cost_upload_status") 
            supplier["reliability_upload_status"] = supplier.get("reliability_upload_status")
            supplier["esg_upload_status"] = supplier.get("esg_upload_status")
            
            # Count missing documents
            missing_count = 0
            if supplier.get("risk_upload_status") != "success":
                missing_count += 1
            if supplier.get("cost_upload_status") != "success":
                missing_count += 1
            if supplier.get("reliability_upload_status") != "success":
                missing_count += 1
            if supplier.get("esg_upload_status") != "success":
                missing_count += 1
            
            supplier["missing_documents_count"] = missing_count
        
        return {"suppliers": cleaned_suppliers}
        
    except Exception as e:
        logger.exception("Error fetching suppliers with products")
        return {"error": str(e)}

def clean_nan_values(obj):
    """Recursively clean NaN values from nested objects"""
    if isinstance(obj, dict):
        return {k: clean_nan_values(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_nan_values(i) for i in obj]
    elif isinstance(obj, float) and (math.isnan(obj) or math.isinf(obj)):
        return None
    else:
        return obj
