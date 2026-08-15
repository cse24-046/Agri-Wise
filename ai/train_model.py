import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib


# 1. Load the dataset
data = pd.read_csv("Crop_recommendation.csv")


# 2. Separate features (X) and target (y)
X = data[
    [
        "N",
        "P",
        "K",
        "temperature",
        "humidity",
        "ph",
        "rainfall"
    ]
]

y = data["label"]


# 3. Split the dataset into training and testing data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# 4. Create the Random Forest model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)


# 5. Train the model
model.fit(X_train, y_train)


# 6. Make predictions on the test data
y_pred = model.predict(X_test)


# 7. Evaluate the model
accuracy = accuracy_score(y_test, y_pred)

print("\nModel Accuracy:")
print(f"{accuracy * 100:.2f}%")


print("\nClassification Report:")
print(classification_report(y_test, y_pred))


# 8. Save the trained model
joblib.dump(model, "crop_recommendation_model.pkl")

print("\nModel saved successfully!")
print("File: crop_recommendation_model.pkl")
