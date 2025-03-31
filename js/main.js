
import { grayscale } from "./filters.js";



const image = new Image();
//image.src = "https://www.w3schools.com/html/img_chania.jpg";





function draw() {
    const canvas = document.getElementById("canvas");


    const ctx = canvas.getContext("2d", { willReadFrequently: true });


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);


}

draw();




document.getElementById("grayscale-btn").addEventListener("click", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newImageData = grayscale(imageData);
    ctx.putImageData(newImageData, 0, 0);
})

