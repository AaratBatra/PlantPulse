const fs = require('fs')
const Disease = {
  0: "Apple_Apple_scab",
  1: "Apple_Black_rot",
  2: "Apple_Cedar_apple_rust",
  3: "Apple_healthy",
  4: "Blueberry_healthy",
  5: "Cherry(including_sour)__Powdery_mildew",
  6: "Cherry(including_sour)__healthy",
  7: "Corn(maize)__Cercospora_leaf_spot Gray_leaf_spot",
  8: "Corn(maize)__Common_rust",
  9: "Corn(maize)_Northern_Leaf_Blight",
  10: "Corn(maize)__healthy",
  11: "Grape_Black_rot",
  12: "Grape_Esca(Black_Measles)",
  13: "GrapeLeaf_blight(Isariopsis_Leaf_Spot)",
  14: "Grapehealthy",
  15: "Orange_Haunglongbing(Citrus_greening)",
  16: "PeachBacterial_spot",
  17: "Peach_healthy",
  18: "Pepper,_bell_Bacterial_spot",
  19: "Pepper,_bell_healthy",
  20: "Potato_Early_blight",
  21: "Potato_Late_blight",
  22: "Potato_healthy",
  23: "Raspberry_healthy",
  24: "Soybean_healthy",
  25: "Squash_Powdery_mildew",
  26: "Strawberry_Leaf_scorch",
  27: "Strawberry_healthy",
  28: "Tomato_Bacterial_spot",
  29: "Tomato_Early_blight",
  30: "Tomato_Late_blight",
  31: "Tomato_Leaf_Mold",
  32: "Tomato_Septoria_leaf_spot",
  33: "Tomato_Spider_mites Two-spotted_spider_mite",
  34: "Tomato_Target_Spot",
  35: "Tomato_Tomato_Yellow_Leaf_Curl_Virus",
  36: "Tomato_Tomato_mosaic_virus",
  37: "Tomato_healthy",
};

function getDisease({ predictions }) {
  let maxKey = null;
  let maxValue = -Infinity;

  for (const key in predictions) {
    if (predictions[key] > maxValue) {
      maxValue = predictions[key];
      maxKey = key;
    }
  }
  console.log("Max Key:", maxKey);
  console.log("Max Value:", maxValue);
  if (maxKey != null) {
    let disease = `${Disease[maxKey].replace(/_/g, " ")}`;
    
    try {
        const diseaseBuffer = fs.readFileSync(`${__dirname}/disease_info.json`, 'utf-8');
        if (diseaseBuffer !== undefined && diseaseBuffer !== null) {
            const disease_data = JSON.parse(diseaseBuffer);           
            const buff_disease = disease.toString();
            console.log(buff_disease)
            const disease_info = disease_data[buff_disease];           
            if (disease_info == undefined) {
                return {
                    name: "No Disease Detected",
                    info: "The plant might be healthy!"
                };
            }
            return {
                name: disease,
                info: disease_info
            };
        } else {
            const error = "Cannot load disease info json";
            throw error;
        }
    } catch (error) {
        console.log(error)
        return null
    }
  } else {
    console.log("No predictions")
    return null
  }
}

module.exports = getDisease