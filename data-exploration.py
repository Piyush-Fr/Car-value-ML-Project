
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
    def proov_tick(task_id):
        IPython.display.display(IPython.display.Javascript(f'window.parent.postMessage({{ type: "PROOV_CHECKPOINT", checkpoint: "{task_id}" }}, "*");'))
    proov_tick('setup_complete')
except ImportError:
    pass

# Data Loading
# Load local CSV files
audi_df = pd.read_csv('dataset/audi.csv')
audi_df['brand'] = 'Audi'

vw_df = pd.read_csv('dataset/vw.csv')
vw_df['brand'] = 'VW'

# Combine the datasets
df = pd.concat([audi_df, vw_df], ignore_index=True)

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
