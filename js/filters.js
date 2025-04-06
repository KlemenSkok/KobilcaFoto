
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

function toGrayscale(imageData, boundingBox = null) {
    const pixels = imageData.data;

    const startX = boundingBox?.x || 0;
    const startY = boundingBox?.y || 0;
    const endX = boundingBox?.x + boundingBox?.width || imageData.width;
    const endY = boundingBox?.y + boundingBox?.height || imageData.height;

    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const i = (y * imageData.width + x) * 4;

            const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            pixels[i] = avg;
            pixels[i + 1] = avg;
            pixels[i + 2] = avg;
        }
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

function cropImageData(imageData, x, y, width, height) {
    const cropped = new ImageData(width, height);
    const src = imageData.data;
    const dst = cropped.data;
    const imgWidth = imageData.width;

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const srcIdx = ((y + row) * imgWidth + (x + col)) * 4;
            const dstIdx = (row * width + col) * 4;
            dst.set(src.slice(srcIdx, srcIdx + 4), dstIdx);
        }
    }

    return cropped;
}

function pasteImageData(targetImageData, insertImageData, x, y) {
    const src = insertImageData.data;
    const dst = targetImageData.data;
    const targetWidth = targetImageData.width;
    const insertWidth = insertImageData.width;
    const insertHeight = insertImageData.height;

    for (let row = 0; row < insertHeight; row++) {
        for (let col = 0; col < insertWidth; col++) {
            const dstIdx = ((y + row) * targetWidth + (x + col)) * 4;
            const srcIdx = (row * insertWidth + col) * 4;
            dst.set(src.slice(srcIdx, srcIdx + 4), dstIdx);
        }
    }
}



// FILTERS

function grayscale(imageData, boundingBox = null) {

    const data = copyImageData(imageData);
    toGrayscale(data, boundingBox);

    return data;
}

function brightness(imageData, value, boundingBox = null) {
    const data = copyImageData(imageData);
    const pixels = data.data;
    const width = imageData.width;
    const height = imageData.height;

    const startX = boundingBox?.x || 0;
    const startY = boundingBox?.y || 0;
    const endX = (boundingBox?.x + boundingBox?.width) || width;
    const endY = (boundingBox?.y + boundingBox?.height) || height;

    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const i = (y * width + x) * 4;
            pixels[i]     = clamp_Uint8(pixels[i]     + value);
            pixels[i + 1] = clamp_Uint8(pixels[i + 1] + value);
            pixels[i + 2] = clamp_Uint8(pixels[i + 2] + value);
        }
    }

    return data;
}

function tresholding(imageData, threshold, boundingBox = null) {
    const data = copyImageData(imageData);
    const pixels = data.data;
    const width = imageData.width;
    const height = imageData.height;

    const startX = boundingBox?.x || 0;
    const startY = boundingBox?.y || 0;
    const endX = (boundingBox?.x + boundingBox?.width) || width;
    const endY = (boundingBox?.y + boundingBox?.height) || height;

    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const i = (y * width + x) * 4;
            const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            const val = avg > threshold ? 255 : 0;
            pixels[i]     = val;
            pixels[i + 1] = val;
            pixels[i + 2] = val;
        }
    }

    return data;
}

function invert(imageData, boundingBox = null) {
    const data = copyImageData(imageData);
    const pixels = data.data;
    const width = imageData.width;
    const height = imageData.height;

    const startX = boundingBox?.x || 0;
    const startY = boundingBox?.y || 0;
    const endX = (boundingBox?.x + boundingBox?.width) || width;
    const endY = (boundingBox?.y + boundingBox?.height) || height;

    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const i = (y * width + x) * 4;
            pixels[i]     = 255 - pixels[i];
            pixels[i + 1] = 255 - pixels[i + 1];
            pixels[i + 2] = 255 - pixels[i + 2];
        }
    }

    return data;
}

function boxBlur(imageData, boundingBox = null) {
    if (!boundingBox) {
        return fullBoxBlur(imageData);
    }

    const data = copyImageData(imageData);
    const { x, y, width, height } = boundingBox;

    const cropped = cropImageData(data, x, y, width, height);
    const blurred = fullBoxBlur(cropped);

    pasteImageData(data, blurred, x, y);
    return data;
}

// when we dont have a bounding box (blur the entire image)
function fullBoxBlur(imageData) {
    const kernel = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];
    const weight = 9;

    return applyConvolution(imageData, kernel, weight);
}

function gaussianBlur(imageData, radius = 3, boundingBox = null) {
    if (!boundingBox) {
        return fullGaussianBlur(imageData, radius);
    }

    const data = copyImageData(imageData);
    const { x, y, width, height } = boundingBox;

    const cropped = cropImageData(data, x, y, width, height);
    const blurred = fullGaussianBlur(cropped, radius);

    pasteImageData(data, blurred, x, y);
    return data;
}

// when we dont have a bounding box (blur the entire image)
function fullGaussianBlur(imageData, radius = 3) {
    const sigma = radius / 2;
    const kernelSize = radius * 2 + 1;
    const kernel = [];
    let kernelSum = 0;

    for (let i = -radius; i <= radius; i++) {
        const value = Math.exp(-(i * i) / (2 * sigma * sigma));
        kernel.push(value);
        kernelSum += value;
    }

    for (let i = 0; i < kernel.length; i++) {
        kernel[i] /= kernelSum;
    }

    const width = imageData.width;
    const height = imageData.height;
    const src = imageData.data;
    const tmp = new Uint8ClampedArray(src.length);
    const dst = new Uint8ClampedArray(src.length);

    // Horizontal
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            for (let k = -radius; k <= radius; k++) {
                const px = clampIndex(x + k, 0, width - 1);
                const idx = (y * width + px) * 4;
                const w = kernel[k + radius];
                r += src[idx] * w;
                g += src[idx + 1] * w;
                b += src[idx + 2] * w;
                a += src[idx + 3] * w;
            }
            const idx = (y * width + x) * 4;
            tmp[idx] = r;
            tmp[idx + 1] = g;
            tmp[idx + 2] = b;
            tmp[idx + 3] = a;
        }
    }

    // Vertical
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            for (let k = -radius; k <= radius; k++) {
                const py = clampIndex(y + k, 0, height - 1);
                const idx = (py * width + x) * 4;
                const w = kernel[k + radius];
                r += tmp[idx] * w;
                g += tmp[idx + 1] * w;
                b += tmp[idx + 2] * w;
                a += tmp[idx + 3] * w;
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
function alterColorChannels(imageData, r = 1, g = 1, b = 1, boundingBox = null) {
    const data = copyImageData(imageData);
    const pixels = data.data;
    const width = imageData.width;
    const height = imageData.height;

    const startX = boundingBox?.x || 0;
    const startY = boundingBox?.y || 0;
    const endX = (boundingBox?.x + boundingBox?.width) || width;
    const endY = (boundingBox?.y + boundingBox?.height) || height;

    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const i = (y * width + x) * 4;
            pixels[i]     = clamp_Uint8(pixels[i]     * r);
            pixels[i + 1] = clamp_Uint8(pixels[i + 1] * g);
            pixels[i + 2] = clamp_Uint8(pixels[i + 2] * b);
        }
    }

    return data;
}
