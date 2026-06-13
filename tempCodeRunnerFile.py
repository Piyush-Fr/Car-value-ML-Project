
#Model Loading
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

lr_result = evaluate('Linear Regression', y_test, lr.predict(X_test))