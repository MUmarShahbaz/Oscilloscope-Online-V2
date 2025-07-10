type data_func = (new_data?: DATA, refresh_grid?: boolean) => SVGElement;
type init_func = (parent?: HTMLElement) => SVGElement;
type grid_func = (append?: boolean) => SVGElement;



function SVG_GENERATOR(_config: SVG_CONFIG, _data: DATA, _id: string): { id: string, data: data_func, init: init_func, grid: grid_func } {
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
    // TIME FORMATTER
    function formatElapsed(ms: number, format: time_format) {
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

    function init(parent: HTMLElement | false = false): SVGElement {
        // INIT SVG
        const export_svg = document.createElementNS(SVG_NS, 'svg');
        export_svg.setAttribute('width', dimensions.width.image.toString());
        export_svg.setAttribute('height', dimensions.height.image.toString());
        export_svg.setAttribute('viewBox', `0 0 ${dimensions.width.image} ${dimensions.height.image}`);
        export_svg.setAttribute('id', _id);

        // Paint BG
        if (_config.bg !== null) {
            const bg = document.createElementNS(SVG_NS, 'rect');
            bg.setAttribute('width', dimensions.width.image.toString());
            bg.setAttribute('height', dimensions.height.image.toString());
            bg.setAttribute('fill', _config.bg);
            export_svg.appendChild(bg);
        }
        if (parent) parent.appendChild(export_svg);
        return export_svg;
    }

    function grid(append: boolean = true): SVGElement {
        const grid = document.createElementNS(SVG_NS, 'g');
        grid.setAttribute('id', `${_id}_grid`);

        // DRAW X GRID
        const x_grid_g = document.createElementNS(SVG_NS, 'g');
        const x_gap = grid_gaps.x.gap_by === 'val' ? grid_gaps.x.val : x_data.ticks.range / (dimensions.width.plot / grid_gaps.x.val);

        for (let i = x_data.ticks.min; i <= x_data.ticks.max; i += x_gap) {
            const tick_g = document.createElementNS(SVG_NS, 'g');
            tick_g.appendChild(create_line(px_x(i), px_x(i), boundaries.bottom, boundaries.top, add_alpha(grid_lines.main.color, 1), grid_lines.main.width));

            const new_text = document.createElementNS(SVG_NS, 'text');
            new_text.setAttribute('x', px_x(i).toString());
            new_text.setAttribute('y', (boundaries.bottom + 20).toString());
            new_text.setAttribute('fill', 'black');
            new_text.setAttribute('font-size', grid_lines.font.size.toString());
            new_text.setAttribute('text-anchor', 'middle');
            new_text.setAttribute('fill', grid_lines.font.color);
            new_text.textContent = x_data.type === 'linear' ? i.toFixed(2).toString() : formatElapsed(Math.floor(i), x_data.time_format!);
            tick_g.appendChild(new_text);

            x_grid_g.appendChild(tick_g);
        }
        grid.appendChild(x_grid_g);

        // DRAW Y GRID (LINEAR)
        const y_grid_g = document.createElementNS(SVG_NS, 'g');
        if (y_data.type === 'linear') {
            const y_gap = grid_gaps.y!.gap_by === 'val' ? grid_gaps.y!.val : y_data.ticks!.range / (dimensions.height.plot / grid_gaps.y!.val);
            for (let i = y_data.ticks!.min; i <= y_data.ticks!.max; i += y_gap) {
                const tick_g = document.createElementNS(SVG_NS, 'g');
                tick_g.appendChild(create_line(boundaries.left, boundaries.right, px_y(i), px_y(i), add_alpha(grid_lines.main.color, 1), grid_lines.main.width));

                const new_text = document.createElementNS(SVG_NS, 'text');
                new_text.setAttribute('x', (boundaries.left - 10).toString());
                new_text.setAttribute('y', px_y(i).toString());
                new_text.setAttribute('fill', 'black');
                new_text.setAttribute('font-size', grid_lines.font.size.toString());
                new_text.setAttribute('text-anchor', 'end');
                new_text.setAttribute('fill', grid_lines.font.color);
                new_text.textContent = i.toFixed(2).toString();
                tick_g.appendChild(new_text);

                y_grid_g.appendChild(tick_g);
            }
        } else {
            for (let i = y_data.ticks!.min; i <= y_data.ticks!.max; i *= y_data.base!) {
                const tick_g = document.createElementNS(SVG_NS, 'g');
                tick_g.appendChild(create_line(boundaries.left, boundaries.right, px_y(i, y_data.base!), px_y(i, y_data.base!), add_alpha(grid_lines.main.color, 1), grid_lines.main.width));

                const new_text = document.createElementNS(SVG_NS, 'text');
                new_text.setAttribute('x', (boundaries.left - 10).toString());
                new_text.setAttribute('y', px_y(i, y_data.base!).toString());
                new_text.setAttribute('fill', 'black');
                new_text.setAttribute('font-size', grid_lines.font.size.toString());
                new_text.setAttribute('text-anchor', 'end');
                new_text.setAttribute('fill', grid_lines.font.color);
                new_text.textContent = Math.trunc(i).toString();
                tick_g.appendChild(new_text);

                y_grid_g.appendChild(tick_g);

                // Special Sub-ticks for log 10
                if (y_data.base! === 10 && i != y_data.ticks!.min) {
                    const gap = i / 10;
                    for (let j = gap * 2; j < i; j += gap) {
                        if (px_y(j, y_data.base) > boundaries.bottom) continue;
                        const tick_g = document.createElementNS(SVG_NS, 'g');
                        tick_g.appendChild(create_line(boundaries.left, boundaries.right, px_y(j, y_data.base!), px_y(j, y_data.base!), add_alpha(grid_lines.main.color, 1), grid_lines.main.width));

                        const new_text = document.createElementNS(SVG_NS, 'text');
                        new_text.setAttribute('x', (boundaries.left - 10).toString());
                        new_text.setAttribute('y', px_y(j, y_data.base!).toString());
                        new_text.setAttribute('fill', 'black');
                        new_text.setAttribute('font-size', grid_lines.font.size.toString());
                        new_text.setAttribute('text-anchor', 'end');
                        new_text.setAttribute('fill', grid_lines.font.color);
                        new_text.textContent = Math.trunc(j).toString();
                        tick_g.appendChild(new_text);

                        y_grid_g.appendChild(tick_g);
                    }
                }
            }
            // Special Sub-ticks for log 10 Underflow case
            if (y_data.base! === 10) {
                let i = y_data.ticks!.min;
                while (i < y_data.ticks!.max) {
                    i *= 10;
                }
                const gap = i / 10;
                for (let j = gap * 2; j < i; j += gap) {
                    if (px_y(j, y_data.base!) > boundaries.bottom || px_y(j, y_data.base!) < boundaries.top) continue;
                    const tick_g = document.createElementNS(SVG_NS, 'g');
                    tick_g.appendChild(create_line(boundaries.left, boundaries.right, px_y(j, y_data.base!), px_y(j, y_data.base!), add_alpha(grid_lines.main.color, 1), grid_lines.main.width));

                    const new_text = document.createElementNS(SVG_NS, 'text');
                    new_text.setAttribute('x', (boundaries.left - 10).toString());
                    new_text.setAttribute('y', px_y(j, y_data.base!).toString());
                    new_text.setAttribute('fill', 'black');
                    new_text.setAttribute('font-size', grid_lines.font.size.toString());
                    new_text.setAttribute('text-anchor', 'end');
                    new_text.setAttribute('fill', grid_lines.font.color);
                    new_text.textContent = Math.trunc(j).toString();
                    tick_g.appendChild(new_text);

                    y_grid_g.appendChild(tick_g);
                }
            }
        }
        grid.appendChild(y_grid_g);
        if (append) {
            document.getElementById(_id)?.querySelector(`#${_id}_grid`)?.remove();
            document.getElementById(_id)?.appendChild(grid);
        }
        return grid;
    }
    function data(new_data: DATA | false = false, refresh_grid: boolean = false): SVGElement {
        if (new_data) _data = new_data;
        if (refresh_grid) grid();

        const datasets = document.createElementNS(SVG_NS, 'g');

        return datasets;
    }

    return {
        id: _id,
        data: data,
        init: init,
        grid: grid
    }
}