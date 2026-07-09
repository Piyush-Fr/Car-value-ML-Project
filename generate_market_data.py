import os
import json
import pandas as pd
from data_preprocessing import load_data, clean_data, engineer_features

def generate_market_data():
    print("Loading data...")
    df = load_data()
    df = clean_data(df)
    df = engineer_features(df)
    
    brands = df['brand'].unique().tolist()
    brand_data = {}
    
    for b in brands:
        print(f"  Processing {b}...")
        df_brand = df[df['brand'] == b]
        
        # Depreciation Curve: Median price by car_age
        df_dep = df_brand[(df_brand['car_age'] >= 0) & (df_brand['car_age'] <= 20)]
        depreciation_curve = df_dep.groupby('car_age')['price'].median().reset_index()
        depreciation_curve = depreciation_curve.rename(columns={'car_age': 'age', 'price': 'median_price'})
        depreciation_curve = depreciation_curve.sort_values('age')
        
        # Market Scatter: Price vs Mileage (sample up to 200 per brand)
        df_scatter = df_brand[(df_brand['mileage'] >= 0) & (df_brand['mileage'] <= 150000)]
        if len(df_scatter) > 200:
            df_scatter = df_scatter.sample(n=200, random_state=42)
        
        brand_data[b] = {
            'depreciation': depreciation_curve.to_dict('records'),
            'scatter': df_scatter[['mileage', 'price']].to_dict('records')
        }
    
    # Also build an "All Brands" aggregate
    print("  Processing All Brands aggregate...")
    df_dep_all = df[(df['car_age'] >= 0) & (df['car_age'] <= 20)]
    dep_all = df_dep_all.groupby('car_age')['price'].median().reset_index()
    dep_all = dep_all.rename(columns={'car_age': 'age', 'price': 'median_price'}).sort_values('age')
    
    df_scatter_all = df[(df['mileage'] >= 0) & (df['mileage'] <= 150000)]
    if len(df_scatter_all) > 1000:
        df_scatter_all = df_scatter_all.sample(n=1000, random_state=42)
    
    brand_data['All Brands'] = {
        'depreciation': dep_all.to_dict('records'),
        'scatter': df_scatter_all[['mileage', 'price', 'brand']].to_dict('records')
    }
    
    market_data = {
        'brands': sorted([b for b in brands]),
        'data': brand_data
    }
    
    out_path = os.path.join(os.path.dirname(__file__), 'market_data.json')
    with open(out_path, 'w') as f:
        json.dump(market_data, f)
        
    print(f"Successfully generated {out_path} with data for {len(brands)} brands + All Brands aggregate.")

if __name__ == '__main__':
    generate_market_data()
