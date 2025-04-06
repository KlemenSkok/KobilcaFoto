



let currentMode = "none";

let settingsPanelOpen = false;

// drawing vars
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentBrushColor = "#000000";
let currentBrushSize = 5;

// selection vars
let isSelecting = false;
let selectionStartX = 0;
let selectionStartY = 0;
let selectionBox = null;

ctx.lineWidth = currentBrushSize;
ctx.lineCap = "round";
ctx.strokeStyle = currentBrushColor;





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

// UTILITY FUNCTIONS

function updateColorChannels() {
    const r_channel = document.getElementById("r-channel-slider").value;
    const g_channel = document.getElementById("g-channel-slider").value;
    const b_channel = document.getElementById("b-channel-slider").value;

    const newImageData = alterColorChannels(getLastSave(), r_channel, g_channel, b_channel);
    ctx.putImageData(newImageData, 0, 0);
}

function drawSelectionBox() {
    if(selectionBox) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height);
        
        ctx.strokeStyle = currentBrushColor;
        ctx.lineWidth = currentBrushSize;
    }
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
    updateColorChannels();

});
document.getElementById("r-channel-slider").addEventListener("input", (event) => {
    // apply the filter
    updateColorChannels();

});
document.getElementById("r-channel-btn").addEventListener("click", () => {
    // apply the filter
    document.getElementById("r-channel-slider").value = document.getElementById("r-channel-slider").value == 0 ? 1 : 0; // toggle between 0 and 1
    updateColorChannels();

});

// G
document.getElementById("g-channel-slider").addEventListener("mouseup", (event) => {
    // apply the filter
    updateColorChannels();

});
document.getElementById("g-channel-slider").addEventListener("input", (event) => {
    // apply the filter
    updateColorChannels();

});
document.getElementById("g-channel-btn").addEventListener("click", () => {
    // apply the filter
    document.getElementById("g-channel-slider").value = document.getElementById("g-channel-slider").value == 0 ? 1 : 0; // toggle between 0 and 1
    updateColorChannels();

});

// B
document.getElementById("b-channel-slider").addEventListener("mouseup", (event) => {
    // apply the filter
    updateColorChannels();

});
document.getElementById("b-channel-slider").addEventListener("input", (event) => {
    // apply the filter
    updateColorChannels();

});
document.getElementById("b-channel-btn").addEventListener("click", () => {
    // apply the filter
    document.getElementById("b-channel-slider").value = document.getElementById("b-channel-slider").value == 0 ? 1 : 0; // toggle between 0 and 1
    updateColorChannels();

});


document.getElementById("channels-confirm").addEventListener("click", () => {
    // apply the filter
    updateColorChannels();

    // AND save the image
    setLastSave(ctx.getImageData(0, 0, canvas.width, canvas.height));
    
    // reset sliders
    document.getElementById("r-channel-slider").value = 1;
    document.getElementById("g-channel-slider").value = 1;
    document.getElementById("b-channel-slider").value = 1;
    document.getElementById("r-channel-btn").checked = true;
    document.getElementById("g-channel-btn").checked = true;
    document.getElementById("b-channel-btn").checked = true;
});

document.getElementById("channels-cancel").addEventListener("click", () => {
    // apply the filter
    const imageData = getLastSave();
    ctx.putImageData(imageData, 0, 0);

    // reset sliders
    document.getElementById("r-channel-slider").value = 1;
    document.getElementById("g-channel-slider").value = 1;
    document.getElementById("b-channel-slider").value = 1;
    document.getElementById("r-channel-btn").checked = true;
    document.getElementById("g-channel-btn").checked = true;
    document.getElementById("b-channel-btn").checked = true;
});


// undo/redo buttons
document.getElementById("undo-btn").addEventListener("click", () => {
    undo();
});

document.getElementById("redo-btn").addEventListener("click", () => {
    redo();
});

// show or hide the histogram
document.getElementById("toggle-histogram-btn").addEventListener("click", () => {
    document.getElementById("histogram-container").classList.toggle("hidden");
});


// open and close different setting panels

// main settings close button
document.getElementById("settings-close-btn").addEventListener("click", () => {
    // hide the container
    document.getElementById("main-container").style.gridTemplateColumns = "20% 80%";

    document.getElementById("settings-container").classList.add("hidden");
    settingsPanelOpen = false;

});

// open filters panel
document.getElementById("drawing-panel-btn").addEventListener("click", () => {
    // change grid css settings
    if(!settingsPanelOpen) {
        // open the panel if not yet open
        document.getElementById("main-container").style.gridTemplateColumns = "20% 60% 20%";
    }
    document.getElementById("settings-container").classList.remove("hidden");

    // close all other panels
    for(const panel of document.querySelectorAll(".settings-panel")){
        if(panel.id !== "drawing-panel") {
            panel.classList.add("hidden");
        }
    }

    // open the blurring panel
    document.getElementById("drawing-panel").classList.remove("hidden");
    
    settingsPanelOpen = true;
});

// open filters panel
document.getElementById("filters-panel-btn").addEventListener("click", () => {
    // change grid css settings
    if(!settingsPanelOpen) {
        // open the panel if not yet open
        document.getElementById("main-container").style.gridTemplateColumns = "20% 60% 20%";
    }
    document.getElementById("settings-container").classList.remove("hidden");

    // close all other panels
    for(const panel of document.querySelectorAll(".settings-panel")){
        if(panel.id !== "filters-panel") {
            panel.classList.add("hidden");
        }
    }

    // open the blurring panel
    document.getElementById("filters-panel").classList.remove("hidden");
    
    settingsPanelOpen = true;
});

// open edge detection panel
document.getElementById("edge-detection-panel-btn").addEventListener("click", () => {
    // change grid css settings
    if(!settingsPanelOpen) {
        // open the panel if not yet open
        document.getElementById("main-container").style.gridTemplateColumns = "20% 60% 20%";
    }
    document.getElementById("settings-container").classList.remove("hidden");

    // close all other panels
    for(const panel of document.querySelectorAll(".settings-panel")){
        if(panel.id !== "edge-detection-panel") {
            panel.classList.add("hidden");
        }
    }

    // open the blurring panel
    document.getElementById("edge-detection-panel").classList.remove("hidden");
    
    settingsPanelOpen = true;
});

// open color channels panel
document.getElementById("color-channel-panel-btn").addEventListener("click", () => {
    // change grid css settings
    if(!settingsPanelOpen) {
        // open the panel if not yet open
        document.getElementById("main-container").style.gridTemplateColumns = "20% 60% 20%";
    }
    document.getElementById("settings-container").classList.remove("hidden");

    // close all other panels
    for(const panel of document.querySelectorAll(".settings-panel")){
        if(panel.id !== "color-channels-panel") {
            panel.classList.add("hidden");
        }
    }

    // open the blurring panel
    document.getElementById("color-channels-panel").classList.remove("hidden");
    
    settingsPanelOpen = true;
});

// open brightness panel
document.getElementById("sharpening-panel-btn").addEventListener("click", () => {
    // change grid css settings
    if(!settingsPanelOpen) {
        // open the panel if not yet open
        document.getElementById("main-container").style.gridTemplateColumns = "20% 60% 20%";
    }
    document.getElementById("settings-container").classList.remove("hidden");

    // close all other panels
    for(const panel of document.querySelectorAll(".settings-panel")){
        if(panel.id !== "sharpening-panel") {
            panel.classList.add("hidden");
        }
    }

    // open the blurring panel
    document.getElementById("sharpening-panel").classList.remove("hidden");
    
    settingsPanelOpen = true;
});




// drawing panel inputs

document.getElementById("drawing-color-input").addEventListener("input", (event) => {
    currentBrushColor = event.target.value;
    ctx.strokeStyle = currentBrushColor;
});

document.getElementById("drawing-size-input").addEventListener("input", (event) => {
    currentBrushSize = event.target.value;
    ctx.lineWidth = currentBrushSize;
});


// actual drawing

canvas.addEventListener("mousedown", (event) => {
    if (currentMode === "drawing") {
        
        isDrawing = true;
        
        const rect = canvas.getBoundingClientRect();
        lastX = event.clientX - rect.left;
        lastY = event.clientY - rect.top;
        
        // instanty draw a circle at the mouse position
        ctx.beginPath();
        ctx.arc(lastX, lastY, currentBrushSize/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    else if(currentMode === "box-selection") {
        isSelecting = true;

        const rect = canvas.getBoundingClientRect();
        selectionStartX = event.clientX - rect.left;
        selectionStartY = event.clientY - rect.top;
    }
});

canvas.addEventListener("mouseup", (event) => {
    if(isDrawing) {
        isDrawing = false;
        setLastSave(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
    else if(isSelecting) {
        isSelecting = false;
        
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        selectionBox = {
            x: Math.min(selectionStartX, x),
            y: Math.min(selectionStartY, y),
            width: Math.abs(selectionStartX - x),
            height: Math.abs(selectionStartY - y)
        };

        if(selectionBox.width == 0 || selectionBox.height == 0) {
            // enable cancelling the selection
            selectionBox = null;
        }
    }
});

canvas.addEventListener("mouseleave", () => {
    if(!isDrawing) 
        return;

    isDrawing = false;
    setLastSave(ctx.getImageData(0, 0, canvas.width, canvas.height));
});

canvas.addEventListener("mousemove", (event) => {
    if (isDrawing) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        lastX = x;
        lastY = y;
    }
    else if(isSelecting) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        selectionBox = {
            x: Math.min(selectionStartX, x),
            y: Math.min(selectionStartY, y),
            width: Math.abs(selectionStartX - x),
            height: Math.abs(selectionStartY - y)
        };

        // draw the thing

    }
});


// select current mode (what mouse does)
document.getElementById("mode-selection").addEventListener("input", (event) => {
    currentMode = event.target.value;

    // reset selection
    selectionBox = null;
    isSelecting = false;
});