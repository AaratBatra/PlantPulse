function uploadFile() {
  let quoteInterval;
  if (document.getElementById("resultcard").style.display == "block") {
    alert("Please refresh the page first");
    return;
  }
  document.getElementById("loading").style.display = "block";
  const fileInput = document.querySelector('input[type="file"]');
  const formData = new FormData();
  const card_body = document.getElementById("card-body");
  // Check if a file is selected
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    formData.append("image", file);
    // Convert image to pixels using FileReader
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      const image = new Image();
      image.src = reader.result;
      image.onload = function () {
        // Resize the image to 224x224
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");
        
        //ctx.translate(256, 0); // horizontal flip
        //ctx.scale(-1, 1); // horizontal flip
        //const zoomFactor = 1 + Math.random() * 0.5 * 2 - 0.5; //zoom
        //ctx.scale(-0.5, 0.5); //zoom
        //ctx.transform(1, 0.3, 0, 1, 0, 0); // shear range // this line gives grape black rot 
        ctx.drawImage(image, 0, 0, 256, 256);
        //document.body.appendChild(canvas);
        // Get pixel data from the canvas
        //new
        // Assuming 'image' is your input image
        const tensor = tf.browser
          .fromPixels(canvas)
          .resizeNearestNeighbor([256, 256])
          .toFloat();

        // Define mean ImageNet values
        const meanImageNetRGB = {
          red: 123.68, //128.5
          green: 116.779, //136.3
          blue: 103.939 //143.7
        };

        // Define indices
        const indices = [
          tf.tensor1d([0], "int32"),
          tf.tensor1d([1], "int32"),
          tf.tensor1d([2], "int32"),
        ];

        // Center the RGB values
        const centeredRGB = {
          red: tf
            .gather(tensor, indices[0], 2)
            .sub(tf.scalar(meanImageNetRGB.red))
            .reshape([256 * 256]),
          green: tf
            .gather(tensor, indices[1], 2)
            .sub(tf.scalar(meanImageNetRGB.green))
            .reshape([256 * 256]),
          blue: tf
            .gather(tensor, indices[2], 2)
            .sub(tf.scalar(meanImageNetRGB.blue))
            .reshape([256 * 256]),
        };

        // Stack, reverse, reshape, and expand dimensions
        const processedTensor = tf
          .stack([centeredRGB.red, centeredRGB.green, centeredRGB.blue], 1)
          .reshape([256, 256, 3])
          .reverse(2)
          .expandDims(0); //change

        // Convert the processed tensor to a flattened Float32Array
        const flattenedData = processedTensor.flatten().arraySync();
        console.log(flattenedData);
        // Send 'flattenedData' to the server for further processing
        fetch("assets/quotes.json")
          .then((response) => response.json())
          .then((quoteData) => {
            console.log("starting");
            // Start displaying quotes at an interval
            quoteInterval = setInterval(() => {
              displayRandomQuote(quoteData.quotes);
            }, 10000); // Change the interval as needed
          })
          .catch((error) => console.error("Error fetching quotes:", error));
        fetch("http://localhost:3000/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pixelData: flattenedData }),
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle the response from the server
            console.log(data);
            clearInterval(quoteInterval);
            document.getElementById("quoteContainer").style.display = "none";
            document.getElementById("loading").style.display = "none";
            //document.getElementById("resultcard").style.display = "block";
            document.getElementById("resultcard").classList.add("show");
            canvas.classList.add("gravitation");
            card_body.prepend(canvas);

            //document.getElementById("maxResult").innerText = `Max Key: ${maxKey}, Max Value: ${maxValue}`
            document.getElementById(
              "result"
            ).innerText = `Predicted Disease: ${data.name}`;
            console.log(data.info);
            typeSentence(`${data.info}`, "#sentence");
          })
          .catch((error) => console.error("Error:", error));
        // new end
      };
    };
  } else {
    alert("Please select an image file.");
  }
}

function displayRandomQuote(quotes) {
  const quoteContainer = document.getElementById("quoteContainer");
  if (quoteContainer) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteContainer.innerHTML = `<p>${randomQuote.quote}</p><p>- ${randomQuote.author}</p>`;
  }
}

async function typeSentence(sentence, eleRef, delay = 100) {
  const letters = sentence.split(" ");
  let i = 0;
  while (i < letters.length) {
    await waitForMs(delay);
    $(eleRef).append(" " + letters[i]);
    i++;
  }
  return;
}

function waitForMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $(".image-upload-wrap").hide();

      $(".file-upload-image").attr("src", e.target.result);
      $(".file-upload-content").show();

      $(".image-title").html(input.files[0].name);
    };

    reader.readAsDataURL(input.files[0]);
  } else {
    removeUpload();
  }
}

function removeUpload() {
  $(".file-upload-input").replaceWith($(".file-upload-input").clone());
  $(".file-upload-content").hide();
  $(".image-upload-wrap").show();
}
$(".image-upload-wrap").bind("dragover", function () {
  $(".image-upload-wrap").addClass("image-dropping");
});
$(".image-upload-wrap").bind("dragleave", function () {
  $(".image-upload-wrap").removeClass("image-dropping");
});
