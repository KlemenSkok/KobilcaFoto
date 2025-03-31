
// Working with <canvas>

let drawing = false;


// -- EVENT LISTENERS -- //


canvas.addEventListener("mousedown", () => {
    drawing = true;
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
});

canvas.addEventListener("mousemove", (event) => {
    if(!drawing)
            return;
    
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(event.offsetX, event.offsetY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
});



