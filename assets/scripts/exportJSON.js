function data_parser() {
    const x_ticks_raw = data[0];
    const y_data = data.slice(1);

    const x_min = Math.min(...x_ticks_raw);
    const x_max = Math.max(...x_ticks_raw);

    const y_base = log ? log : null;
    const data_min = Math.min(...y_data.flat());
    const data_max = Math.max(...y_data.flat());
    const y_min = auto ? (log === null ? data_min : Math.pow(log, Math.floor(Math.log(data_min)/Math.log(log)))) : yMin;
    const y_max = auto ? (log === null ? data_max : Math.pow(log, Math.ceil(Math.log(data_max)/Math.log(log)))) : yMax;

    let data_series = [];

    for (let i = 1; i <= series.slice(1).length; i++) {
        data_series.push({
            label: series[i].label,
            color: series[i].stroke,
            data: data[i]
        });
    }

    return {
        grid: {
            title: title,
            x: {
                title: xTitle,
                type: xType,
                time_format: xTime,
                ticks_raw: x_ticks_raw,
                ticks_formatted: xType === 'linear' ? x_ticks_raw.map(num => num.toString()) : x_ticks_raw.map(num => formatElapsed(num, xTime)),
                min: x_min,
                max: x_max,
                range: x_max - x_min
            },
            y: {
                title: yTitle,
                type: yType,
                base: y_base,
                min: y_min > 0 ? y_min : 1,
                max: y_max,
                range: y_max - (y_min > 0 ? y_min : 1)
            }
        },
        graphs: data_series
    };
}

document.getElementById('export-svg').addEventListener('click', () => {
    sessionStorage.setItem('GraphData', JSON.stringify(data_parser()));
    window.location.href = 'svg.html';
});