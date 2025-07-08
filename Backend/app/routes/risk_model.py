from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
from app.database import db
import re
def camel_to_snake(label):
    return re.sub(r'(?<!^)(?=[A-Z])', '_', label).lower()

# ✅ Create router instance
router = APIRouter()

# ✅ Load model
model = joblib.load("app/model/xgb_multioutput_model.pkl")
feature_order = model.estimators_[0].feature_names_in_

# ✅ Mappings for categorical fields
govt_sanctions_map = {
    "none": 0.0, "minor": 0.33, "moderate": 0.66, "major": 1.0
}
labor_violations_map = {
    "none": 0.0, "minor": 0.25, "moderate": 0.5, "major": 1.0
}
trade_policy_map = {
    "none": 0.0, "minor": 0.33, "moderate": 0.66, "major": 1.0
}

# ✅ Input schema
class RiskInput(BaseModel):
    In_Transit_Delays_Days: float
    War_Zone_Flag: float
    First_Pass_Yield: float
    ISO_Certification_Score: float
    Infrastructure_Disruption_Severity: float
    Legal_Disputes_Last_6_Months: float
    Govt_Sanctions_Penalties: str
    Product_Defect_Rate: float
    ESG: float
    Labor_Violations_6_months: str
    News_Sentiment_Score: float
    Natural_disaster_frequency_last_6_months: float
    Trade_policy_changes_tariffs_bans: str
    Adjusted_On_Time_Delivery_Rate: float
    Strike_Days: float
    email: str

# ✅ Health check route
@router.get("/")
def read_root():
    return {"message": "✅ Model API is running!"}

# ✅ Prediction endpoint
@router.post("/predict")
async def predict(input_data: RiskInput):
    try:
        # Convert input to dictionary
        data_dict = input_data.dict()
        email = input_data.email

        # Map categorical values
        data_dict["Govt_Sanctions_Penalties"] = govt_sanctions_map.get(
            data_dict["Govt_Sanctions_Penalties"].strip().lower(), 0.0
        )
        data_dict["Labor_Violations_6_months"] = labor_violations_map.get(
            data_dict["Labor_Violations_6_months"].strip().lower(), 0.0
        )
        data_dict["Trade_policy_changes_tariffs_bans"] = trade_policy_map.get(
            data_dict["Trade_policy_changes_tariffs_bans"].strip().lower(), 0.0
        )

        # Rename keys to match model feature names
        key_mapping = {
            "Labor_Violations_6_months": "Labor Violations (6 months)",
            "News_Sentiment_Score": "News Sentiment Score",
            "Natural_disaster_frequency_last_6_months": "Natural disaster frequency (last 6 months)",
            "Trade_policy_changes_tariffs_bans": "Trade policy changes (tariffs, bans)"
        }

        for api_key, model_key in key_mapping.items():
            data_dict[model_key] = data_dict.pop(api_key)

        # Now get features in order expected by the model
        input_features = [data_dict[feat] for feat in feature_order]

        df_input = pd.DataFrame([input_features], columns=feature_order)
        prediction = model.predict(df_input)

        output_labels = [
            'Quality_Risk_Score',
            'Logistics_Risk_Score',
            'Operational_Risk_Score',
            'Compliance_Legal_Risk_Score',
            'ESG_Risk_Score',
            'GeoPolitical_Risk_Score',
            'Overall_Risk_Score'
        ]

        # Create prediction result with lowercase keys
        result = {label.lower(): float(value) for label, value in zip(output_labels, prediction[0])}

        # Risk classification based on overall score
        overall_score = result['overall_risk_score']
        if overall_score < 33:
            classification = "Low"
        elif 33 <= overall_score <= 45:
            classification = "Medium"
        else:
            classification = "High"

        result['overall_risk_level'] = classification

        email_domain = email.split('@')[1]
        supplier = await db.suppliers.find_one({"email_domain": email_domain})
        
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")

        # Merge new subfactors with existing ones (if any)
        existing_subfactors = supplier.get("risk_subfactors", {})
        merged_subfactors = {**existing_subfactors, **result}
        
        update_fields = {
            "risk_subfactors": merged_subfactors,
            "risk_score": overall_score,
            "risk_level": classification
        }

        await db.suppliers.update_one(
            {"email_domain": email_domain},
            {"$set": update_fields}
        )

        return {"prediction": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Export router so main.py can include it

__all__ = ["router"]

