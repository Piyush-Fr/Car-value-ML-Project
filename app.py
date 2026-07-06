from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import pandas as pd
import os
import json

app = Flask(__name__)
CORS(app)

# Load model and columns
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, 'model.pkl')
columns_path = os.path.join(BASE_DIR, 'columns.pkl')

if os.path.exists(model_path) and os.path.exists(columns_path):
    model = joblib.load(model_path)
    model_columns = joblib.load(columns_path)
else:
    model = None
    model_columns = None
    print("Warning: model.pkl or columns.pkl not found at", BASE_DIR)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None or model_columns is None:
        return jsonify({'error': 'Model is not loaded.'}), 500
        
    try:
        data = request.json
        brand = data.get('brand', 'VW')
        car_model = data.get('car_model', '')
        mileage = float(data.get('mileage', 30000))
        car_age = float(data.get('car_age', 5))
        engine_size = float(data.get('engine_size', 1.6))
        transmission = data.get('transmission', 'Manual')
        fuel_type = data.get('fuel_type', 'Petrol')
        
        # Default features
        tax = 145
        mpg = 50.0
        
        mileage_per_year = mileage / car_age if car_age > 0 else 0
        
        # Build DataFrame with all expected columns initialized to 0
        df = pd.DataFrame(columns=model_columns, data=[[0]*len(model_columns)])
        
        df['mileage'] = mileage
        df['car_age'] = car_age
        df['engineSize'] = engine_size
        df['tax'] = tax
        df['mpg'] = mpg
        df['mileage_per_year'] = mileage_per_year
        
        # Set categorical values dynamically
        trans_col = f'transmission_{transmission}'
        if trans_col in df.columns:
            df[trans_col] = 1
            
        fuel_col = f'fuelType_{fuel_type}'
        if fuel_col in df.columns:
            df[fuel_col] = 1
            
        # Set the brand
        brand_col = f'brand_{brand}'
        if brand_col in df.columns:
            df[brand_col] = 1
            
        # Set the car model
        model_col = f'model_{car_model}'
        if model_col in df.columns:
            df[model_col] = 1
            
        # Predict
        prediction = model.predict(df)[0]
        
        return jsonify({'prediction': round(prediction, 0)})
        
    except Exception as e:
        print("Error during prediction:", e)
        return jsonify({'error': str(e)}), 400

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    try:
        metrics_path = os.path.join(BASE_DIR, 'metrics.json')
        with open(metrics_path, 'r') as f:
            metrics = json.load(f)
        return jsonify(metrics)
    except:
        return jsonify({"R2": "-", "MAE": "-", "RMSE": "-"})

@app.route('/api/compare', methods=['POST'])
def compare():
    if not model or not model_columns:
        return jsonify({'error': 'Model not loaded'}), 500
        
    try:
        data = request.json
        brand1 = data.get('brand1', 'VW')
        model1 = data.get('model1', 'Golf')
        brand2 = data.get('brand2', 'Audi')
        model2 = data.get('model2', 'A4')
        mileage = float(data.get('mileage', 30000))
        car_age = float(data.get('car_age', 5))
        engine_size = float(data.get('engine_size', 1.6))
        transmission = data.get('transmission', 'Manual')
        fuel_type = data.get('fuel_type', 'Petrol')
        
        tax = 145
        mpg = 50.0
        mileage_per_year = mileage / car_age if car_age > 0 else 0
        
        def build_df(brand, car_model):
            df = pd.DataFrame(columns=model_columns, data=[[0]*len(model_columns)])
            df['mileage'] = mileage
            df['car_age'] = car_age
            df['engineSize'] = engine_size
            df['tax'] = tax
            df['mpg'] = mpg
            df['mileage_per_year'] = mileage_per_year
            
            trans_col = f'transmission_{transmission}'
            if trans_col in df.columns:
                df[trans_col] = 1
                
            fuel_col = f'fuelType_{fuel_type}'
            if fuel_col in df.columns:
                df[fuel_col] = 1
                
            brand_col = f'brand_{brand}'
            if brand_col in df.columns:
                df[brand_col] = 1
                
            model_col = f'model_{car_model}'
            if model_col in df.columns:
                df[model_col] = 1
                
            return df
            
        df1 = build_df(brand1, model1)
        df2 = build_df(brand2, model2)
        
        pred1 = model.predict(df1)[0]
        pred2 = model.predict(df2)[0]
        
        return jsonify({
            'Slot1': round(pred1),
            'Slot2': round(pred2)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
