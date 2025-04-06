
// UTILITY FUNCTIONS

function clamp_Uint8(value) {
    return Math.max(0, Math.min(255, value));
}

function clampIndex(value, min, max) {
    return Math.max(min, Math.min(max, value));
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

function applyConvolution(imageData, kernel, kernelWeight = 1) {
    const width = imageData.width;
    const height = imageData.height;
    const src = imageData.data;
    const dst = new Uint8ClampedArray(src.length);

    const getIndex = (x, y) => (y * width + x) * 4;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const px = clampIndex(x + kx, 0, width - 1);
                    const py = clampIndex(y + ky, 0, height - 1);
                    const idx = getIndex(px, py);
                    const weight = kernel[ky + 1][kx + 1];

                    r += src[idx]     * weight;
                    g += src[idx + 1] * weight;
                    b += src[idx + 2] * weight;
                }
            }

            const idx = getIndex(x, y);
            dst[idx]     = clamp_Uint8(r / kernelWeight);
            dst[idx + 1] = clamp_Uint8(g / kernelWeight);
            dst[idx + 2] = clamp_Uint8(b / kernelWeight);
            dst[idx + 3] = src[idx + 3]; // copy alpha
        }
    }

    return new ImageData(dst, width, height);
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

    const blurKernel = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];
    const blurred = applyConvolution(data, blurKernel, 9); // 3x3 kernel, sum = 9
    
    return blurred;
}

function gaussianBlur(imageData, radius = 3) {
    const sigma = radius / 2; // or any custom value (radius / 3 is also common)
    const kernelSize = radius * 2 + 1;
    const kernel = [];
    let kernelSum = 0;

    // Generate 1D Gaussian kernel
    for (let i = -radius; i <= radius; i++) {
        const value = Math.exp(-(i * i) / (2 * sigma * sigma));
        kernel.push(value);
        kernelSum += value;
    }

    // Normalize the kernel
    for (let i = 0; i < kernel.length; i++) {
        kernel[i] /= kernelSum;
    }

    const width = imageData.width;
    const height = imageData.height;
    const src = imageData.data;
    const tmp = new Uint8ClampedArray(src.length);
    const dst = new Uint8ClampedArray(src.length);

    // Horizontal blur
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            for (let k = -radius; k <= radius; k++) {
                const px = clampIndex(x + k, 0, width - 1);
                const idx = (y * width + px) * 4;
                const weight = kernel[k + radius];
                r += src[idx] * weight;
                g += src[idx + 1] * weight;
                b += src[idx + 2] * weight;
                a += src[idx + 3] * weight;
            }
            const idx = (y * width + x) * 4;
            tmp[idx] = r;
            tmp[idx + 1] = g;
            tmp[idx + 2] = b;
            tmp[idx + 3] = a;
        }
    }

    // Vertical blur
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            for (let k = -radius; k <= radius; k++) {
                const py = clampIndex(y + k, 0, height - 1);
                const idx = (py * width + x) * 4;
                const weight = kernel[k + radius];
                r += tmp[idx] * weight;
                g += tmp[idx + 1] * weight;
                b += tmp[idx + 2] * weight;
                a += tmp[idx + 3] * weight;
            }
            const idx = (y * width + x) * 4;
            dst[idx] = r;
            dst[idx + 1] = g;
            dst[idx + 2] = b;
            dst[idx + 3] = a;
        }
    }

    return new ImageData(dst, width, height);
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

// sharpen image
function sharpen(imageData) {
    const kernel = [
        [  0, -1,  0 ],
        [ -1,  5, -1 ],
        [  0, -1,  0 ]
    ];
    const kernelWeight = 1;

    return applyConvolution(imageData, kernel, kernelWeight);
}

// unsharpen image
function unsharpMask(imageData, blurRadius = 1, amount = 1.0) {
    const width = imageData.width;
    const height = imageData.height;
    const original = imageData.data;
    const blurred = gaussianBlur(imageData, blurRadius).data;

    const output = new Uint8ClampedArray(original.length);

    for (let i = 0; i < original.length; i += 4) {
        // Enhance RGB channels
        for (let c = 0; c < 3; c++) {
            const sharp = original[i + c] + amount * (original[i + c] - blurred[i + c]);
            output[i + c] = clamp_Uint8(Math.round(sharp));
        }

        // Keep alpha the same
        output[i + 3] = original[i + 3];
    }

    return new ImageData(output, width, height);
}


// color channel manipulation
function alterColorChannels(data, r = 1, g = 1, b = 1) {
    //const data = copyImageData(imageData);
    const pixels = data.data;

    for(let i = 0; i < pixels.length; i += 4) {
        pixels[i]     = clamp_Uint8(pixels[i]     * r); // Red
        pixels[i + 1] = clamp_Uint8(pixels[i + 1] * g); // Green
        pixels[i + 2] = clamp_Uint8(pixels[i + 2] * b); // Blue
    }

    //console.log(`r: ${r}, g: ${g}, b: ${b}`);
    return data;
}