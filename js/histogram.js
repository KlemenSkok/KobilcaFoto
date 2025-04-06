
const graph = new Chart("histogram", {
    type: "bar",
    data: {
        labels: ["0-50", "51-101", "102-152", "153-203", "204-255"],
        datasets: [
            {
                label: "Red",
                backgroundColor: "red"
            },
            {
                label: "Green",
                backgroundColor: "green"
            },
            {
                label: "Blue",
                backgroundColor: "blue"
            }
        ]
    },
    options: {
        legend: {
            display: false
        },
        plugins: {
            customCanvasBackgroundColor: {
                color: "#f5f5f5"
            }
        }
    },
    plugins: [
        {
            id: 'customCanvasBackgroundColor',
            beforeDraw: (chart, args, options) => {
                const {ctx} = chart;
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = options.color || '#fff';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        }
    ]
});



function updateHistogram(imageData) {

    const data = imageData.data;
    const values = [
        [0, 0, 0, 0, 0], // red
        [0, 0, 0, 0, 0], // green
        [0, 0, 0, 0, 0] // blue
    ];

    for(let i = 0; i < data.length; i += 4) {
        for(let j = 0; j < 3; j++) {
            let val = data[i + j];
            if(val < 51)
                values[j][0]++;
            else if(val < 101)
                values[j][1]++;
            else if(val < 152)
                values[j][2]++;
            else if(val < 203)
                values[j][3]++;
            else
                values[j][4]++;
        }
    }

    for(let i = 0; i < 3; i++) {
        graph.data.datasets[i].data = values[i];
    }
    graph.update();

}