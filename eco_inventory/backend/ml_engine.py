import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime, timedelta

class SalesForecaster:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.is_trained = False
        
    def generate_synthetic_data(self, products, days=90):
        """
        Since we don't have real history, we simulate 3 months of sales data
        based on the 'theoretical' velocity of each product + random noise/seasonality.
        """
        data = []
        
        for product in products:
            # Base velocity (mocked as 'popularity')
            base_sales = 5 if product.carbon_footprint_weight < 15 else 2
            
            # Category Encoding (Simple Hash for prototype)
            cat_code = hash(product.category) % 100
            
            current_date = datetime.now() - timedelta(days=days)
            
            for i in range(days):
                date = current_date + timedelta(days=i)
                day_of_year = date.timetuple().tm_yday
                weekday = date.weekday()
                
                # Seasonality: Sell more on weekends (5,6)
                weekend_boost = 1.5 if weekday >= 5 else 1.0
                
                # Seasonality: Random Trend
                trend = np.sin(day_of_year / 365 * 2 * np.pi) * 2 
                
                # Daily Sales = Base * Weekend * Trend + Noise
                sales = max(0, (base_sales * weekend_boost) + trend + np.random.normal(0, 1))
                
                data.append({
                    'product_id': product.id,
                    'price': product.price,
                    'category_code': cat_code,
                    'day_of_year': day_of_year,
                    'is_weekend': 1 if weekday >= 5 else 0,
                    'sales_quantity': round(sales)
                })
                
        return pd.DataFrame(data)

    def train(self, products):
        """
        Train the model on the synthetic history.
        """
        print("AI: Generating synthetic training data...")
        df = self.generate_synthetic_data(products)
        
        X = df[['product_id', 'price', 'category_code', 'day_of_year', 'is_weekend']]
        y = df['sales_quantity']
        
        print(f"AI: Training Random Forest on {len(df)} records...")
        self.model.fit(X, y)
        self.is_trained = True
        print("AI: Training Complete.")
        
    def predict_next_week(self, product):
        """
        Predict total sales for the next 7 days.
        """
        if not self.is_trained:
            return 0
            
        cat_code = hash(product.category) % 100
        current_date = datetime.now()
        
        total_forecast = 0
        
        for i in range(7):
            date = current_date + timedelta(days=i)
            day_of_year = date.timetuple().tm_yday
            weekday = date.weekday()
            
            # Feature Vector
            features = pd.DataFrame([{
                'product_id': product.id,
                'price': product.price,
                'category_code': cat_code,
                'day_of_year': day_of_year,
                'is_weekend': 1 if weekday >= 5 else 0
            }])
            
            daily_pred = self.model.predict(features)[0]
            total_forecast += max(0, daily_pred)
            
        return round(total_forecast, 1)

# Singleton Instance
forecaster = SalesForecaster()
