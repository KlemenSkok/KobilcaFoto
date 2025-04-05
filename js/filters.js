

function clamp_Uint8(value) {
    return Math.max(0, Math.min(255, value));
}

function copyImageData(imageData) {
    //! create a copy of the imageData
    return new ImageData(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height
    );
}


function grayscale(imageData) {
    const data = copyImageData(imageData);
    const pixels = data.data;

    for(let i = 0; i < pixels.length; i += 4) {
        const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        pixels[i] = avg;     // Red
        pixels[i + 1] = avg; // Green
        pixels[i + 2] = avg; // Blue
    }
    return data;
}

function brightness(imageData, value) {
    const data = copyImageData(imageData);
    const pixels = data.data;

    for(let i = 0; i < pixels.length; i += 4) {
        pixels[i] = clamp_Uint8(pixels[i] + value);          // Red
        pixels[i + 1] = clamp_Uint8(pixels[i + 1] + value);  // Green
        pixels[i + 2] = clamp_Uint8(pixels[i + 2] + value);  // Blue
    }
    return data;
}

function tresholding(imageData, treshold) {
    const data = copyImageData(imageData);
    const pixels = data.data;

    for(let i = 0; i < pixels.length; i += 4) {
        const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        if(avg > treshold) {
            pixels[i] = 255;     // Red
            pixels[i + 1] = 255; // Green
            pixels[i + 2] = 255; // Blue
        } else {
            pixels[i] = 0;     // Red
            pixels[i + 1] = 0; // Green
            pixels[i + 2] = 0; // Blue
        }
    }
    return data;
}

function invert(imageData) {
    const data = copyImageData(imageData);
    const pixels = data.data;

    for(let i = 0; i < pixels.length; i += 4) {
        pixels[i] = 255 - pixels[i];     // Red
        pixels[i + 1] = 255 - pixels[i + 1]; // Green
        pixels[i + 2] = 255 - pixels[i + 2]; // Blue
    }
    return data;
}