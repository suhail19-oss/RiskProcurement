from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the trained model
model = joblib.load("xgb_multioutput_model.pkl")

# Get feature names in proper order
feature_order = model.estimators_[0].feature_names_in_

# Define the categorical mappings
govt_sanctions_map = {
    "none": 0.0, "minor": 0.33, "moderate": 0.66, "major": 1.0
}
labor_violations_map = {
    "none": 0.0, "minor": 0.25, "moderate": 0.5, "major": 1.0
}
trade_policy_map = {
    "none": 0.0, "minor": 0.33, "moderate": 0.66, "major": 1.0
}

@app.route('/')
def home():
    return "✅ Model API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        if 'features' not in data:
            return jsonify({'error': "'features' key missing in request"}), 400

        input_features = data['features']

        if len(input_features) != 15:
            return jsonify({'error': f'Expected 15 features, but got {len(input_features)}'}), 400

        # Apply mappings to the respective categorical fields
        input_features[6] = govt_sanctions_map.get(str(input_features[6]).strip().lower(), 0.0)
        input_features[9] = labor_violations_map.get(str(input_features[9]).strip().lower(), 0.0)
        input_features[12] = trade_policy_map.get(str(input_features[12]).strip().lower(), 0.0)

        # Convert to DataFrame using feature_order
        df_input = pd.DataFrame([input_features], columns=feature_order)

        # Predict
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

        result = {label: float(value) for label, value in zip(output_labels, prediction[0])}

        # Classification for overall score
        overall_score = result['Overall_Risk_Score']
        if overall_score < 33:
            classification = "Low"
        elif 33 <= overall_score <= 45:
            classification = "Medium"
        else:
            classification = "High"

        result['Overall_Risk_Level'] = classification

        return jsonify({'prediction': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=10000)


