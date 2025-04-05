
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

            setLastSave(ctx.getImageData(0, 0, canvas.width, canvas.height));

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
    const imageData = getLastSave();
    const newImageData = grayscale(imageData);
    ctx.putImageData(newImageData, 0, 0);
    
    // save the image
    setLastSave(newImageData);
});

// invert image filter
document.getElementById("invert-btn").addEventListener("click", () => {
    const imageData = getLastSave();
    const newImageData = invert(imageData);
    ctx.putImageData(newImageData, 0, 0);
    
    // save the image
    setLastSave(newImageData);
});

// reset canvas to initial state
document.getElementById("reset-btn").addEventListener("click", () => {
    canvas.width = initialData.width;
    canvas.height = initialData.height;
    ctx.putImageData(initialData, 0, 0);

    setLastSave(initialData);
});

// box blur filter
document.getElementById("boxblur-btn").addEventListener("click", () => {
    const imageData = getLastSave();
    const newImageData = boxBlur(imageData, 20);
    ctx.putImageData(newImageData, 0, 0);
    
    // save the image
    setLastSave(newImageData);
});

// gaussian blur filter
document.getElementById("gaussianblur-btn").addEventListener("click", () => {
    const imageData = getLastSave();
    const newImageData = gaussianBlur(imageData);
    ctx.putImageData(newImageData, 0, 0);
    
    // save the image
    setLastSave(newImageData);
});

// sobel filter
document.getElementById("sobel-edge-btn").addEventListener("click", () => {
    const imageData = getLastSave();
    const newImageData = sobelEdgeDetection(imageData);
    ctx.putImageData(newImageData, 0, 0);
    
    // save the image
    setLastSave(newImageData);
});

// laplacian filter
document.getElementById("laplace-edge-btn").addEventListener("click", () => {
    const imageData = getLastSave();
    const newImageData = laplaceEdgeDetection(imageData);
    ctx.putImageData(newImageData, 0, 0);
    
    // save the image
    setLastSave(newImageData);
});

// sharpening filter
document.getElementById("sharpen-btn").addEventListener("click", () => {
    const imageData = getLastSave();
    const newImageData = sharpen(imageData);
    ctx.putImageData(newImageData, 0, 0);
    
    // save the image
    setLastSave(newImageData);
});

// unsharpen filter
document.getElementById("unsharpen-btn").addEventListener("click", () => {
    const imageData = getLastSave();
    const newImageData = unsharpMask(imageData, 2, 1.2);
    ctx.putImageData(newImageData, 0, 0);
    
    // save the image
    setLastSave(newImageData);
});



// brightness filter
document.getElementById("brightness-slider").addEventListener("mouseup", (event) =>{
    // apply the filter
    let value = event.target.value / 2;
    const imageData = getLastSave();
    const newImageData = brightness(imageData, value);
    ctx.putImageData(newImageData, 0, 0);
    
    // AND save the image
    setLastSave(newImageData);
});

document.getElementById("brightness-slider").addEventListener("input", (event) => {
    // apply the filter
    let value = event.target.value * 0.75;
    const imageData = getLastSave();
    const newImageData = brightness(imageData, value);
    ctx.putImageData(newImageData, 0, 0);
});


// tresholding filter
document.getElementById("tresholding-slider").addEventListener("mouseup", (event) =>{
    // apply the filter
    let value = event.target.value;
    const imageData = getLastSave();
    const newImageData = tresholding(imageData, value);
    ctx.putImageData(newImageData, 0, 0);
    
    // AND save the image
    setLastSave(newImageData);
});


document.getElementById("tresholding-slider").addEventListener("input", (event) => {
    // apply the filter
    let value = event.target.value;
    const imageData = getLastSave();
    const newImageData = tresholding(imageData, value);
    ctx.putImageData(newImageData, 0, 0);
});


// download button
document.getElementById("download-btn").addEventListener("click", () => {
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = canvas.toDataURL();
    link.click();
});


// color channel manipulation
// R
document.getElementById("r-channel-slider").addEventListener("mouseup", (event) => {
    // apply the filter
    let value = event.target.value;
    const imageData = getLastSave();
    const newImageData = alterColorChannels(imageData, r = value);
    ctx.putImageData(newImageData, 0, 0);

    // AND save the image
    setLastSave(newImageData);
});
document.getElementById("r-channel-slider").addEventListener("input", (event) => {
    // apply the filter
    let value = event.target.value;
    const imageData = getLastSave();
    const newImageData = alterColorChannels(imageData, r = value);
    ctx.putImageData(newImageData, 0, 0);
});
document.getElementById("r-channel-btn").addEventListener("click", () => {
    // apply the filter
    const imageData = getLastSave();
    const newImageData = alterColorChannels(imageData, r = 0);
    ctx.putImageData(newImageData, 0, 0);

    // AND save the image
    setLastSave(newImageData);
})

// G
document.getElementById("g-channel-slider").addEventListener("mouseup", (event) => {
    // apply the filter
    let value = event.target.value;
    const imageData = getLastSave();
    const newImageData = alterColorChannels(imageData, g = value);
    ctx.putImageData(newImageData, 0, 0);

    // AND save the image
    setLastSave(newImageData);
});
document.getElementById("g-channel-slider").addEventListener("input", (event) => {
    // apply the filter
    let value = event.target.value;
    const imageData = getLastSave();
    const newImageData = alterColorChannels(imageData, g = value);
    ctx.putImageData(newImageData, 0, 0);
});
document.getElementById("g-channel-btn").addEventListener("click", () => {
    // apply the filter
    const imageData = getLastSave();
    const newImageData = alterColorChannels(imageData, g = 0);
    ctx.putImageData(newImageData, 0, 0);

    // AND save the image
    setLastSave(newImageData);
})

// B
document.getElementById("b-channel-slider").addEventListener("mouseup", (event) => {
    // apply the filter
    let value = event.target.value;
    const imageData = getLastSave();
    const newImageData = alterColorChannels(imageData, b = value);
    ctx.putImageData(newImageData, 0, 0);

    // AND save the image
    setLastSave(newImageData);
});
document.getElementById("b-channel-slider").addEventListener("input", (event) => {
    // apply the filter
    let value = event.target.value;
    const imageData = getLastSave();
    const newImageData = alterColorChannels(imageData, b = value);
    ctx.putImageData(newImageData, 0, 0);
});
document.getElementById("b-channel-btn").addEventListener("click", () => {
    // apply the filter
    const imageData = getLastSave();
    const newImageData = alterColorChannels(imageData, b = 0);
    ctx.putImageData(newImageData, 0, 0);

    // AND save the image
    setLastSave(newImageData);
})



// undo/redo buttons
document.getElementById("undo-btn").addEventListener("click", () => {
    undo();
});

document.getElementById("redo-btn").addEventListener("click", () => {
    redo();
});