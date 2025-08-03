namespace setup_form {
    export function create_config(form: HTMLFormElement): uPlot_Controller.CONFIG {
        const setup = new FormData(form);

        const serial_info: uPlot_Controller.CONFIG['serial'] = {
            break: setup.get('breakChar')! as string,
            mcu_commands: {
                cls: setup.get('clsChar')! as string,
                csv: setup.get('csvChar')! as string,
                png: setup.get('pngChar')! as string,
                json: setup.get('jsonChar')! as string,
            }
        };
        let x_axis: uPlot_Controller.CONFIG['chart']['x'];
        let y_axis: uPlot_Controller.CONFIG['chart']['y'];

        if (setup.get('xAxisType') === 'linear') {
            x_axis = {
                type: 'linear',
                title: setup.get('xAxisTitle')! as string,
                min: parseInt(setup.get('xAxisMin')! as string),
                max: parseInt(setup.get('xAxisMax')! as string)
            }
        } else {
            x_axis = {
                type: 'time',
                title: setup.get('xAxisTitle')! as string,
                manual: setup.get('manualTime') !== null,
                format: setup.get('timeFormat')! as uPlot_Controller.time_format,
                max: parseInt(setup.get('maxReadings')! as string)
            }
        }

        if (setup.get('yAxisType') === 'linear') {
            if (setup.get('autoScale') !== null) {
                y_axis = {
                    type: 'linear-auto',
                    title: setup.get('yAxisTitle')! as string
                };
            } else {
                y_axis = {
                    type: 'linear-manual',
                    title: setup.get('yAxisTitle')! as string,
                    min: parseInt(setup.get('yAxisMin')! as string),
                    max: parseInt(setup.get('yAxisMax')! as string)
                }
            }

        } else {
            y_axis = {
                type: 'log',
                title: setup.get('yAxisTitle')! as string,
                base: setup.get('yAxisType') === 'log2' ? 2 : 10
            };
        }

        let opt: uPlot_Controller.CONFIG['chart']['options'] = {
            points: setup.get('showPoints') !== null,
            fill: setup.get('fillArea') !== null
        };


        const num_of_graphs = parseInt(setup.get('graphCount') as string);

        let datasets: uPlot_Controller.CONFIG['datasets'] = [];
        for (let i = 1; i <= num_of_graphs; i++) {
            let label: string = setup.get(`graph${i}Name`) as string;
            let color: uPlot_Controller.color = setup.get(`graph${i}Color`) as uPlot_Controller.color;

            datasets.push({ label: label, color: color });
        }

        return {
            serial: serial_info,
            chart: {
                title: setup.get('chartTitle') as string,
                x: x_axis,
                y: y_axis,
                options: opt
            },
            datasets: datasets
        };
    }

    export function set_config(form: HTMLFormElement, config: uPlot_Controller.CONFIG, form_updater: Function) {
        const { serial, chart, datasets } = config;
        const { title, x, y, options } = chart;

        // Set serial configuration
        (form.elements.namedItem('breakChar') as HTMLInputElement).value = serial.break;
        (form.elements.namedItem('clsChar') as HTMLInputElement).value = serial.mcu_commands.cls;
        (form.elements.namedItem('csvChar') as HTMLInputElement).value = serial.mcu_commands.csv;
        (form.elements.namedItem('pngChar') as HTMLInputElement).value = serial.mcu_commands.png;
        (form.elements.namedItem('jsonChar') as HTMLInputElement).value = serial.mcu_commands.json;

        // Set chart title
        (form.elements.namedItem('chartTitle') as HTMLInputElement).value = title;

        // Set X-axis configuration
        if (x.type === 'linear') {
            (form.elements.namedItem('xAxisType') as HTMLInputElement).value = 'linear';
            (form.elements.namedItem('xAxisTitle') as HTMLInputElement).value = x.title;
            (form.elements.namedItem('xAxisMin') as HTMLInputElement).value = x.min.toString();
            (form.elements.namedItem('xAxisMax') as HTMLInputElement).value = x.max.toString();
        } else {
            (form.elements.namedItem('xAxisType') as HTMLInputElement).value = 'time';
            (form.elements.namedItem('xAxisTitle') as HTMLInputElement).value = x.title;
            (form.elements.namedItem('manualTime') as HTMLInputElement).checked = x.manual;
            (form.elements.namedItem('timeFormat') as HTMLSelectElement).value = x.format;
            (form.elements.namedItem('maxReadings') as HTMLInputElement).value = x.max.toString();
        }

        // Set Y-axis configuration
        if (y.type === 'linear-auto') {
            (form.elements.namedItem('yAxisType') as HTMLInputElement).value = 'linear';
            (form.elements.namedItem('yAxisTitle') as HTMLInputElement).value = y.title;
            (form.elements.namedItem('autoScale') as HTMLInputElement).checked = true;
        } else if (y.type === 'linear-manual') {
            (form.elements.namedItem('yAxisType') as HTMLInputElement).value = 'linear';
            (form.elements.namedItem('yAxisTitle') as HTMLInputElement).value = y.title;
            (form.elements.namedItem('autoScale') as HTMLInputElement).checked = false;
            (form.elements.namedItem('yAxisMin') as HTMLInputElement).value = y.min.toString();
            (form.elements.namedItem('yAxisMax') as HTMLInputElement).value = y.max.toString();
        } else {
            (form.elements.namedItem('yAxisType') as HTMLInputElement).value = y.base === 2 ? 'log2' : 'log10';
            (form.elements.namedItem('yAxisTitle') as HTMLInputElement).value = y.title;
        }

        // Set chart options
        (form.elements.namedItem('showPoints') as HTMLInputElement).checked = options.points;
        (form.elements.namedItem('fillArea') as HTMLInputElement).checked = options.fill;

        // Set datasets configuration
        (form.elements.namedItem('graphCount') as HTMLInputElement).value = datasets.length.toString();
        form_updater();

        for (let i = 0; i < datasets.length; i++) {
            const dataset = datasets[i];
            const graphNum = i + 1;
            (form.elements.namedItem(`graph${graphNum}Name`) as HTMLInputElement).value = dataset.label;
            (form.elements.namedItem(`graph${graphNum}Color`) as HTMLInputElement).value = dataset.color;
        }
    }

    export function ui(DOM_Elements: Forms.setup.DOM_Elements, form: HTMLFormElement): Forms.setup.Refresher {
        // Toggle between time and linear settings
        function toggleTimeSettings() {
            if (DOM_Elements.xType.value === "time") {
                DOM_Elements.timeS.style.display = "block";
                DOM_Elements.linearS.style.display = "none";
            } else {
                DOM_Elements.timeS.style.display = "none";
                DOM_Elements.linearS.style.display = "block";
            }
        }

        // Update auto scale logic based on Y-axis type
        function updateAutoScaleLogic() {
            const isLogScale = DOM_Elements.yType.value === "log10" || DOM_Elements.yType.value === "log2";

            if (isLogScale) {
                // Force auto scale for logarithmic Y-axis
                DOM_Elements.auto.checked = true;
                DOM_Elements.auto.disabled = true;
                DOM_Elements.yRange.style.display = "none";
            } else {
                // Enable auto scale checkbox for linear Y-axis
                DOM_Elements.auto.disabled = false;
                DOM_Elements.yRange.style.display = DOM_Elements.auto.checked ? "none" : "block";
            }
        }

        // Update graph configurations based on count
        function updateGraphConfigs() {
            DOM_Elements.graphsS.innerHTML = "";
            const count = parseInt(DOM_Elements.graphs.value);
            const colors = [
                "#007bff", "#28a745", "#dc3545", "#ffc107", "#17a2b8",
                "#6f42c1", "#fd7e14", "#20c997", "#6c757d", "#343a40"
            ];

            for (let i = 1; i <= count; i++) {
                const graphDiv = document.createElement("div");
                graphDiv.className = "border rounded p-3 mb-3 graph-config";
                graphDiv.setAttribute("data-graph", i.toString());

                const color = colors[(i - 1) % colors.length];
                graphDiv.innerHTML = `
        <h5 class="mb-3">Graph ${i} Configuration</h5>
        <div class="row g-3">
          <div class="col-md-6">
            <label for="graph${i}Name" class="form-label">Graph Name</label>
            <input type="text" class="form-control" id="graph${i}Name" name="graph${i}Name" value="Graph ${i}" required>
          </div>
          <div class="col-md-6">
            <label for="graph${i}Color" class="form-label">Graph Color</label>
            <input type="color" class="form-control form-control-color" id="graph${i}Color" name="graph${i}Color" value="${color}" required>
          </div>
        </div>
      `;
                DOM_Elements.graphsS.appendChild(graphDiv);
            }
        }

        function refresh_form() {
            toggleTimeSettings();
            updateAutoScaleLogic();
            updateGraphConfigs();
        }

        const default_config: uPlot_Controller.CONFIG = {
            "serial": {
                "break": "/",
                "mcu_commands": {
                    "cls": "%",
                    "csv": "@",
                    "png": "&",
                    "json": "$"
                }
            },
            "chart": {
                "title": "Oscilloscope",
                "x": {
                    "type": "linear",
                    "title": "Index",
                    "min": 0,
                    "max": 500
                },
                "y": {
                    "type": "linear-auto",
                    "title": "Value"
                },
                "options": {
                    "points": false,
                    "fill": false
                }
            },
            "datasets": [
                {
                    "label": "Graph 1",
                    "color": "#007bff"
                }
            ]
        };

        function reset_form() {
            set_config(form, default_config, refresh_form);
        }

        return {
            all: refresh_form,
            x: toggleTimeSettings,
            y: updateAutoScaleLogic,
            graphs: updateGraphConfigs,
            reset: reset_form
        };
    }
}

namespace svg_form {
    export function create_config(form: HTMLFormElement): SVG.CONFIG {
        const formData = new FormData(form);
        
        // Background configuration
        let bg: SVG.CONFIG['bg'] = null;
        if (!formData.get('bgTransparent')) {
            bg = formData.get('bgColor') as SVG.color;
        }

        // Dimensions configuration
        const imageWidth = parseInt(formData.get('imageWidth') as string);
        const imageHeight = parseInt(formData.get('imageHeight') as string);
        const marginLeft = parseInt(formData.get('marginLeft') as string);
        const marginRight = parseInt(formData.get('marginRight') as string);
        const marginTop = parseInt(formData.get('marginTop') as string);
        const marginBottom = parseInt(formData.get('marginBottom') as string);

        const dimensions: SVG.CONFIG['dimensions'] = {
            width: {
                image: imageWidth,
                plot: imageWidth - marginLeft - marginRight
            },
            height: {
                image: imageHeight,
                plot: imageHeight - marginTop - marginBottom
            },
            margins: {
                left: marginLeft,
                right: marginRight,
                top: marginTop,
                bottom: marginBottom
            }
        };

        // Grid configuration
        const gridXGap = parseInt(formData.get('gridXGap') as string);
        const gridXGapMode = formData.get('gridXGapMode') as SVG.gap_mode;
        
        let gridYGap: SVG.CONFIG['grid']['gaps']['y'] = null;
        if (formData.get('gridYGap')) {
            const yGapVal = parseInt(formData.get('gridYGap') as string);
            const yGapMode = formData.get('gridYGapMode') as SVG.gap_mode;
            gridYGap = { gap_by: yGapMode, val: yGapVal };
        }

        const axesWidth = parseFloat(formData.get('axesWidth') as string);
        const axesColor = formData.get('axesColor') as SVG.color;
        const gridWidth = parseFloat(formData.get('gridWidth') as string);
        const gridColor = formData.get('gridColor') as SVG.color;
        const fontSize = parseInt(formData.get('fontSize') as string);
        const fontColor = formData.get('fontColor') as SVG.color;

        const grid: SVG.CONFIG['grid'] = {
            gaps: {
                x: { gap_by: gridXGapMode, val: gridXGap },
                y: gridYGap
            },
            lines: {
                axes: { color: axesColor, width: axesWidth },
                main: { color: gridColor, width: gridWidth },
                font: { color: fontColor, size: fontSize }
            }
        };

        // Series configuration
        const seriesWidth = parseFloat(formData.get('seriesWidth') as string);
        const seriesAlpha = parseFloat(formData.get('seriesAlpha') as string);

        let point: SVG.CONFIG['series']['point'] = null;
        if (formData.get('showPoints')) {
            const pointRadius = parseFloat(formData.get('pointRadius') as string);
            const pointAlpha = parseFloat(formData.get('pointAlpha') as string);
            point = { radius: pointRadius, alpha: pointAlpha };
        }

        let fill: SVG.CONFIG['series']['fill'] = null;
        if (formData.get('showFill')) {
            const fillAlpha = parseFloat(formData.get('fillAlpha') as string);
            fill = { alpha: fillAlpha };
        }

        const series: SVG.CONFIG['series'] = {
            width: seriesWidth,
            alpha: seriesAlpha,
            point: point,
            fill: fill
        };

        return {
            bg: bg,
            dimensions: dimensions,
            grid: grid,
            series: series
        };
    }
    export function set_config(form: HTMLFormElement, config: SVG.CONFIG, form_updater: Function) {
        const { bg, dimensions, grid, series } = config;

        // Set background configuration
        if (bg === null) {
            (form.elements.namedItem('bgTransparent') as HTMLInputElement).checked = true;
        } else {
            (form.elements.namedItem('bgTransparent') as HTMLInputElement).checked = false;
            (form.elements.namedItem('bgColor') as HTMLInputElement).value = bg;
        }

        // Set dimensions configuration
        (form.elements.namedItem('imageWidth') as HTMLInputElement).value = dimensions.width.image.toString();
        (form.elements.namedItem('imageHeight') as HTMLInputElement).value = dimensions.height.image.toString();
        (form.elements.namedItem('marginLeft') as HTMLInputElement).value = dimensions.margins.left.toString();
        (form.elements.namedItem('marginRight') as HTMLInputElement).value = dimensions.margins.right.toString();
        (form.elements.namedItem('marginTop') as HTMLInputElement).value = dimensions.margins.top.toString();
        (form.elements.namedItem('marginBottom') as HTMLInputElement).value = dimensions.margins.bottom.toString();

        // Set grid configuration
        (form.elements.namedItem('gridXGap') as HTMLInputElement).value = grid.gaps.x.val.toString();
        (form.elements.namedItem('gridXGapMode') as HTMLSelectElement).value = grid.gaps.x.gap_by;
        
        if (grid.gaps.y !== null) {
            (form.elements.namedItem('gridYGap') as HTMLInputElement).value = grid.gaps.y.val.toString();
            (form.elements.namedItem('gridYGapMode') as HTMLSelectElement).value = grid.gaps.y.gap_by;
        }

        (form.elements.namedItem('axesWidth') as HTMLInputElement).value = grid.lines.axes.width.toString();
        (form.elements.namedItem('axesColor') as HTMLInputElement).value = grid.lines.axes.color;
        (form.elements.namedItem('gridWidth') as HTMLInputElement).value = grid.lines.main.width.toString();
        (form.elements.namedItem('gridColor') as HTMLInputElement).value = grid.lines.main.color;
        (form.elements.namedItem('fontSize') as HTMLInputElement).value = grid.lines.font.size.toString();
        (form.elements.namedItem('fontColor') as HTMLInputElement).value = grid.lines.font.color;

        // Set series configuration
        (form.elements.namedItem('seriesWidth') as HTMLInputElement).value = series.width.toString();
        (form.elements.namedItem('seriesAlpha') as HTMLInputElement).value = series.alpha.toString();

        if (series.point !== null) {
            (form.elements.namedItem('showPoints') as HTMLInputElement).checked = true;
            (form.elements.namedItem('pointRadius') as HTMLInputElement).value = series.point.radius.toString();
            (form.elements.namedItem('pointAlpha') as HTMLInputElement).value = series.point.alpha.toString();
        } else {
            (form.elements.namedItem('showPoints') as HTMLInputElement).checked = false;
        }

        if (series.fill !== null) {
            (form.elements.namedItem('showFill') as HTMLInputElement).checked = true;
            (form.elements.namedItem('fillAlpha') as HTMLInputElement).value = series.fill.alpha.toString();
        } else {
            (form.elements.namedItem('showFill') as HTMLInputElement).checked = false;
        }

        form_updater();
    }

    export function ui(DOM_Elements: Forms.svg.DOM_Elements, form: HTMLFormElement, log: boolean): Forms.svg.Refresher {
        function bg() {
            DOM_Elements.bgS.style.display = DOM_Elements.tbg.checked ? 'none' : 'block';
        }

        function points() {
            if (DOM_Elements.points.checked) {
                DOM_Elements.pointsS.removeAttribute('style');
            } else {
                DOM_Elements.pointsS.style.display = 'none';
            }
        }

        function fill() {
            DOM_Elements.fillS.style.display = DOM_Elements.fill.checked ? 'block' : 'none';
        }

        function yGap() {
            if (log) {
                DOM_Elements.yGapS.style.display = 'none';
            } else {
                DOM_Elements.yGapS.removeAttribute('style');
            }
        }

        function all() {
            bg();
            points();
            fill();
            yGap();
        }

        function reset() {
            const default_config: SVG.CONFIG = {
                bg: "#ffffff",
                dimensions: {
                    width: { image: 1280, plot: 1180 },
                    height: { image: 720, plot: 620 },
                    margins: { left: 50, right: 50, top: 50, bottom: 50 }
                },
                grid: {
                    gaps: {
                        x: { gap_by: "px", val: 100 },
                        y: { gap_by: "px", val: 100 }
                    },
                    lines: {
                        axes: { color: "#000000", width: 2 },
                        main: { color: "#cccccc", width: 1 },
                        font: { color: "#000000", size: 10 }
                    }
                },
                series: {
                    width: 1.5,
                    alpha: 1,
                    point: null,
                    fill: null
                }
            };
            set_config(form, default_config, all);
        }

        return {
            all: all,
            bg: bg,
            points: points,
            fill: fill,
            yGap: yGap,
            reset: reset
        };
    }
}