# PlantPulse
A Plant Disease Detector made using tensorflowjs and node js

## Setup
1. Unzip and open convmod and open folders that come up until you see bin files.
2. Open terminal here and type serve -p 5000 (make sure you have http-server installed as -g from npm)
3. Next, open this folder (PlantPulse), open terminal from here and type npm install then npm run dev
4. Next, in any browser (pref. chrome) open http://localhost:3000/

## Workflow + Tech Stack

## Model 
1. Used VGG19 model as our base model from the Keras library
2. Used basic image preprocessing techniques (image size=(256,256), batch_size=32)
3. Trained it on our own dataset of size 80k+ files.

## Backend and Frontend    
### Backend
1. We decided to load our model directly inside the backend using tensorflowjs as it allowed us to have a single server for dealing with uploads, inference with the model as well as sending data to frontend.
2. The initial step was to acquire our trained model keras file and then convert it to .json which included all the weights of the model.
3. We found that the best and safest way to convert is to use google colab in-built terminal as our local machines were throwing a lot of errors which were tough to troubleshoot.
4. The tensorflowjs_converter module allowed us to convert our initial model.h5 file to model.json file with output format being tfjs graph model as graph model is much faster than layers model and our objective was to only have inference with the model.
5. Node JS and Express JS were used with tensorflowjs in order to load the model and generate ejs to dynamically render our frontend for the user.
6. We also processed the pixel data sent by the frontend and processed the predictions to correctly show the disease name.
7. After getting our desired output, we also attached some information regarding that disease to be sent as json data to the frontend.  
### Frontend
1. Provide the ability to either drag and drop or select an image file.
2. The pre-processing of the image pixel data takes place in the frontend.
3. While the server is processing, we show some quotes etc.
4. After getting the response, we display the information with disease name, the picture of the plant leaf and the information for that disease.
   

## Limitations
1. The model is slow and its accuraccy is 75%.
2. Only accepts a single image as input and not a group of images.
   
## Future Steps
1. Integrate a frontend framework to allow package integration more smoothly instead of relying on CDN links.
2. Create About Us page and add internal routing for easy page navigation.
3. Integrate tfjs-node package either in a virtual machine or local machine to smoothly load the model and inccrease the speed of processing.
4. Create a secondary flask server to load future versions of the model in order to scale the backend better and maintain encapsulation and abstraction.
5. Improving the accuraccy even further by testing more neural networks.

