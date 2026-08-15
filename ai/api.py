from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd


# Create the API
app = FastAPI(
    title="AgriWise AI API",
    description="AI-powered crop recommendation service",
    version="1.0"
)


# Load the trained model
model = joblib.load("crop_recommendation_model.pkl")


# Define the data we expect from the frontend
class FarmData(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


# Test endpoint
@app.get("/")
def home():
    return {
        "message": "AgriWise AI API is running 🌱"
    }


# Crop recommendation endpoint
@app.post("/predict")
def predict(data: FarmData):

    input_data = pd.DataFrame([{
        "N": data.N,
        "P": data.P,
        "K": data.K,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "ph": data.ph,
        "rainfall": data.rainfall
    }])

    # Make prediction
    prediction = model.predict(input_data)[0]

    # Get prediction probabilities
    probabilities = model.predict_proba(input_data)[0]

    # Get confidence
    confidence = max(probabilities) * 100

    return {
        "recommended_crop": prediction,
        "confidence": round(confidence, 2)
    }
