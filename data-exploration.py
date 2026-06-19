
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
from data_preprocessing import load_data
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

#Plotting data
fig, axes = plt.subplots(1, 2, figsize= (14, 4))

plt.subplot(1, 2, 1)
plt.hist(df['price'], bins=50, color= 'blue')
plt.title('Price Distribution')
plt.xlabel('Price (£)')

plt.subplot(1, 2, 2)
plt.hist(df['mileage'], bins=50, color= 'green')
plt.title('Mileage Distribution')
plt.xlabel('Mileage')

plt.tight_layout()
plt.show()


#Corelation Heatmap
corr_matrix= df.corr(numeric_only= True)

fig, ax = plt.subplots(figsize=(8, 6))

sns.heatmap(
    corr_matrix,
    annot= True,
    fmt='.2f',
    cmap='coolwarm'
)

plt.title('Correlation Heatmap')
plt.show()

#Scatter Plot
fig, axes = plt.subplots(1, 3, figsize=(18, 5))

plt.subplot(2, 2, 1)  
plt.scatter(df['year'], df['price'])
plt.title('Price vs Year')
plt.xlabel('Year')
plt.ylabel('Price (£)')

plt.subplot(2, 2, 2)  # position 2
plt.scatter(df['mileage'], df['price'])
plt.title('Price vs Mileage')
plt.xlabel('Mileage')
plt.ylabel('Price (£)')

plt.subplot(2, 2, 3)
plt.scatter(df['engineSize'], df['price'])
plt.title('Price vs Engine Size')
plt.xlabel('Engine Size')
plt.ylabel('Price (£)')

plt.subplot(2, 2, 4)  
sns.boxplot(x='brand', y='price', data=df)
plt.title('Price by Brand')

plt.tight_layout()
plt.show()

# Audi and VW Comparison
fig, ax = plt.subplots(figsize=(8, 5))

sns.boxplot(x='brand', y='price', data=df)
plt.title('Price by Brand - Audi vs VW')
plt.xlabel('Brand')
plt.ylabel('Price (£)')

plt.tight_layout()
plt.show()




#ML Model of Linear Regression for Price vs Mileage (not optimal output)




#1 defining input

x = df[['mileage']] #double brackets = 2D array
y = df['price']     #single brackets = 1D array


#2 Splitting data for Training and Testing

x_train, x_test, y_train, y_test = train_test_split(
    x, y,
    train_size= 0.2, #20% for testing, 80% for training
    random_state=42  #fixes the random split so results are reproducible
)

#3 Create and train the model
model = LinearRegression()
model.fit(x_train, y_train) 


#4 Prediction
prediction = model.predict(x_test)


#5 MAE Calculation

mae = mean_absolute_error(y_test, prediction)
print(f"MAE: £{mae:,.2f}")

#This Predicts bad MAE which we are going to fix in Feature Engineering using R^2
