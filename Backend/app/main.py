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
from fastapi import Path
from app.routes import profile
from app.schemas.actions_schemas import ActionDocument
from fastapi import Body

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
from app.routes import test, auth, esg, recommendations, reportGeneration, costEfficiency, reliability,risk

from app.routes import risk_model 
from app.services.gemini_service import gemini_service

import math
# suppliers api was giving mongoDB documents and before sending them to server we need to sanitize them otherwise it gives error
def sanitize(obj):
    if isinstance(obj, dict):
        return {k: sanitize(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize(i) for i in obj]
    elif isinstance(obj, float):
        return None if math.isnan(obj) or math.isinf(obj) else obj
    else:
        return obj

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# ------------------- FastAPI App Initialization -------------------
app = FastAPI(title="ESG Auto-Fill System", version="1.0.0")

# ------------------- Logger Setup -------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ------------------- CORS Middleware -------------------
# IMPORTANT:
# When using allow_credentials=True, you CANNOT use allow_origins=["*"]
# So specify your frontend origin explicitly:
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
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
app.include_router(risk.router)
app.include_router(risk_model.router, prefix="/api")


app.include_router(risk_model.router, prefix="/api/model")

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

        # Sanitize: replace NaN/Infinity with None
        def sanitize(d):
            if isinstance(d, dict):
                return {k: sanitize(v) for k, v in d.items()}
            elif isinstance(d, list):
                return [sanitize(i) for i in d]
            elif isinstance(d, float):
                if math.isnan(d) or math.isinf(d):
                    return None
                return d
            else:
                return d

        sanitized_suppliers = [sanitize(s) for s in suppliers]

        return {"suppliers": sanitized_suppliers}
    except Exception as e:
        logger.exception("Error fetching suppliers")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)},
        )

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
      

@app.get("/api/news/{supplier_name}")
async def get_news_by_supplier(supplier_name: str):
    try:
        print(supplier_name);
        # Find the news document for the given supplier/company name
        doc = await db.news.find_one({"company_name": supplier_name}, {"_id": 0, "news": 1})
        if doc and "news" in doc:
            return {"supplier": supplier_name, "news": doc["news"]}
        else:
            return {"supplier": supplier_name, "news": [], "message": "No news found for this supplier"}
    except Exception as e:
        logger.exception("Error fetching news for supplier")
        return {"error": str(e)}

        

#Actions controllers

@app.post("/api/actions")
async def create_action(action: dict = Body(...)):
    try:
        # Validate and parse the incoming action dict using the ActionDocument schema
        action_doc = ActionDocument(**action)
        await db.actions.insert_one(action_doc.dict())
        return {"message": "Action created successfully"}
    except Exception as e:
        logger.exception("Error creating action")
        return {"error": str(e)}

@app.get("/api/actions")
async def get_all_actions():
    try:
        cursor = db.actions.find({}, {"_id": 0})
        actions = await cursor.to_list(length=None)
        return {"actions": actions}
    except Exception as e:
        logger.exception("Error fetching actions")
        return {"error": str(e)}

@app.put("/api/actions/{id}")
async def update_action(
    id: str = Path(..., description="The ID of the action document to update"),
    violations: Optional[list] = Body(None),
    actions: Optional[list] = Body(None)
):
    try:
        update_fields = {}
        if violations is not None:
            update_fields["violations"] = violations
        if actions is not None:
            update_fields["actions"] = actions
        if not update_fields:
            return {"error": "No update fields provided"}
        
        result = await db.actions.update_one(
            {"id": id},
            {"$set": update_fields}
        )
        if result.matched_count == 0:
            return {"error": "No action found with this ID"}
        return {"message": "Action updated successfully"}
    except Exception as e:
        logger.exception("Error updating action")
        return {"error": str(e)}


