const width = document.getElementById("plot-page").clientWidth
const height = document.getElementById("plot-page").clientHeight

let data = [];

if (xType === 'linear') {
    data.push(Array.from({ length: xMax - xMin + 1 }, (_, i) => xMin + i));
} else {
    data.push([]);
}
dataset_labels.forEach(element => {
    data.push([]);
});

const time = xType === 'time';

const scale = {
    x: {
        type: xType,
        time: time,
    },
    y: {
        type: yType
    }
}

if (!auto) {
    scale.y.min = yMin;
    scale.y.max = yMax;
}

const axes = [
    {
        label: xTitle
    },
    {
        label: yTitle
    }
];

const series = [{label: xTitle}];

for (let i = 0; i < dataset_labels.length; i++) {
    const [r, g, b] = dataset_colors[i].match(/\w\w/g).map((x) => parseInt(x, 16));
    const rgba = `rgba(${r}, ${g}, ${b}, 0.1)`;
    series.push({
        label: dataset_labels[i],
        stroke: dataset_colors[i],
        fill: fill ? rgba : null,
        points: {
            show: point,
            size: 5,
            stroke: dataset_colors[i],
            fill: rgba,
        },
        scale: "y"
    });
}

const options = {
    title: title,
    width: width,
    height: height,
    scales: scale,
    axes: axes,
    series: series,
};

const chart = new uPlot(options, data, document.getElementById("plot"));