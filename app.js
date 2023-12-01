const express = require("express");
const PORT = 3000;
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const tf = require("@tensorflow/tfjs");
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const getDisease = require('./config/disease.js')
app.use(express.static('public'))
app.use(expressLayouts);
app.set('view-engine', 'ejs');
app.set('layout', './layouts/layout.ejs');

// getting data from user- also include cors and how to receive image data from user
app.use(cors())
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit based on your needs
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(fileUpload());
// setting up the model.json
let model = undefined;
async function loadModel() {
   
    //const modelPath = "file:///C:/Users/Aarat Batra/Dropbox/PC/Desktop/dogBreed/newmodels/model.json";
    model = await tf.loadGraphModel("http://localhost:5000/model.json")
    if (model) console.log("model loaded")
    
    //return model;
}; loadModel()


app.post('/predict', async (req, res) => {

  //if (!req.files || Object.keys(req.files).length === 0) {
    //return res.status(400).send('No files were uploaded.');
  //}

  // Assume that the uploaded file is an image
  

  //const pixelData = req.body.pixelData.split(',').map(Number);
  const float32Array = new Float32Array(req.body.pixelData);
  console.log(float32Array.length)
  // Create a tensor from pixel data
  //const tensor = tf.tensor(float32Array, [224, 224, 3]).toFloat();
  //const inputTensor = tensor.div(tf.scalar(255.0)).expandDims(0);
  
  const tensor = tf.tensor(float32Array, [256, 256, 3]).expandDims(0)//.toFloat();
  const normalizedTensor = tensor.div(tf.scalar(255.0));
  //const inputTensor = tensor.slice([0, 0, 0], [224, 224, 3]); // Keep only the first 3 channels
  // Make predictions using the loaded model
  console.log("Input Tensor Shape:", normalizedTensor.shape);
  const predictions = model.predict(normalizedTensor).dataSync();
  //console.log(typeof(predictions))
  //console.log(predictions)
  //const predictions = {"0":0.0034320468548685312,"1":8.024344424484298e-7,"2":0.18538907170295715,"3":0.02707781456410885,"4":0.000041000759665621445,"5":0.3287191689014435,"6":4.5422501671055215e-7,"7":0.0027761152014136314,"8":0.00041370067629031837,"9":0.03785247728228569,"10":0.000001361344288852706,"11":6.034842385815864e-7,"12":5.227451893574653e-8,"13":0.000014956440281821415,"14":0.00001377283115289174,"15":0.40567290782928467,"16":0.000013725640201300848,"17":0.002948393113911152,"18":1.1696559276686003e-8,"19":0.00018019048729911447,"20":0.000001433073293810594,"21":0.0020294913556426764,"22":0.00022778385027777404,"23":2.7007456537830876e-7,"24":0.000017336857126792893,"25":0.0010479666525498033,"26":0.000006266837317525642,"27":1.379276994839529e-7,"28":0.0003786925517488271,"29":0.00017414467583876103,"30":0.0002064188738586381,"31":0.000004195787823846331,"32":0.000012087193681509234,"33":0.00013925104576628655,"34":0.00001331550538452575,"35":0.0011836756020784378,"36":0.000007837357770767994,"37":0.0000011237717671974679}
  const {name, info} = getDisease({predictions});
  // Send the predictions as JSON response
  //const name = "Apple Cedar apple rust";
  //const info = "Cedar apple rust is caused by the fungi Gymnosporangium or more specifically Gymnosporangium juniperi-virginianae that spend part of their life cycles on Eastern Red Cedars growing near orchards. The complex disease cycle of cedar apple rust, alternating between two host plants, was first delineated by Anders Sandøe Ørsted. CONTROL: Because apples are an economically important crop, control is usually focused there. Interruption of the disease cycle is the only effective method for control of the cedar apple rust. Removing as many cedar trees within close proximity of an apple orchard will reduce potential sources of inoculum. The closer the tree to the orchard, the greater impact removal will have. Removing all Junipers within the 4-5 miles (6.5-8 km) would provide complete control of the disease. Additionally, pruning and disposing of galls from infected cedar trees would reduce sources of inoculum for infection of apple trees, however this would likely be time-consuming and uneconomical."
  //setTimeout(()=>{}, 30000)
  res.json({ name: name, info: info })
});


// all routes for the app
app.get("/", (req, res)=>{ 
    res.render("landing.ejs", {layout: false});
})

app.get("/home", (req, res)=>{
  res.render("main.ejs");
})

app.get("/about", (req, res)=>{
  res.json({message: "not ready yet, add footer and social media and team info"});
})


// starting up the server
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
})