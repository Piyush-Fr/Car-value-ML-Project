# Used Car Price Prediction - My First ML Project

Welcome to my **very first Machine Learning project**!

In this project, I explore various used car datasets (like Audi and VW) to build predictive models that estimate the price of a used car based on its features such as age, mileage, engine size, mpg, and transmission type.

## Tech Stack & Libraries
* **Language:** Python
* **Data Manipulation:** `pandas`, `numpy`
* **Data Visualization:** `matplotlib`, `seaborn`
* **Machine Learning:** `scikit-learn`

## Project Structure
* `data-exploration.py`: Exploratory Data Analysis (EDA) of the car datasets.
* `feature_engineering.py`: Data cleaning and feature engineering (e.g., calculating car age and mileage per year).
* `LR_RF.py`: Model training, evaluation, and hyperparameter tuning. Compares multiple models.
* `dataset/`: Contains the CSV files for different car manufacturers (Audi, VW, BMW, Mercedes, etc.).

## Machine Learning Models
I trained and compared two different models:
1. **Linear Regression** - To understand the baseline linear relationships.
2. **Random Forest Regressor** - To capture complex, non-linear relationships, yielding higher accuracy. Also used `GridSearchCV` for hyperparameter tuning.

## Evaluation Metrics
The models are evaluated using:
* **R² (R-Squared)**
* **MAE (Mean Absolute Error)**
* **RMSE (Root Mean Squared Error)**

## What I Learned
* How to clean and preprocess real-world tabular data.
* Creating new relevant features (Feature Engineering).
* One-Hot Encoding for categorical variables.
* Splitting data into training and testing sets.
* Training, comparing, and tuning regression models.
* Interpreting Feature Importances (e.g., year/age and engine size heavily affect price).
