import pandas as pd
import numpy as np
import joblib
from xgboost import XGBRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

# STEP 1: Load data
df = pd.read_excel("Book1.xlsx")
df.columns = df.columns.str.strip()

# STEP 2: Define mappings for categorical features
govt_sanctions_map = {
    "none": 0.0, "minor": 0.33, "moderate": 0.66, "major": 1.0, "": 0.0, None: 0.0
}
labor_violations_map = {
    "none": 0.0, "minor": 0.25, "moderate": 0.5, "major": 1.0, "": 0.0, None: 0.0
}
trade_policy_map = {
    "none": 0.0, "minor": 0.33, "moderate": 0.66, "major": 1.0, "": 0.0, None: 0.0
}

# STEP 3: Map and clean categorical fields
cat_map_dict = {
    'Govt_Sanctions_Penalties': govt_sanctions_map,
    'Labor Violations (6 months)': labor_violations_map,
    'Trade policy changes (tariffs, bans)': trade_policy_map
}

for col, mapping in cat_map_dict.items():
    df[col] = df[col].astype(str).str.encode('ascii', 'ignore').str.decode('ascii')
    df[col] = df[col].str.strip().str.lower()
    df[col] = df[col].map(mapping).fillna(0.0)

# STEP 4: Define input features
features = list(set([
    'In_Transit_Delays_Days',
    'War_Zone_Flag',
    'First_Pass_Yield',
    'ISO_Certification_Score',
    'Infrastructure_Disruption_Severity',
    'Legal_Disputes_Last_6_Months',
    'Govt_Sanctions_Penalties',
    'Product_Defect_Rate',
    'ESG',
    'Labor Violations (6 months)',
    'News Sentiment Score',
    'Natural disaster frequency (last 6 months)',
    'Trade policy changes (tariffs, bans)',
    'Adjusted_On_Time_Delivery_Rate',
    'Strike_Days'
]))

# STEP 5: Add Overall_Risk_Score to targets
targets = [
    'Quality_Risk_Score',
    'Logistics_Risk_Score',
    'Operational_Risk_score',
    'Compliance_legal_risk_score',
    'ESG_Risk_Score',
    'GeoPolitical_Risk_Score',
    'Overall_Risk_Score'  # ✅ Included here
]

# STEP 6: Handle missing values
df[features] = df[features].apply(pd.to_numeric, errors='coerce')
df[features] = df[features].fillna(0)
df = df.dropna(subset=targets)

print("✅ Rows available after cleaning:", len(df))

X = df[features]
y = df[targets]

# STEP 7: Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# STEP 8: Train XGBoost Multi-Output Regressor
xgb = XGBRegressor(
    n_estimators=200,
    max_depth=4,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.1,
    reg_lambda=1.0,
    random_state=42
)

model = MultiOutputRegressor(xgb)
model.fit(X_train, y_train)

# STEP 9: Evaluate
y_train_pred = model.predict(X_train)
y_test_pred = model.predict(X_test)

train_r2 = r2_score(y_train, y_train_pred)
test_r2 = r2_score(y_test, y_test_pred)

print("\n📊 XGBoost Multi-Output R² Scores (with Regularization)")
print("Train R²:", round(train_r2, 4))
print("Test  R²:", round(test_r2, 4))

# STEP 10: Save the trained model
joblib.dump(model, "xgb_multioutput_model.pkl")
print("\n✅ Model saved as 'xgb_multioutput_model.pkl'")

