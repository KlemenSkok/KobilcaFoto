
// UPLOAD IMAGES

document.getElementById("upload-btn").addEventListener("click", () => {
    document.getElementById("actual-upload-btn").click()
});

var imageLoader = document.getElementById('actual-upload-btn');
imageLoader.addEventListener('change', uploadImage, false);

function uploadImage(e) {

    var reader = new FileReader();
    reader.onload = function(event) {
        var img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            //saveToBuffer(); // save the image to the undo buffer
            //console.log("Image uploaded.");
        }
        img.src = event.target.result;
    }

    reader.readAsDataURL(e.target.files[0]);
}


// UI ELEMENTS

// grayscale filter
document.getElementById("grayscale-btn").addEventListener("click", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newImageData = grayscale(imageData);
    ctx.putImageData(newImageData, 0, 0);
    
    // save the image
});

// brightness filter
document.getElementById("brightness-slider").addEventListener("mouseup", (event) =>{
    // apply the filter
    let value = 1 + event.target.value / 100;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newImageData = brightness(imageData, value);
    ctx.putImageData(newImageData, 0, 0);
    
    // AND save the image
});

document.getElementById("brightness-slider").addEventListener("input", (event) => {
    // apply the filter
    let value = 1 + event.target.value / 100;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newImageData = brightness(imageData, value);
    ctx.putImageData(newImageData, 0, 0);
});


// tresholding filter
document.getElementById("tresholding-slider").addEventListener("mouseup", (event) =>{
    console.log(event.target.value);
    // apply the filter
    let value = event.target.value;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newImageData = tresholding(imageData, value);
    ctx.putImageData(newImageData, 0, 0);
    
    // AND save the image
});


document.getElementById("tresholding-slider").addEventListener("input", (event) => {
    // apply the filter
    let value = event.target.value;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newImageData = tresholding(imageData, value);
    ctx.putImageData(newImageData, 0, 0);
});


// undo/redo buttons
document.getElementById("undo-btn").addEventListener("click", () => {
    //undo();
});

document.getElementById("redo-btn").addEventListener("click", () => {
    //redo();
});