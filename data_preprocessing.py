import pandas as pd
import numpy as np

def load_data():
    """Loads and concatenates the Audi and VW datasets."""
    audi_df = pd.read_csv('dataset/audi.csv')
    audi_df['brand'] = 'Audi'

    vw_df = pd.read_csv('dataset/vw.csv')
    vw_df['brand'] = 'VW'

    df = pd.concat([audi_df, vw_df], ignore_index=True)
    df['model'] = df['model'].str.strip()
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
