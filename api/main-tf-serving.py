from fastapi import FastAPI,File,UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image #pillow module is used to read images in python
import tensorflow as tf
import keras
import requests




app = FastAPI()
MODEL= keras.layers.TFSMLayer("../saved_models/1", call_endpoint="serving_default")
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

@app.get("/ping")
async def ping():
    return "Hello, I am alive"


def read_file_as_image(data) -> np.ndarray:
    image=np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):  #the input should be image or file of potato but dont give int or other
    bytes= await file.read()                   # read data into byets then need to convert bytes into numpy array so my model will predict that
    image = read_file_as_image(bytes)  #it will return numpy array  #see why we have used async and await in yt
    img_batch = np.expand_dims(image, 0)  #the predict expects batch of images but image gives 1d array like [256,256,3] so using expand dimes it adds another dim like [[256,256,3]]
    
    predictions = MODEL.predict(img_batch)  #it returns something like this [[1.29....e-09,9.9...,1.48...]]  represents these values ["Early Blight", "Late Blight", "Healthy"]
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])] #[[1.29....e-09,9.9...,1.48...]]  highest is 1st index value so it return 1 that is late blight will be answer
    confidence = np.max(predictions[0]) # [0.00056,0.99,0.00067] return 0.99
    
    return {
        'class' : predicted_class,
        'confidence' : float(confidence)
    }
    
                   


if __name__=="__main__":
    uvicorn.run(app, host='localhost', port=8000)