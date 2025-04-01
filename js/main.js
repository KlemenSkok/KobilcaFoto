

const image = new Image();
//image.src = "https://www.w3schools.com/html/img_chania.jpg";



const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });


// undo/redo funkcije
const undoBuffer = [];
const redoBuffer = [];
var undoBufferIndex = -1;
var redoBufferIndex = -1;


function saveToBuffer() {
    console.log("Saving to buffer...");
    const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoBuffer.push(canvasData);
    undoBufferIndex++;
    // Clear the redo buffer
    redoBuffer.length = 0;
    redoBufferIndex = -1;
    console.log(undoBuffer);
    console.log(undoBufferIndex);
}

function undo() {
    if(undoBufferIndex > 0) {
        redoBuffer.push(undoBuffer.pop());
        undoBufferIndex--;
        ctx.width = undoBuffer[undoBufferIndex].width;
        ctx.height = undoBuffer[undoBufferIndex].height;
        ctx.clearRect(0, 0, ctx.width, ctx.height); // Clear the canvas
        ctx.putImageData(undoBuffer[undoBufferIndex], 0, 0);
    }
}

function redo() {
    if(redoBufferIndex >= 0) {
        undoBuffer.push(redoBuffer.pop());
        undoBufferIndex++;
        ctx.width = undoBuffer[undoBufferIndex].width;
        ctx.height = undoBuffer[undoBufferIndex].height;
        ctx.clearRect(0, 0, ctx.width, ctx.height); // Clear the canvas
        ctx.putImageData(undoBuffer[undoBufferIndex], 0, 0);
    }
}

saveToBuffer(); // save the image to the undo buffer
