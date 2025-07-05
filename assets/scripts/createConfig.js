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
            grid_lines: { axes: { color: axis_color, width: axis_width }, grid: {color: grid_color, width: grid_width, font_color: font_color, font_size: font_size } }
        },
        line: {
            width: line_width,
            alpha: line_alpha,
            point: { show: points, radius: point_radius, alpha: point_alpha },
            fill: { show: fill, alpha: fill_alpha }
        }
    };
}