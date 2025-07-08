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

# ---------- 1. EXTRACT AND STORE RELIABILITY DATA ----------

@router.post("/submit-risk-report")
async def submit_reliability_report(file: UploadFile = File(...), email: str = Form(...)):
    allowed_extensions = ['.pdf', '.docx']
    file_extension = os.path.splitext(file.filename)[1].lower()

    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    try:
        file_content = await file.read()
        gemini = gemini_service(api_key=os.getenv("GEMINI_API_KEY"))
        result = await gemini.extract_risk_data(file_content, file.filename)  # contains result["result"], result["status"]

        email_domain = email.split('@')[1]
        supplier = await db.suppliers.find_one({"email_domain": email_domain})

        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")

        # ✅ Update risk_subfactors_test from extracted result
        update_fields = {
            "risk_subfactors": result.get("result"),

        }

        await db.suppliers.update_one(
            {"email_domain": email_domain},
            {"$set": update_fields}
        )

        return result  # Still return for frontend use

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
