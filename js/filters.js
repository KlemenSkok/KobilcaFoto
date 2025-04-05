
// UTILITY FUNCTIONS

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

function toGrayscale(imageData) {
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        pixels[i] = pixels[i + 1] = pixels[i + 2] = avg;
    }
    return imageData;
}


// FILTERS

function grayscale(imageData) {
    const data = copyImageData(imageData);
    toGrayscale(data);

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


function boxBlur(imageData) {
    const data = copyImageData(imageData);
    const pixels = data.data;
    const width = imageData.width;
    const height = imageData.height;

    const kernelSize = 3; // 3x3 kernel
    const halfKernelSize = Math.floor(kernelSize / 2);

    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            let count = 0;

            for(let ky = -halfKernelSize; ky <= halfKernelSize; ky++) {
                for(let kx = -halfKernelSize; kx <= halfKernelSize; kx++) {
                    const nx = x + kx;
                    const ny = y + ky;

                    if(nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const index = (ny * width + nx) * 4;
                        r += pixels[index];
                        g += pixels[index + 1];
                        b += pixels[index + 2];
                        a += pixels[index + 3];
                        count++;
                    }
                }
            }

            const index = (y * width + x) * 4;
            pixels[index]     = r / count;     // Red
            pixels[index + 1] = g / count; // Green
            pixels[index + 2] = b / count; // Blue
            pixels[index + 3] = a / count; // Alpha
        }
    }
    return data;
}

function gaussianBlur(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const src = imageData.data;
    const output = new Uint8ClampedArray(src.length);

    const kernel = [
        [1, 2, 1],
        [2, 4, 2],
        [1, 2, 1]
    ];
    const kernelWeight = 16;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0;
    
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const px = Math.min(width - 1, Math.max(0, x + kx));
                    const py = Math.min(height - 1, Math.max(0, y + ky));
                    const offset = (py * width + px) * 4;
                    const weight = kernel[ky + 1][kx + 1];

                    r += src[offset]     * weight;
                    g += src[offset + 1] * weight;
                    b += src[offset + 2] * weight;
                }
            }
    
            const i = (y * width + x) * 4;
            output[i]     = clamp_Uint8(r / kernelWeight);
            output[i + 1] = clamp_Uint8(g / kernelWeight);
            output[i + 2] = clamp_Uint8(b / kernelWeight);
            output[i + 3] = src[i + 3]; // preserve alpha
        }
    }
    

    return new ImageData(output, width, height);
}

// sobel operator
function sobelEdgeDetection(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const src = toGrayscale(copyImageData(imageData)).data;
    const output = new Uint8ClampedArray(src.length);

    const sobelX = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ];
    const sobelY = [
        [-1, -2, -1],
        [0,  0,  0],
        [1,  2,  1]
    ];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let gx = 0, gy = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const px = x + kx;
                    const py = y + ky;
                    const i = (py * width + px) * 4;
                    const gray = src[i]; // R=G=B since grayscale

                    gx += gray * sobelX[ky + 1][kx + 1];
                    gy += gray * sobelY[ky + 1][kx + 1];
                }
            }

            const magnitude = clamp_Uint8(Math.sqrt(gx * gx + gy * gy));
            const index = (y * width + x) * 4;
            output[index] = output[index + 1] = output[index + 2] = magnitude;
            output[index + 3] = 255;
        }
    }

    return new ImageData(output, width, height);
}

// laplace operator
function laplaceEdgeDetection(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const src = toGrayscale(copyImageData(imageData)).data;
    const output = new Uint8ClampedArray(src.length);

    const laplaceKernel = [
        [0,  1, 0],
        [1, -4, 1],
        [0,  1, 0]
    ];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let sum = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const px = x + kx;
                    const py = y + ky;
                    const i = (py * width + px) * 4;
                    const gray = src[i];

                    sum += gray * laplaceKernel[ky + 1][kx + 1];
                }
            }

            const value = clamp_Uint8(Math.abs(sum));
            const index = (y * width + x) * 4;
            output[index] = output[index + 1] = output[index + 2] = value;
            output[index + 3] = 255;
        }
    }

    return new ImageData(output, width, height);
}