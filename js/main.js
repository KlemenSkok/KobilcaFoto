

const image = new Image();
//image.src = "https://www.w3schools.com/html/img_chania.jpg";



const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

canvas.width = 700;
canvas.height = 400;


const initialData = copyImageData(ctx.createImageData(canvas.width, canvas.height));
let lastSave = copyImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));


const bufferSize = 10; // max undoBuffer size
const undoBuffer = [];
const redoBuffer = [];


function getLastSave() {
    return new ImageData(
        new Uint8ClampedArray(lastSave.data),
        lastSave.width,
        lastSave.height
    );
}

function setLastSave(imageData) {
    lastSave = new ImageData(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height
    );

    undoBuffer.push(copyImageData(lastSave));
    redoBuffer.length = 0; // clear redoBuffer

    if(undoBuffer.length > bufferSize + 1) {
        undoBuffer.shift();
    }

    //console.log(`image saved. undoBuffer length: ${undoBuffer.length}`);
}
setLastSave(initialData);

function undo() {
    if(undoBuffer.length > 1) {
        redoBuffer.push(undoBuffer.pop());
        lastImageData = undoBuffer[undoBuffer.length - 1] || initialData;
        if(lastImageData.width !== canvas.width || lastImageData.height !== canvas.height) {
            // resize canvas
            canvas.width = lastImageData.width;
            canvas.height = lastImageData.height;
        }
        ctx.putImageData(lastImageData, 0, 0);
        lastSave = lastImageData;
    }
    //console.log(`undo. undoBuffer length: ${undoBuffer.length}`);
}

function redo() {
    if(redoBuffer.length > 0) {
        undoBuffer.push(redoBuffer.pop());
        lastImageData = undoBuffer[undoBuffer.length - 1];
        if(lastImageData.width !== canvas.width || lastImageData.height !== canvas.height) {
            // resize canvas
            canvas.width = lastImageData.width;
            canvas.height = lastImageData.height;
        }
        ctx.putImageData(lastImageData, 0, 0);
        lastSave = lastImageData;
    }
    //console.log(`redo. redoBuffer length: ${redoBuffer.length}`);
}