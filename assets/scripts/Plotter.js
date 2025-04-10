// Dimensions
const width = document.getElementById("plot-page").clientWidth;
const height = document.getElementById("plot-page").clientHeight;

// Data Array Initialization
let data = [];

if (xType === 'linear') {
    data.push(Array.from({ length: xMax - xMin + 1 }, (_, i) => xMin + i));
} else {
    data.push([]);
}
dataset_labels.forEach(element => {
    data.push([]);
});


// Scale Initialization
const time = xType === 'time';
const log = yType != 'linear' ? parseInt(yType) : false;

const scale = {
    x: {
        type: xType,
        time: time,
    },
    y: {
        type: yType
    }
}

if (log) {
    scale.y.distr = 3;
    scale.y.log = log;
}

if (!auto) {
    scale.y.min = yMin;
    scale.y.max = yMax;
}

// Axes Initialization
const axes = [
    {
        label: xTitle
    },
    {
        label: yTitle
    }
];

if (time) axes[0].values = (u, ticks) => ticks.map(t => formatElapsed(t, xTime));


// Series Initialization
const series = [{ label: xTitle }];

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
        }
    });
}

// Create the chart
const options = {
    title: title,
    width: width,
    height: height,
    scales: scale,
    axes: axes,
    series: series,
    pixelRatio: window.devicePixelRatio || 1
};

const chart = new uPlot(options, data, document.getElementById("plot"));
console.log("Chart initialized:", chart);

function formatElapsed(ms, format) {
    ms = Math.round((ms - startTime) * 1000);
    const sec = Math.floor(ms / 1000);
    const msec = ms % 1000;
    const s = sec % 60;
    const m = Math.floor((sec / 60) % 60);
    const h = Math.floor((sec / 3600) % 24);
    const d = Math.floor(sec / 86400);

    switch (format) {
        case "ms":
            return `${ms}ms`;
        case "s.ms":
            return `${sec}.${msec.toString().padStart(3, '0')}s`;
        case "m:s":
            return `${m}:${s.toString().padStart(2, '0')}`;
        case "h:m:s":
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        case "d-h:m":
            return `${d}-${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
}
