function data_parser() {
    const x_ticks_raw = data[0];
    const y_data = data.slice(1);

    const x_min = Math.min(...x_ticks_raw);
    const x_max = Math.max(...x_ticks_raw);

    const y_base = log ? log : null;
    const data_min = Math.min(...y_data.flat());
    const data_max = Math.max(...y_data.flat());
    const y_min = settings.axes.y.autoscale ? (y_base === null ? data_min : Math.pow(log, Math.floor(Math.log(data_min) / Math.log(log)))) : settings.axes.y.min;
    const y_max = settings.axes.y.autoscale ? (y_base === null ? data_max : Math.pow(log, Math.ceil(Math.log(data_max) / Math.log(log)))) : settings.axes.y.max;

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
            title: settings.title,
            x: {
                title: settings.axes.x.title,
                type: settings.axes.x.type,
                time_format: settings.axes.x.time.format,
                ticks_raw: x_ticks_raw,
                ticks_formatted: settings.axes.x.type === 'linear' ? x_ticks_raw.map(num => num.toString()) : x_ticks_raw.map(num => formatElapsed(num, settings.axes.x.time.format)),
                min: x_min,
                max: x_max,
                range: x_max - x_min
            },
            y: {
                title: settings.axes.y.title,
                type: settings.axes.y.type,
                base: y_base,
                min: y_min > 0 ? y_min : 1,
                max: y_max,
                range: y_max - (y_min > 0 ? y_min : 1)
            }
        },
        graphs: data_series
    };
}

function create_config() {
    const bg_color = document.getElementById('transparent-bg').value === 'true' ? null : document.getElementById('bg-color').value;

    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);
    const left = parseInt(document.getElementById('m-left').value);
    const right = parseInt(document.getElementById('m-right').value);
    const top = parseInt(document.getElementById('m-top').value);
    const bottom = parseInt(document.getElementById('m-bottom').value);

    const x_gap_by = document.getElementById('x-gap-by').value;
    const x_gap_val = parseFloat(document.getElementById('x-gap-val').value);
    const y_gap_by = document.getElementById('y-gap-by').value;
    const y_gap_val = parseFloat(document.getElementById('y-gap-val').value);

    const axis_color = document.getElementById('axis-color').value;
    const axis_width = parseFloat(document.getElementById('axis-width').value);

    const grid_color = document.getElementById('grid-color').value;
    const grid_width = parseFloat(document.getElementById('grid-width').value);
    const font_color = document.getElementById('font-color').value;
    const font_size = parseInt(document.getElementById('font-size').value);

    const line_width = parseFloat(document.getElementById('line-width').value);
    const line_alpha = parseFloat(document.getElementById('line-alpha').value);

    const points = document.getElementById('points').value === 'true';
    const point_radius = parseInt(document.getElementById('points-radius').value);
    const point_alpha = parseFloat(document.getElementById('points-alpha').value);

    const fill = document.getElementById('fill').value === 'true';
    const fill_alpha = parseFloat(document.getElementById('fill-alpha').value);

    return {
        bg: bg_color,
        dimensions: {
            width: { image: width, plot: width - left - right },
            height: { image: height, plot: height - top - bottom },
            margins: { left: left, right: right, top: top, bottom: bottom },
        },
        grid: {
            x_gap: { gap_by: x_gap_by, val: x_gap_val },
            y_gap: { gap_by: y_gap_by, val: y_gap_val },
            grid_lines: { axes: { color: axis_color, width: axis_width }, grid: { color: grid_color, width: grid_width, font_color: font_color, font_size: font_size } }
        },
        line: {
            width: line_width,
            alpha: line_alpha,
            point: { show: points, radius: point_radius, alpha: point_alpha },
            fill: { show: fill, alpha: fill_alpha }
        }
    };
}

function create_settings() {
    // Serial Values
    const baud = parseInt(document.getElementById('baud').value);
    const breakChar = document.getElementById('break_char').value;
    const cls = document.getElementById('cls_char').value;
    const csv = document.getElementById('csv_char').value;
    const png = document.getElementById('png_char').value;
    const svg = document.getElementById('svg_char').value;

    // Grid Values
    const title = document.getElementById('title').value;
    const xTitle = document.getElementById('xTitle').value;
    const yTitle = document.getElementById('yTitle').value;

    const xType = document.getElementById('xType').value;
    const xMin = (xType === 'linear') ? parseInt(document.getElementById('xMin').value) : null;
    const xMax = (xType === 'linear') ? parseInt(document.getElementById('xMax').value) : null;
    const xTime = (xType === 'time') ? document.getElementById('xTime').value : null;
    const xTimeMax = (xType === 'time') ? parseInt(document.getElementById('xTimeMax').value) : null;
    const xTimeManual = (xType === 'time') ? (document.getElementById('xTimeManual').value === 'true') : null;

    const yType = document.getElementById('yType').value;
    const auto = document.getElementById('auto').value === 'true';
    const yMin = auto ? null : parseInt(document.getElementById('yMin').value);
    const yMax = auto ? null : parseInt(document.getElementById('yMax').value);

    // Graph Values
    const points = document.getElementById('points').value === 'true';
    const fill = document.getElementById('fill').value === 'true';

    // Get Graph section values
    const graphNum = parseInt(document.getElementById('graphNum').value, 10);
    const dataset_labels = [];
    const dataset_colors = [];

    for (let i = 1; i <= graphNum; i++) {
        const graphName = document.getElementById(`graph${i}Name`).value;
        const graphColor = document.getElementById(`graph${i}Color`).value;
        dataset_labels.push(graphName);
        dataset_colors.push(graphColor);
    }

    // Return the data as an object
    return {
        title: title,
        serial: {
            baud_rate: baud,
            break: breakChar,
            mcu_commands: {
                cls: cls,
                csv: csv,
                png: png,
                svg: svg
            }
        },
        datasets: {
            labels: dataset_labels,
            colors: dataset_colors,
            points: points,
            fill: fill
        },
        axes: {
            x: {
                title: xTitle,
                type: xType,
                time: {
                    format: xTime,
                    max_readings: xTimeMax,
                    manual: xTimeManual
                },
                linear: {
                    min: xMin,
                    max: xMax
                }
            },
            y: {
                title: yTitle,
                type: yType,
                autoscale: auto,
                min: yMin,
                max: yMax
            }
        }
    };
};