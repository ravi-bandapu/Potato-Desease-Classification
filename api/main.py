from fastapi import FastAPI, File, UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS Configuration
origins = ["http://localhost", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
MODEL_PATH = "C:\\Potato desease\\training\\saved_models\\final_model2.keras"

MODEL = tf.keras.models.load_model(MODEL_PATH)
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

@app.get("/ping")
async def ping():
    return {"message": "Hello, I am alive"}

def read_file_as_image(data) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert("RGB").resize((256, 256))
    return np.array(image) / 255.0  # Normalize

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    bytes_data = await file.read()
    image = read_file_as_image(bytes_data)

    img_batch = np.expand_dims(image, axis=0)  # Add batch dimension

    predictions = MODEL.predict(img_batch)
    
    print("Raw Predictions:", predictions)  # Debugging line

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = float(np.max(predictions[0]))

    return {'class': predicted_class, 'confidence': confidence}

if __name__ == "__main__":
    uvicorn.run(app, host='127.0.0.1', port=8000)
