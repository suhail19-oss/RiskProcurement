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
from app.routes import test, auth, esg, recommendations, reportGeneration
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
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with specific origins in production
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
        # here we sanitize the suppliers to remove any Nan and other values apparently
        suppliers = sanitize(suppliers)
        return {"suppliers": suppliers}
    except Exception as e:
        logger.exception("Error fetching suppliers")
        return {"error": str(e)}
    
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







