function uploadFile() {
  let quoteInterval;
  if (document.getElementById("resultcard").style.display == "block") {
    alert("Please refresh the page first");
    return
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
        ctx.drawImage(image, 0, 0, 256, 256);
        //document.body.appendChild(canvas);
        // Get pixel data from the canvas
        const imageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        ).data;
        const pixelData = [];
        //for (let i = 0; i < imageData.length; i += 4) {
          // Only take the first three channels (R, G, B)
          //pixelData.push(imageData[i], imageData[i + 1], imageData[i + 2]);
        //}
        for (let i = 0; i < imageData.length; i += 4) {
          // Convert from RGB to BGR
          pixelData.push(imageData[i + 2], imageData[i + 1], imageData[i]);
          
        }
        //for (let i = 0; i < pixelData.length; i += 3) {
          // Convert from RGB to BGR
          //pixelData[i] -= 103.939;
          //pixelData[i+1] -= 116.779;
          //pixelData[i+2] -= 123.68;
          
        //}
        // Zero-center each color channel (assuming mean values for each channel)
        
        // Send pixel data to the server
        formData.append("pixelData", pixelData.join(","));
        fetch("assets/quotes.json").then((response) => response.json()).then((quoteData) => {
          console.log("starting")
          // Start displaying quotes at an interval
          quoteInterval = setInterval(() => {
              displayRandomQuote(quoteData.quotes);
            }, 10000); // Change the interval as needed
          }).catch((error) => console.error("Error fetching quotes:", error));
        // Make the POST request
        fetch("http://localhost:3000/predict", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
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
            console.log(data.info)
            typeSentence(`${data.info}`, "#sentence")
          })
          .catch((error) => console.error("Error:", error));
          // show quotes while loading

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
  while(i < letters.length) {
    await waitForMs(delay);
    $(eleRef).append(" "+letters[i]);
    i++
  }
  return;
}


function waitForMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
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
