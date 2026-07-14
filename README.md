# MONOVALUATION
Advanced Vehicle Valuation Engine

Monovaluation is a high-performance machine learning platform designed to calculate precise market valuations for vehicles. By leveraging a comprehensive dataset of over 100,000 historical automotive records, the engine provides immediate, AI-driven price estimations, vehicle comparisons, and granular value driver ablations.

## System Architecture

The platform operates on a decoupled architecture, utilizing a Next.js React frontend for the user interface and a Python Flask backend for model inference and data processing.

```mermaid
graph LR
    subgraph Client
        A[User Interface]
        B[Next.js App Router]
    end
    
    subgraph Server
        C[Flask REST API]
        D[Scikit-Learn Engine]
    end
    
    subgraph Data
        E[(Historical Market Data)]
        F[(Pre-trained Models)]
    end

    A -->|HTTPS Requests| B
    B -->|REST/JSON| C
    C -->|Feature Vector| D
    D -->|Prediction & Ablation| C
    E -.->|Training Phase| D
    F -.->|Weights Loading| D
```

## Machine Learning Pipeline

The valuation engine is built upon a Random Forest Regressor ensemble model. It excels at capturing complex, non-linear relationships within the automotive market, such as the compounding depreciation effects of mileage and vehicle age.

```mermaid
flowchart TD
    A[Raw Vehicle Input] --> B[Categorical Encoding]
    A --> C[Numerical Scaling]
    
    B --> D{Feature Concatenation}
    C --> D
    
    D --> E[Random Forest Regressor]
    
    subgraph Ensemble Inference
        E --> F[Decision Tree 1]
        E --> G[Decision Tree 2]
        E --> H[Decision Tree N]
    end
    
    F --> I[Average Aggregation]
    G --> I
    H --> I
    
    I --> J[Baseline Price Prediction]
    
    J --> K[Ablation Analysis]
    K --> L[Feature Contribution Weights]
```

## Data Processing Workflow

The integrity of the machine learning model relies on rigorous data processing. The raw dataset, comprising over 100,000 records from manufacturers such as Audi, BMW, Mercedes, and VW, is engineered to prevent data leakage and maximize feature correlation.

```mermaid
flowchart TD
    A[(Raw CSV Datasets)] --> B[Data Aggregation]
    B --> C[Missing Value Imputation]
    
    C --> D[Feature Engineering]
    D -.->|Derive| E[Vehicle Age]
    D -.->|Derive| F[Mileage Per Year]
    
    D --> G[Outlier Removal]
    
    G --> H{Train/Test Split}
    
    H -->|80%| I[Training Set]
    H -->|20%| J[Validation Set]
    
    I --> K[Model Training]
    J --> L[Model Evaluation]
    
    L --> M[Hyperparameter Tuning]
    M --> K
```

## Core Features

- Estimator: Calculates the precise market value of a single vehicle based on make, model, age, mileage, and engine size.
- Comparison: Analyzes two vehicles head-to-head to determine differing brand premiums and specification valuations.
- Value Drivers: Deconstructs the final price using ablation technology to isolate exactly how much value is added or lost due to specific features.
- Market Insights: Explores macro trends across the dataset, visualizing brand distributions and average price depreciation curves.

## Technology Stack

- Frontend: Next.js, React, Tailwind CSS, Framer Motion
- Backend: Python, Flask
- Machine Learning: Scikit-Learn, Pandas, NumPy
- Deployment: Vercel (Frontend), Render (Backend)
