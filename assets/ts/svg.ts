
type data_func = () => void;
type init_func = () => void;
type grid_func = () => void;



function SVG_CONTAINER(_config: SVG_CONFIG, _data: DATA): { data: data_func, init: init_func, grid: grid_func } {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    // Divide config and data
    const dimensions = _config.dimensions;
    const grid_gaps = _config.grid.gaps;
    const grid_lines = _config.grid.lines;
    const data_line = _config.series;
    const data_point = _config.series.point;
    const data_fill = _config.series.fill;
    const series = _data.series;
    const x_data = _data.grid.x;
    const y_data = _data.grid.y;
    const boundaries = { top: dimensions.margins.top, left: dimensions.margins.left, bottom: dimensions.margins.top + dimensions.height.plot, right: dimensions.margins.left + dimensions.width.plot };

    // HELPERS
    // SCALE
    function scale_linear(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
        return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
    }

    function scale_log(value: number, inMin: number, inMax: number, outMin: number, outMax: number, base: number) {
        const log = (num: number) => Math.log(num) / Math.log(base);
        const logInMin = log(inMin);
        const logInMax = log(inMax);
        const logValue = log(value);

        const scaled = (logValue - logInMin) / (logInMax - logInMin);
        return scaled * (outMax - outMin) + outMin;
    }

    function px_y(value: number, base: number | null = null) {
        if (base === null) { return scale_linear(value, y_data.ticks!.min, y_data.ticks!.max, boundaries.bottom, boundaries.top); }
        else { return scale_log(value, y_data.ticks!.min, y_data.ticks!.max, boundaries.bottom, boundaries.top, base); }
    }

    function px_x(value: number) {
        return scale_linear(value, x_data.ticks.min, x_data.ticks.max, boundaries.left, boundaries.right);
    }

    // HEX to RGBA
    function add_alpha(h: color, a: number): rgba {
        let hex = h.replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    };

    // SVG Elements
    function create_line(x1: number, x2: number, y1: number, y2: number, color: rgba, width: number) {
        const new_line = document.createElementNS(SVG_NS, 'line');
        new_line.setAttribute('x1', x1.toString());
        new_line.setAttribute('x2', x2.toString());
        new_line.setAttribute('y1', y1.toString());
        new_line.setAttribute('y2', y2.toString());
        new_line.setAttribute('stroke', color);
        new_line.setAttribute('stroke-width', width.toString());
        return new_line;
    }

    function create_point(x: number, y: number, r: number, color: rgba) {
        const new_point = document.createElementNS(SVG_NS, 'circle');
        new_point.setAttribute('cx', x.toString());
        new_point.setAttribute('cy', y.toString());
        new_point.setAttribute('r', r.toString());
        new_point.setAttribute('fill', color);
        new_point.setAttribute('stroke', 'white');
        new_point.setAttribute('stroke-width', '2');
        return new_point;
    }

    function create_fill(x1: number, x2: number, y1: number, y2: number, color: rgba) {
        const trapezium = document.createElementNS(SVG_NS, 'polygon');
        const points = [
            `${x1},${y1}`,
            `${x2},${y2}`,
            `${x2},${boundaries.bottom}`,
            `${x1},${boundaries.bottom}`
        ].join(' ');
        trapezium.setAttribute('points', points);
        trapezium.setAttribute('fill', color);
        return trapezium;
    }

    function init() { }
    function grid() { }
    function data() { }

    return {
        data: data,
        init: init,
        grid: grid
    }
}