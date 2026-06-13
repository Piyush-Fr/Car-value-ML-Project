import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.model_selection import GridSearchCV
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


df['car_age'] = 2020 - df['year']
df['mileage_per_year'] = df['mileage'] / df['car_age']

df['mileage_per_year'] = df['mileage_per_year'].replace([float('inf')], 0)
df['mileage_per_year'] = df['mileage_per_year'].fillna(0)

y = df['price']
X = df.drop(columns=['price','year','model'])
X = pd.get_dummies(X , drop_first=True)



#Linear Regression
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size= 0.2, #20% for testing, 80% for training
    random_state=42  #fixes the random split so results are reproducible
)

print(f'Training set:  {X_train.shape[0]:,} rows')
print(f'Test set:      {X_test.shape[0]:,} rows')

lr = LinearRegression()
lr.fit(X_train, y_train)

def evaluate(name, y_true, y_pred):
    r2 = r2_score(y_true, y_pred)
    mae = mean_absolute_error(y_true, y_pred)
    rmse= np.sqrt(mean_squared_error(y_true, y_pred))
    print(f'\n{name}')
    print(f'R2 = {r2:.4f}  ({r2 * 100:.1f}% of variance explained)')
    print(f'MAE = {mae:.0f}')
    print(f'RMSE = {rmse:.0f}')
    return {'R2': round(r2,4), 'MAE': round(mae,0), 'RMSE': round(rmse,0)}

lr_results = evaluate('Linear Regression', y_test, lr.predict(X_test))



#Random forest
rf = RandomForestRegressor(
    n_estimators= 100,
    random_state= 42,
    n_jobs= -1
)

rf.fit(X_train, y_train)
rf_results = evaluate('Random Forest', y_test, rf.predict(X_test))


#Comparison table
comparison = pd.DataFrame({
    'Model':   ['Linear Regression', 'Random Forest'],
    'R2':      [lr_results['R2'],  rf_results['R2']],
    'MAE (£)': [lr_results['MAE'], rf_results['MAE']],
    'RMSE (£)':[lr_results['RMSE'],rf_results['RMSE']],
})
print(comparison.to_string(index=False))

#Feature Importance chart of Top 15 from Random Forest

fig, ax = plt.subplots(figsize=(10, 6))

importance = pd.Series(rf.feature_importances_, index = X.columns)
top15 = importance.sort_values(ascending=True).tail(15)
top15.plot(kind = 'barh', ax=ax, color='steelblue')

ax.set_title('Top 15 Feature Importances - Random Forest', fontsize=14, fontweight='bold')
ax.set_xlabel('Importance')
plt.tight_layout()
plt.show()

#Hyperparamete tuning with GridSearchCV

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 10, 20],
}

rf_base = RandomForestRegressor(random_state=42, n_jobs=-1)

grid_search= GridSearchCV(
    estimator= rf_base,
    param_grid= param_grid,
    cv= 3,
    n_jobs= -1,
    verbose= 2
)

print("\n Starting Grid Search....")
grid_search.fit(X_train,y_train)
print(f'Best parametrs found: {grid_search.best_params_}')
best_rf = grid_search.best_estimator_

tuned_rf = evaluate('Tuned Random Forest', y_test, best_rf.predict(X_test))


#Businees Impact & Summary
