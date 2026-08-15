import joblib
import pandas as pd

# Load the trained model
model = joblib.load("crop_recommendation_model.pkl")


def predict_crop(N, P, K, temperature, humidity, ph, rainfall):

    # Create input using the same feature names used during training
    input_data = pd.DataFrame([{
        "N": N,
        "P": P,
        "K": K,
        "temperature": temperature,
        "humidity": humidity,
        "ph": ph,
        "rainfall": rainfall
    }])

    # Predict crop
    prediction = model.predict(input_data)

    # Get prediction probabilities
    probabilities = model.predict_proba(input_data)

    confidence = max(probabilities[0]) * 100

    return {
        "crop": prediction[0],
        "confidence": round(confidence, 2)
    }


# Test the model
if __name__ == "__main__":

    result = predict_crop(
        N=90,
        P=42,
        K=43,
        temperature=25.5,
        humidity=80,
        ph=6.5,
        rainfall=200
    )

    print("🌱 AgriWise Recommendation")
    print("Recommended crop:", result["crop"])
    print("Confidence:", result["confidence"], "%")
