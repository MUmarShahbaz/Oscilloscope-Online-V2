// Dimensions
const width = document.getElementById("plot-page").clientWidth;
const height = document.getElementById("plot-page").clientHeight;

// Data Array Initialization
let data = [];

if (settings.axes.x.type === 'linear') {
    data.push(Array.from({ length: settings.axes.x.linear.max - settings.axes.x.linear.min + 1 }, (_, i) => settings.axes.x.linear.min + i));
} else {
    data.push([]);
}
settings.datasets.labels.forEach(element => {
    data.push([]);
});


// Scale Initialization
const time = settings.axes.x.type === 'time';
const log = settings.axes.y.type != 'linear' ? parseInt(settings.axes.y.type) : false;

const scale = {
    x: {
        type: 'linear',
        time: false,
    },
    y: {
        type: settings.axes.y.type
    }
}

if (log) {
    scale.y.distr = 3;
    scale.y.log = log;
}

if (!settings.axes.y.autoscale) {
    scale.y.min = settings.axes.y.min;
    scale.y.max = settings.axes.y.max;
}

// Axes Initialization
const axes = [
    {
        label: settings.axes.x.title
    },
    {
        label: settings.axes.y.title
    }
];

if (time) axes[0].values = (u, ticks) => ticks.map(t => formatElapsed(t, settings.axes.x.time.format));


// Series Initialization
const series = [{ label: settings.axes.x.title }];

for (let i = 0; i < settings.datasets.labels.length; i++) {
    const [r, g, b] = settings.datasets.colors[i].match(/\w\w/g).map((x) => parseInt(x, 16));
    const rgba = `rgba(${r}, ${g}, ${b}, 0.1)`;
    series.push({
        label: settings.datasets.labels[i],
        stroke: settings.datasets.colors[i],
        fill: settings.datasets.fill ? rgba : null,
        points: {
            show: settings.datasets.points,
            size: 5,
            stroke: settings.datasets.colors[i],
            fill: rgba,
        }
    });
}

// Create the chart
const options = {
    title: settings.title,
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
