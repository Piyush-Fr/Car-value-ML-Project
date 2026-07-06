import pandas as pd
import numpy as np

def load_data():
    """Loads and concatenates the datasets for all supported brands."""
    brands = ['audi', 'vw', 'bmw', 'ford', 'hyundi', 'merc', 'skoda', 'toyota', 'vauxhall']
    brand_map = {'audi': 'Audi', 'vw': 'VW', 'bmw': 'BMW', 'ford': 'Ford', 
                 'hyundi': 'Hyundai', 'merc': 'Mercedes', 'skoda': 'Skoda', 
                 'toyota': 'Toyota', 'vauxhall': 'Vauxhall'}
    dfs = []
    
    for brand in brands:
        df_brand = pd.read_csv(f'dataset/{brand}.csv')
        df_brand['brand'] = brand_map[brand]
        
        # Standardize column names
        if 'tax(£)' in df_brand.columns:
            df_brand.rename(columns={'tax(£)': 'tax'}, inplace=True)
            
        dfs.append(df_brand)

    df = pd.concat(dfs, ignore_index=True)
    df['model'] = df['model'].astype(str).str.strip()
    
    # Drop rows with NaN in critical columns
    df.dropna(subset=['price', 'year', 'mileage', 'engineSize'], inplace=True)
    return df

def clean_data(df):
    """Removes outliers from the dataset."""
    df_cleaned = df[
        (df['engineSize'] != 0) &
        (df['price'] >= 500) &
        (df['price'] <= 100000)
    ].copy()
    return df_cleaned

def engineer_features(df):
    """Derives new features like car_age and mileage_per_year."""
    df['car_age'] = 2020 - df['year']
    df['mileage_per_year'] = df['mileage'] / df['car_age']
    
    df['mileage_per_year'] = df['mileage_per_year'].replace([float('inf')], 0)
    df['mileage_per_year'] = df['mileage_per_year'].fillna(0)
    return df

def get_prepared_data():
    """Runs load, clean, and feature engineering, and returns df, X, and y."""
    df = load_data()
    df = clean_data(df)
    df = engineer_features(df)
    
    y = df['price']
    X = df.drop(columns=['price', 'year'])
    X = pd.get_dummies(X, drop_first=True)
    
    return df, X, y
