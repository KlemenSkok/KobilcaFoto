


function grayscale(imageData) {
    const data = imageData.data;
    for(let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // Red
        data[i + 1] = avg; // Green
        data[i + 2] = avg; // Blue
    }
    return imageData;
}

function brightness(imageData, value) {
    const data = imageData.data;
    for(let i = 0; i < data.length; i += 4) {
        data[i] = data[i] + value;          // Red
        data[i + 1] = data[i + 1] + value;  // Green
        data[i + 2] = data[i + 2] + value;  // Blue
    }
    return imageData;
}

function tresholding(imageData, treshold) {
    const data = imageData.data;
    for(let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if(avg > treshold) {
            data[i] = 255;     // Red
            data[i + 1] = 255; // Green
            data[i + 2] = 255; // Blue
        } else {
            data[i] = 0;     // Red
            data[i + 1] = 0; // Green
            data[i + 2] = 0; // Blue
        }
    }
    return imageData;
}