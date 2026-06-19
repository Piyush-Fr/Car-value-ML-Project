import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import warnings
import os
warnings.filterwarnings('ignore')

plt.rcParams.update({'figure.dpi': 120, 'axes.spines.top': False, 'axes.spines.right': False})
sns.set_palette('muted')

print('Libraries loaded successfully.')

try:
    import IPython.display
    from IPython.display import display

except ImportError:
    pass
# Data Loading
from data_preprocessing import load_data, clean_data, engineer_features

df = load_data()

vw_df = df[df['brand'] == 'VW']
audi_df = df[df['brand'] == 'Audi']

# Quick sanity check
print('=== VW Dataset ===')
print(f'Shape: {vw_df.shape}')
display(vw_df.head(3))

print('\n=== Audi Dataset ===')
print(f'Shape: {audi_df.shape}')
display(audi_df.head(3))

print(df.info())
print(df.describe())

#Outlier Removal

before = len(df)

df = df[
    (df['engineSize'] != 0) &
    (df['price'] >= 500) &
    (df['price'] <= 100000)
]

after = len(df)

print(f'Removed {before - after:,} row {before:,} -> {after:,}')
assert df['engineSize'].min() > 0 
assert df['price'].min() >= 50
assert df['price'].max() <= 100000
print ('Outliers Removed !')

#Derive Car Age and Mileage per year

df['car_age'] = 2020 - df['year']
df['mileage_per_year'] = df['mileage'] / df['car_age']

df['mileage_per_year'] = df['mileage_per_year'].replace([float('inf')], 0)
df['mileage_per_year'] = df['mileage_per_year'].fillna(0)

assert 'car_age' in df.columns
assert 'mileage_per_year' in df.columns
assert df['mileage_per_year'].isna().sum() == 0
print(f'Car Age {df["car_age"].min():.0f} --> {df["car_age"].max():.0f} ')
print('Car Age and Mileage Derived')

#One-Hot Encode Categoricals Encode

y = df['price']
X = df.drop(columns=['price','year','model'])
X = pd.get_dummies(X , drop_first=True)

assert 'X' in dir()
assert 'price' not in X.columns
assert X.isna().sum().sum() == 0

print(f'Feature matrix X: {X.shape[0]:,} rows x {X.shape[1]} features')
print(f'Target y: min=£{y.min():,.0f}  max=£{y.max():,.0f}  mean=£{y.mean():,.0f}')