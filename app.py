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
model_path = os.path.join(BASE_DIR, 'lr_model.pkl')
columns_path = os.path.join(BASE_DIR, 'columns.pkl')

load_error = None

if os.path.exists(model_path) and os.path.exists(columns_path):
    try:
        model = joblib.load(model_path)
        model_columns = joblib.load(columns_path)
    except Exception as e:
        model = None
        model_columns = None
        load_error = str(e)
        print("Error loading model:", e)
else:
    model = None
    model_columns = None
    load_error = f"Files not found. model.pkl: {os.path.exists(model_path)}, columns.pkl: {os.path.exists(columns_path)}"
    print("Warning: model.pkl or columns.pkl not found at", BASE_DIR)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None or model_columns is None:
        try:
            files = os.listdir(BASE_DIR)
        except Exception as e:
            files = str(e)
        return jsonify({'error': f'Model is not loaded. Error: {load_error}. Files: {files}'}), 500
        
    try:
        data = request.json
        brand = data.get('brand', 'VW')
        car_model = data.get('car_model', '')
        mileage = float(data.get('mileage', 30000))
        car_age = float(data.get('car_age', 5))
        engine_size = float(data.get('engine_size', 1.6))
        transmission = data.get('transmission', 'Manual')
        fuel_type = data.get('fuel_type', 'Petrol')
        
        mileage_per_year = mileage / car_age if car_age > 0 else 0
        
        # Build DataFrame with all expected columns initialized to 0
        df = pd.DataFrame(columns=model_columns, data=[[0]*len(model_columns)])
        
        df['mileage'] = mileage
        df['car_age'] = car_age
        df['engineSize'] = engine_size
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
        engine_size1 = float(data.get('engine_size1', 1.6))
        transmission1 = data.get('transmission1', 'Manual')
        fuel_type1 = data.get('fuel_type1', 'Petrol')
        
        engine_size2 = float(data.get('engine_size2', 1.6))
        transmission2 = data.get('transmission2', 'Manual')
        fuel_type2 = data.get('fuel_type2', 'Petrol')
        
        mileage_per_year = mileage / car_age if car_age > 0 else 0
        
        def build_df(brand, car_model, engine_size, transmission, fuel_type):
            df = pd.DataFrame(columns=model_columns, data=[[0]*len(model_columns)])
            df['mileage'] = mileage
            df['car_age'] = car_age
            df['engineSize'] = engine_size
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
            
        df1 = build_df(brand1, model1, engine_size1, transmission1, fuel_type1)
        df2 = build_df(brand2, model2, engine_size2, transmission2, fuel_type2)
        
        pred1 = model.predict(df1)[0]
        pred2 = model.predict(df2)[0]
        
        return jsonify({
            'Slot1': round(pred1),
            'Slot2': round(pred2)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/value_drivers', methods=['POST'])
def value_drivers():
    try:
        data = request.get_json()
        target_brand = data.get('brand')
        target_model = data.get('car_model')
        target_engine = float(data.get('engine_size'))
        target_fuel = data.get('fuel_type')
        target_trans = data.get('transmission')
        target_age = int(data.get('car_age'))
        target_mileage = int(data.get('mileage'))
        
        def get_pred(brand, model_name, engine, fuel, trans, age, mileage):
            df = pd.DataFrame(0, index=[0], columns=model_columns)
            df['engineSize'] = engine
            df['car_age'] = age
            df['mileage'] = mileage
            df['mileage_per_year'] = mileage / max(age, 1)
            
            if f'transmission_{trans}' in df.columns:
                df[f'transmission_{trans}'] = 1
            if f'fuelType_{fuel}' in df.columns:
                df[f'fuelType_{fuel}'] = 1
            if f'brand_{brand}' in df.columns:
                df[f'brand_{brand}'] = 1
            if f'model_{model_name}' in df.columns:
                df[f'model_{model_name}'] = 1
                
            return float(model.predict(df)[0])
            
        p0 = get_pred('VW', 'Golf', 1.0, 'Petrol', 'Manual', 15, 150000)
        p1 = get_pred(target_brand, target_model, 1.0, 'Petrol', 'Manual', 15, 150000)
        p2 = get_pred(target_brand, target_model, target_engine, 'Petrol', 'Manual', 15, 150000)
        p3 = get_pred(target_brand, target_model, target_engine, target_fuel, target_trans, 15, 150000)
        p4 = get_pred(target_brand, target_model, target_engine, target_fuel, target_trans, target_age, 150000)
        p5 = get_pred(target_brand, target_model, target_engine, target_fuel, target_trans, target_age, target_mileage)
        
        drivers = [
            {"name": f"{target_brand} premium", "value": round(p1 - p0), "description": f"{target_brand} brand/model impact"},
            {"name": "Engine size", "value": round(p2 - p1), "description": f"Impact of {target_engine}L engine"},
            {"name": "Gearbox & Fuel", "value": round(p3 - p2), "description": f"Impact of {target_trans} {target_fuel}"},
            {"name": "Vehicle age", "value": round(p4 - p3), "description": f"Impact of being {target_age} years old"},
            {"name": "Mileage", "value": round(p5 - p4), "description": f"Impact of {target_mileage} miles"}
        ]
        
        return jsonify({
            'base_price': round(p0),
            'total_price': round(p5),
            'drivers': drivers
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/market-data', methods=['GET'])
def get_market_data():
    try:
        data_path = os.path.join(BASE_DIR, 'market_data.json')
        if not os.path.exists(data_path):
            return jsonify({'error': 'Market data not found. Run generate_market_data.py first.'}), 404
        with open(data_path, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':

    app.run(debug=True)
