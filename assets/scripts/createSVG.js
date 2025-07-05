function create_svg() {
    // HELPER FUNCTIONS
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

    function scale_linear(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
    }

    function scale_log(value, inMin, inMax, outMin, outMax, base) {
        const log = (num) => Math.log(num) / Math.log(base);
        const logInMin = log(inMin);
        const logInMax = log(inMax);
        const logValue = log(value);

        const scaled = (logValue - logInMin) / (logInMax - logInMin);
        return scaled * (outMax - outMin) + outMin;
    }

    const px_y = (value, base = null) => {
        if (base === null) { return scale_linear(value, graph.data.grid.y.min, graph.data.grid.y.max, graph.config.dimensions.margins.top + graph.config.dimensions.height.plot, graph.config.dimensions.margins.top); }
        else { return scale_log(value, graph.data.grid.y.min, graph.data.grid.y.max, graph.config.dimensions.margins.top + graph.config.dimensions.height.plot, graph.config.dimensions.margins.top, base); }
    }

    const px_x = (value, base = null) => {
        if (base === null) { return scale_linear(value, graph.data.grid.x.min, graph.data.grid.x.max, graph.config.dimensions.margins.left, graph.config.dimensions.margins.left + graph.config.dimensions.width.plot); }
    }

    const hexToRgba = (h, a) => {
        h = h.replace('#', '');
        if (h.length === 3) h = h.split('').map(c => c + c).join('');
        const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
        return `rgba(${r},${g},${b},${a})`;
    };

    function create_line(x1, x2, y1, y2, color, width) {
        console.log(x1, x2, y1, y2, color);
        const new_line = document.createElementNS(SVG_NS, 'line');
        new_line.setAttribute('x1', x1);
        new_line.setAttribute('x2', x2);
        new_line.setAttribute('y1', y1);
        new_line.setAttribute('y2', y2);
        new_line.setAttribute('stroke', color);
        new_line.setAttribute('stroke-width', width);
        return new_line;
    }

    function create_point(x, y, color, r) {
        const new_point = document.createElementNS(SVG_NS, 'circle');
        new_point.setAttribute('cx', x);
        new_point.setAttribute('cy', y);
        new_point.setAttribute('r', r);
        new_point.setAttribute('fill', color);
        new_point.setAttribute('stroke', 'white');
        new_point.setAttribute('stroke-width', '2');
        return new_point;
    }

    function create_fill(x1, x2, y1, y2, color) {
        const bottom = graph.config.dimensions.margins.top + graph.config.dimensions.height.plot;
        const trapezium = document.createElementNS(SVG_NS, 'polygon');
        const points = [
            `${x1},${y1}`,
            `${x2},${y2}`,
            `${x2},${bottom}`,
            `${x1},${bottom}`
        ].join(' ');
        trapezium.setAttribute('points', points);
        trapezium.setAttribute('fill', color);
        return trapezium;
    }

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const graph = { config: create_config(), data: graphData }
    const base = graph.data.grid.y.type === 'linear' ? null : parseInt(graph.data.grid.y.type);
    console.log(graph);


    // INIT SVG
    const export_svg = document.createElementNS(SVG_NS, 'svg');
    export_svg.setAttribute('width', graph.config.dimensions.width.image);
    export_svg.setAttribute('height', graph.config.dimensions.height.image);
    export_svg.setAttribute('viewBox', `0 0 ${graph.config.dimensions.width.image} ${graph.config.dimensions.height.image}`);

    // Paint BG
    if (graph.config.bg !== null) {
        const bg = document.createElementNS(SVG_NS, 'rect');
        bg.setAttribute('width', graph.config.dimensions.width.image);
        bg.setAttribute('height', graph.config.dimensions.height.image);
        bg.setAttribute('fill', graph.config.bg);
        export_svg.appendChild(bg);
    }

    // DRAW X GRID
    const x_grid_g = document.createElementNS(SVG_NS, 'g');
    const x_gap = graph.config.grid.x_gap.gap_by === 'val' ? graph.config.grid.x_gap.val : graph.data.grid.x.range / (graph.config.dimensions.width.plot / graph.config.grid.x_gap.val);
    for (let i = graph.data.grid.x.min; i <= graph.data.grid.x.max; i += x_gap) {
        const tick_g = document.createElementNS(SVG_NS, 'g');
        tick_g.appendChild(create_line(px_x(i), px_x(i), graph.config.dimensions.margins.top + graph.config.dimensions.height.plot, graph.config.dimensions.margins.top, graph.config.grid.grid_lines.grid.color, graph.config.grid.grid_lines.grid.width));

        const new_text = document.createElementNS(SVG_NS, 'text');
        new_text.setAttribute('x', px_x(i));
        new_text.setAttribute('y', graph.config.dimensions.margins.top + graph.config.dimensions.height.plot + 20);
        new_text.setAttribute('fill', 'black');
        new_text.setAttribute('font-size', graph.config.grid.grid_lines.grid.font_size);
        new_text.setAttribute('text-anchor', 'middle');
        new_text.setAttribute('fill', graph.config.grid.grid_lines.grid.font_color);
        new_text.textContent = graph.data.grid.x.type === 'linear' ? i.toFixed(2).toString() : formatElapsed(Math.floor(i), graph.data.grid.x.time_format);
        tick_g.appendChild(new_text);

        x_grid_g.appendChild(tick_g);
    }
    export_svg.appendChild(x_grid_g);

    // DRAW Y GRID (LINEAR)
    if (graph.data.grid.y.type === 'linear') {
        const y_grid_g = document.createElementNS(SVG_NS, 'g');
        const y_gap = graph.config.grid.y_gap.gap_by === 'val' ? graph.config.grid.y_gap.val : graph.data.grid.y.range / (graph.config.dimensions.height.plot / graph.config.grid.y_gap.val);
        for (let i = graph.data.grid.y.min; i <= graph.data.grid.y.max; i += y_gap) {
            const tick_g = document.createElementNS(SVG_NS, 'g');
            tick_g.appendChild(create_line(graph.config.dimensions.margins.left, graph.config.dimensions.margins.left + graph.config.dimensions.width.plot, px_y(i), px_y(i), graph.config.grid.grid_lines.grid.color, graph.config.grid.grid_lines.grid.width));

            const new_text = document.createElementNS(SVG_NS, 'text');
            new_text.setAttribute('x', graph.config.dimensions.margins.left - 10);
            new_text.setAttribute('y', px_y(i));
            new_text.setAttribute('fill', 'black');
            new_text.setAttribute('font-size', graph.config.grid.grid_lines.grid.font_size);
            new_text.setAttribute('text-anchor', 'end');
            new_text.setAttribute('fill', graph.config.grid.grid_lines.grid.font_color);
            new_text.textContent = i.toFixed(2).toString();
            tick_g.appendChild(new_text);

            y_grid_g.appendChild(tick_g);
        }
        export_svg.appendChild(y_grid_g);
    } else {
        const y_grid_g = document.createElementNS(SVG_NS, 'g');
        for (let i = graph.data.grid.y.min; i <= graph.data.grid.y.max; i *= base) {
            const tick_g = document.createElementNS(SVG_NS, 'g');
            tick_g.appendChild(create_line(graph.config.dimensions.margins.left, graph.config.dimensions.margins.left + graph.config.dimensions.width.plot, px_y(i, base), px_y(i, base), graph.config.grid.grid_lines.grid.color, graph.config.grid.grid_lines.grid.width));

            const new_text = document.createElementNS(SVG_NS, 'text');
            new_text.setAttribute('x', graph.config.dimensions.margins.left - 10);
            new_text.setAttribute('y', px_y(i, base));
            new_text.setAttribute('fill', 'black');
            new_text.setAttribute('font-size', graph.config.grid.grid_lines.grid.font_size);
            new_text.setAttribute('text-anchor', 'end');
            new_text.setAttribute('fill', graph.config.grid.grid_lines.grid.font_color);
            new_text.textContent = parseInt(i).toString();
            tick_g.appendChild(new_text);

            y_grid_g.appendChild(tick_g);

            // Special Sub-ticks for log 10
            if (base === 10 && i != graph.data.grid.y.min) {
                const gap = i / 10;
                for (let j = gap * 2; j < i; j += gap) {
                    if (px_y(j, base) > graph.config.dimensions.margins.top + graph.config.dimensions.height.plot) continue;
                    const tick_g = document.createElementNS(SVG_NS, 'g');
                    tick_g.appendChild(create_line(graph.config.dimensions.margins.left, graph.config.dimensions.margins.left + graph.config.dimensions.width.plot, px_y(j, base), px_y(j, base), graph.config.grid.grid_lines.grid.color, graph.config.grid.grid_lines.grid.width));

                    const new_text = document.createElementNS(SVG_NS, 'text');
                    new_text.setAttribute('x', graph.config.dimensions.margins.left - 10);
                    new_text.setAttribute('y', px_y(j, base));
                    new_text.setAttribute('fill', 'black');
                    new_text.setAttribute('font-size', graph.config.grid.grid_lines.grid.font_size);
                    new_text.setAttribute('text-anchor', 'end');
                    new_text.setAttribute('fill', graph.config.grid.grid_lines.grid.font_color);
                    new_text.textContent = parseInt(j).toString();
                    tick_g.appendChild(new_text);

                    y_grid_g.appendChild(tick_g);
                }
            }
        }
        // Special Sub-ticks for log 10 Underflow case
        if (base === 10) {
            let i = graph.data.grid.y.min;
            while (i < graph.data.grid.y.max) {
                i *= 10;
            }
            const gap = i / 10;
            for (let j = gap * 2; j < i; j += gap) {
                if (px_y(j, base) > graph.config.dimensions.margins.top + graph.config.dimensions.height.plot || px_y(j, base) < graph.config.dimensions.margins.top) continue;
                const tick_g = document.createElementNS(SVG_NS, 'g');
                tick_g.appendChild(create_line(graph.config.dimensions.margins.left, graph.config.dimensions.margins.left + graph.config.dimensions.width.plot, px_y(j, base), px_y(j, base), graph.config.grid.grid_lines.grid.color, graph.config.grid.grid_lines.grid.width));

                const new_text = document.createElementNS(SVG_NS, 'text');
                new_text.setAttribute('x', graph.config.dimensions.margins.left - 10);
                new_text.setAttribute('y', px_y(j, base));
                new_text.setAttribute('fill', 'black');
                new_text.setAttribute('font-size', graph.config.grid.grid_lines.grid.font_size);
                new_text.setAttribute('text-anchor', 'end');
                new_text.setAttribute('fill', graph.config.grid.grid_lines.grid.font_color);
                new_text.textContent = parseInt(j).toString();
                tick_g.appendChild(new_text);

                y_grid_g.appendChild(tick_g);
            }
        }
        export_svg.appendChild(y_grid_g);
    }

    // CONNECT POINTS
    const connect_points_g = document.createElementNS(SVG_NS, 'g');
    for (let i = 0; i < graph.data.graphs.length; i++) {
        const graph_g = document.createElementNS(SVG_NS, 'g');
        for (let j = 0; j < graph.data.graphs[i].data.length - 1; j++) {
            const x1 = graph.data.grid.x.ticks_raw[j];
            const x2 = graph.data.grid.x.ticks_raw[j + 1];
            const y1 = graph.data.graphs[i].data[j];
            const y2 = graph.data.graphs[i].data[j + 1];
            const color = hexToRgba(graph.data.graphs[i].color, graph.config.line.alpha);
            if (y1 !== null && y2 !== null) {
                graph_g.appendChild(create_line(px_x(x1), px_x(x2), px_y(y1, base), px_y(y2, base), color, graph.config.line.width));
            }
        }
        connect_points_g.appendChild(graph_g);
    }
    export_svg.appendChild(connect_points_g);

    // FILL BOTTOM
    if (graph.config.line.fill.show) {
        const fill_g = document.createElementNS(SVG_NS, 'g');
        for (let i = 0; i < graph.data.graphs.length; i++) {
            const graph_g = document.createElementNS(SVG_NS, 'g');
            for (let j = 0; j < graph.data.graphs[i].data.length - 1; j++) {
                const x1 = graph.data.grid.x.ticks_raw[j];
                const x2 = graph.data.grid.x.ticks_raw[j + 1];
                const y1 = graph.data.graphs[i].data[j];
                const y2 = graph.data.graphs[i].data[j + 1];
                const color = hexToRgba(graph.data.graphs[i].color, graph.config.line.fill.alpha);
                if (y1 !== null && y2 !== null) {
                    graph_g.appendChild(create_fill(px_x(x1), px_x(x2), px_y(y1, base), px_y(y2, base), color));
                }
            }
            fill_g.appendChild(graph_g);
        }
        export_svg.appendChild(fill_g);
    }

    // DRAW AXES
    const axes_g = document.createElementNS(SVG_NS, 'g');
    axes_g.appendChild(create_line(graph.config.dimensions.margins.left, graph.config.dimensions.margins.left + graph.config.dimensions.width.plot, graph.config.dimensions.margins.top + graph.config.dimensions.height.plot, graph.config.dimensions.margins.top + graph.config.dimensions.height.plot, graph.config.grid.grid_lines.axes.color, graph.config.grid.grid_lines.axes.width));
    axes_g.appendChild(create_line(graph.config.dimensions.margins.left, graph.config.dimensions.margins.left, graph.config.dimensions.margins.top + graph.config.dimensions.height.plot, graph.config.dimensions.margins.top, graph.config.grid.grid_lines.axes.color, graph.config.grid.grid_lines.axes.width));
    export_svg.appendChild(axes_g);

    // MARK POINTS
    if (graph.config.line.point.show) {
        const points_g = document.createElementNS(SVG_NS, 'g');
        for (let i = 0; i < graph.data.graphs.length; i++) {
            const graph_g = document.createElementNS(SVG_NS, 'g');
            for (let j = 0; j < graph.data.graphs[i].data.length; j++) {
                const x_raw = graph.data.grid.x.ticks_raw[j];
                const y_raw = graph.data.graphs[i].data[j];
                const color = hexToRgba(graph.data.graphs[i].color, graph.config.line.point.alpha);
                if (y_raw === null) continue;
                graph_g.appendChild(create_point(px_x(x_raw), px_y(y_raw, base), color, parseFloat(graph.config.line.point.radius)));
            }
            points_g.appendChild(graph_g);
        }
        export_svg.appendChild(points_g);
    }

    return export_svg;
}