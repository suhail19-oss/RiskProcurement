import google.generativeai as genai
from fastapi import UploadFile
import PyPDF2
import io
import json
import os
from typing import Dict, Any
import logging
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class gemini_service:
    def __init__(self, api_key: str):
        try:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        except Exception as e:
            logger.error(f"Failed to initialize Gemini. Check your API key. Error: {e}")
            raise

    def extract_text_from_pdf(self, file_content: bytes) -> str:
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
            return text
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {e}")
            return ""

    def _save_to_local_storage(self, filename: str, data: Dict[str, Any]):
        try:
            os.makedirs("extracted_reports", exist_ok=True)
            base_name = os.path.splitext(os.path.basename(filename))[0]
            output_file = f"extracted_reports/{base_name}_extracted.json"
            with open(output_file, 'w') as f:
                json.dump(data, f, indent=2)
            logger.info(f"Successfully saved extracted data to {output_file}")
            return output_file
        except Exception as e:
            logger.error(f"Error saving to local storage: {e}")
            return None

    def _extract_json_from_text(self, text: str) -> Dict[str, Any]:
        from json import JSONDecoder
        decoder = JSONDecoder()
        text = text.strip()
        for i in range(len(text)):
            try:
                obj, end = decoder.raw_decode(text[i:])
                return obj
            except json.JSONDecodeError:
                continue
        return {}

    async def extract_esg_data(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        logger.info("Starting Gemini 1.5 Flash ESG data extraction...")
        try:
            document_text = self.extract_text_from_pdf(file_content)
            if not document_text.strip():
                raise ValueError("No text could be extracted from the document.")

            prompt = """You are an expert ESG data extraction specialist.

From the following ESG report, extract as much **numerical ESG-related data** as possible to help derive key sustainability indicators. Focus on retrieving **exact values** for the following fields **if they are directly reported**. Use this strict JSON structure and field names if available. Return your response as a JSON object containing two top-level keys: `result` and `overall_data`:
keep this json name as result. In result , must include the units of numerical values also along with value
{
  "company_name": "string",
  "reporting_year": "integer",
  "company_ghg_emissions_per_unit_revenue": "float",
  "company_energy_consumption_per_unit_output": "float", 
  "company_water_withdrawal_per_unit_output": "float",
  "amount_waste_recycled": "float",
  "total_waste_generated": "float",
  "environmental_fines_penalty_weight": "integer",
  "renewable_energy_consumption": "float",
  "total_energy_consumption": "float",
  "biodiversity_impact_score": "float",
  "climate_risk_mitigation_measures_implemented": "integer",
  "total_applicable_measures": "integer",
  "employee_turnover_rate": "float",
  "company_injury_rate": "float",
  "number_diverse_employees": "integer",
  "total_employees": "integer",
  "amount_invested_community_programs": "float",
  "total_revenue": "float",
  "net_promoter_score": "integer",
  "number_reported_violations_severity_weight": "integer",
  "avg_training_hours_per_employee": "float",
  "number_independent_directors": "integer",
  "total_number_directors": "integer",
  "ceo_pay_ratio": "float",
  "number_independent_audit_committee_members": "integer",
  "total_audit_committee_members": "integer",
  "number_shareholder_friendly_policies_implemented": "integer",
  "total_number_evaluated_policies": "integer",
  "number_disclosed_esg_metrics": "integer",
  "total_number_relevant_esg_metrics": "integer",
  "number_corruption_incidents_severity_weight": "integer",
  "number_disclosed_tax_jurisdictions": "integer",
  "total_number_operating_jurisdictions": "integer"
}

---

⚠️ If **some of the above exact metrics are missing**, still extract the following **related numerical values** from the report. These values might be present in variuos parts like scope1 scope2, etc. so just collect the numerical data and append it to teh below json structure. These can help compute the final values later via mathematical transformations.
Under `"overall_data"`, collect following numerical data even if it's not part of the fields above:
- Total GHG emissions (absolute or by region/scope)
- Total energy consumption (absolute or intensity-based)
- Total water withdrawal (absolute or intensity-based)
- Amount of recycled waste (absolute or intensity-based)
- Total waste generated (absolute or intensity-based)
- Number of environmental fines and associated penalties (absolute or intensity-based)
- Renewable vs non-renewable energy breakdown (absolute or intensity-based)
- Land use and ecosystem disruption score or impact ratings (absolute or intensity-based)
- Number of implemented vs applicable climate risk mitigation measures (absolute or intensity-based)
- Employee turnover numbers or rates (absolute or intensity-based)
- Company injury statistics or rates (absolute or intensity-based)
- Number of diverse (e.g., women, minorities) employees (absolute or intensity-based)
- Total number of employees (absolute or intensity-based)
- Amount invested in community programs or CSR (absolute or intensity-based)
- Customer satisfaction scores (e.g., NPS or equivalent) (absolute or intensity-based)
- Training hours per employee or total training hours (absolute or intensity-based)
- Number of independent directors and total board members (absolute or intensity-based)
- CEO pay and industry median CEO pay (absolute or intensity-based)
- Number and details of audit committee members (absolute or intensity-based)
- Count of shareholder-friendly policies (absolute or intensity-based)
- Number of disclosed ESG metrics (absolute or intensity-based)
- Number of reported corruption incidents and their severity (absolute or intensity-based)
- Disclosed tax jurisdictions and total jurisdictions operated (absolute or intensity-based)


Return format:
{
  "result": { ... }, 
  "overall_data": { ... }
}

ONLY return the JSON object above. Do not include explanations or extra text.

Document text:

""" + document_text

            response = self.model.generate_content(prompt)
            raw_response = response.text.strip()
            logger.info(f"Gemini raw response: {raw_response}")

            if raw_response.startswith("```json"):
                raw_response = raw_response.strip("`")  # Remove backticks
                raw_response = raw_response.lstrip("json").strip()
            elif raw_response.startswith("```"):
                raw_response = raw_response.strip("`").strip()
            
            try:
                extracted_data = json.loads(raw_response)
                if isinstance(extracted_data, dict):
                    result = extracted_data.get("result", {})
                    overall_data = extracted_data.get("overall_data", {})
                else:
                    raise ValueError("Parsed data is not a JSON object.")
            except Exception as e:
                logger.warning(f"Non-JSON response from Gemini, returning raw text. Reason: {e}")
                result = raw_response
                overall_data = {}


            
            return {
                "result": result,
                "overall_data": overall_data,
                "status": "success"
            }

        except Exception as e:
            logger.error(f"Error during extraction: {e}")
            return {
                "result": {},
                "overall_data": {},
                "error": str(e),
                "status": "error"
            }

    async def extract_ci_data(self, file_content: bytes, filename: str) -> Dict[str, Any]:
            logger.info("Starting Gemini 1.5 Flash Cost Efficiency data extraction...")
            try:
                document_text = self.extract_text_from_pdf(file_content)
                if not document_text.strip():
                    raise ValueError("No text could be extracted from the document.")

                prompt = """You are an procurement expert data extraction specialist.

    From the following report, extract as much **numerical cost efficiency related data** as possible to help derive key indicators. Focus on retrieving **exact values** for the following fields **if they are directly reported**. Use this strict JSON structure and field names if available. Return your response as a JSON object containing top-level key: `result`:
    keep this json name as result. In result , must include the units of numerical values also along with value, add reporting_year as 2024
    {
    "company_name": "string",
    "reporting_year": "integer",
    "unit_price_benchmarking": "float",
    "volume_dicsount_potential": "float", 
    "payment_terms_flexibility": "float",
    "FPY_Normalized": "float",
    "legal_disputes_last_6_months": "float",
    "legal_dispute_score": "integer",
    "contract_value": "float",
    "war_zone_norm": "float",
    "trade_policy_norm": "float",
    "labor_violation_risk": "integer",
    "recall_score_out_of_100": "float",
    "govt_sanctions_penalties": "bool",
    "war_zone_flag": "integer",
    "labor_violations": "string",
    "trade_policy_changes": "string",
    "sanction_score": "float",
    "in_transit_delays_days":"float"
    }

    ---

   
    Return format:
    {
    "result": { ... }, 
    }

    ONLY return the JSON object above. Do not include explanations or extra text.

    Document text:

    """ + document_text

                response = self.model.generate_content(prompt)
                raw_response = response.text.strip()
                logger.info(f"Gemini raw response: {raw_response}")

                if raw_response.startswith("```json"):
                    raw_response = raw_response.strip("`")  # Remove backticks
                    raw_response = raw_response.lstrip("json").strip()
                elif raw_response.startswith("```"):
                    raw_response = raw_response.strip("`").strip()
                
                try:
                    extracted_data = json.loads(raw_response)
                    if isinstance(extracted_data, dict):
                        result = extracted_data.get("result", {})
                      
                    else:
                        raise ValueError("Parsed data is not a JSON object.")
                except Exception as e:
                    logger.warning(f"Non-JSON response from Gemini, returning raw text. Reason: {e}")
                    result = raw_response
                   


                
                return {
                    "result": result,
                    "status": "success"
                }

            except Exception as e:
                logger.error(f"Error during extraction: {e}")
                return {
                    "result": {},
                    "error": str(e),
                    "status": "error"
                }
            
    async def extract_reliability_data(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        logger.info("Starting Gemini 1.5 Flash Reliability data extraction...")
        
        try:
            document_text = self.extract_text_from_pdf(file_content)
            
            if not document_text.strip():
                raise ValueError("No text could be extracted from the document.")
            
            prompt = """You are an expert reliability data extraction specialist. Extract the following EXACT fields from the report:

            ### Required Fields (must include all):
            {
                "company_name": "string",
                "reporting_year": 2024,
                "adjusted_on_time_delivery_rate": "float",
                "product_defect_rate": "float",
                "iso_certification_score": "float",
                "infrastructure_disruption_severity": "float",
                "average_lead_time_days": "float",
                "strike_days": "integer",
                "natural_disaster_frequency": "integer"
            }

            ### Extraction Rules:
            1. Convert all percentages to decimals (e.g., 89.444% → 0.89444)
            2. For lead time, use days as the unit
            3. For certification score, convert to 0-1 scale if needed
            4. Include ALL fields even if null (use null value)

            ### Data Sources:
            1. Use direct values where available
            2. Calculate derived fields:
               - adjusted_on_time_delivery_rate = on_time_deliveries / total_deliveries
               - product_defect_rate = defective_units / total_units_shipped

            ### Return Format (STRICT JSON):
            {
                "result": {
                    "company_name": "Hyundai Motor Company",
                    "reporting_year": 2024,
                    "adjusted_on_time_delivery_rate": 0.95,
                    "product_defect_rate": 0.006,
                    "iso_certification_score": 0.666,
                    "infrastructure_disruption_severity": 0.37,
                    "average_lead_time_days": 15,
                    "strike_days": 6,
                    "natural_disaster_frequency": 2
                },
                "source_metrics": {
                    "on_time_deliveries": 9500,
                    "total_deliveries": 10000,
                    "defective_units": 3000,
                    "total_units_shipped": 500000,
                    "certificates_obtained": 5
                }
            }

            Document text:
            """ + document_text

            response = self.model.generate_content(prompt)
            raw_response = response.text.strip()
            
            # Response cleaning with enhanced pattern matching
            patterns = [
                r'```json(.*?)```',  # ```json {...} ```
                r'```(.*?)```',      # ``` {...} ```
                r'{(.*?)}'           # raw {...}
            ]
            
            for pattern in patterns:
                match = re.search(pattern, raw_response, re.DOTALL)
                if match:
                    raw_response = match.group(1).strip()
                    break

            try:
                extracted_data = json.loads(raw_response)
                if not isinstance(extracted_data, dict):
                    raise ValueError("Top-level response is not a dictionary")
                
                # Validation
                required_fields = [
                    "adjusted_on_time_delivery_rate",
                    "product_defect_rate",
                    "average_lead_time_days"
                ]
                
                for field in required_fields:
                    if field not in extracted_data.get("result", {}):
                        raise ValueError(f"Missing required field: {field}")
                        
                return {
                    "result": extracted_data.get("result", {}),
                    "source_metrics": extracted_data.get("source_metrics", {}),
                    "status": "success"
                }
                
            except Exception as e:
                logger.error(f"JSON parsing failed: {e}\nRaw response: {raw_response}")
                return {
                    "result": {},
                    "error": f"Data parsing error: {str(e)}",
                    "status": "error"
                }
            
        except Exception as e:
            logger.error(f"Extraction failed: {e}")
            return {
                "result": {},
                "error": str(e),
                "status": "error"
            }
        
    async def extract_risk_data(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        logger.info("Starting Gemini 1.5 Flash Reliability data extraction...")
        
        try:
            document_text = self.extract_text_from_pdf(file_content)
            
            if not document_text.strip():
                raise ValueError("No text could be extracted from the document.")
            
            prompt = """You are an expert risk data extraction specialist. Extract the following EXACT fields from the report:

            ### Required Fields (must include all):
            {
                "in_transit_delays_days": "float",
                "war_zone_flag": "float",
                "first_pass_yield": "float",
                "iso_certification_score": "float",
                "infrastructure_disruption_severity": "float",
                "legal_disputes_last_6_months": "float",
                "govt_sanctions_penalties": "string",
                "product_defect_rate": "float",
                "esg": "float"
                "labor_violations_(6_months)": "string"
                "news_sentiment_score": "float"
                "natural_disaster_frequency_(last_6_months)": "float"
                "trade_policy_changes_(tariffs,_bans)": "string"
                "adjusted_on_time_delivery_rate": "float"
                "strike_days": "float"
            }


            ### Return Format (STRICT JSON):
            {
                "result": {
                    "in_transit_delays_days": 4.5,
                    "war_zone_flag": 1.0,
                    "first_pass_yield": 93.2,
                    "iso_certification_score": 87.5,
                    "infrastructure_disruption_severity": 0.4,
                    "legal_disputes_last_6_months": 2.0,
                    "govt_sanctions_penalties": "moderate",
                    "product_defect_rate": 1.7,
                    "esg": "75.0,
                    "labor_violations_(6_months)": "minor",
                    "news_sentiment_score": 0.4,
                    "natural_disaster_frequency_(last_6_months)": 1.0,
                    "trade_policy_changes_(tariffs,_bans)": "major",
                    "adjusted_on_time_delivery_rate": 85.2,
                    "strike_days": 3.0
                },
               
            }

            Document text:
            """ + document_text

            response = self.model.generate_content(prompt)
            raw_response = response.text.strip()
            
            # Response cleaning with enhanced pattern matching
            patterns = [
                r'```json(.*?)```',  # ```json {...} ```
                r'```(.*?)```',      # ``` {...} ```
                r'{(.*?)}'           # raw {...}
            ]
            
            for pattern in patterns:
                match = re.search(pattern, raw_response, re.DOTALL)
                if match:
                    raw_response = match.group(1).strip()
                    break

            try:
                extracted_data = json.loads(raw_response)
                if not isinstance(extracted_data, dict):
                    raise ValueError("Top-level response is not a dictionary")
                
                        
                return {
                    "result": extracted_data.get("result", {}),
                    "status": "success"
                }
                
            except Exception as e:
                logger.error(f"JSON parsing failed: {e}\nRaw response: {raw_response}")
                return {
                    "result": {},
                    "error": f"Data parsing error: {str(e)}",
                    "status": "error"
                }
            
        except Exception as e:
            logger.error(f"Extraction failed: {e}")
            return {
                "result": {},
                "error": str(e),
                "status": "error"
            }
 
