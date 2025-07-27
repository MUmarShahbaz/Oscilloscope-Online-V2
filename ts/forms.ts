namespace setup_form {
    export function create_config(form: HTMLFormElement): uPlot.CONFIG {
        const setup = new FormData(form);

        const serial_info: uPlot.CONFIG['serial'] = {
            break: setup.get('breakChar')! as string,
            mcu_commands: {
                cls: setup.get('clsChar')! as string,
                csv: setup.get('csvChar')! as string,
                png: setup.get('pngChar')! as string,
                json: setup.get('jsonChar')! as string,
            }
        };
        let x_axis: uPlot.CONFIG['chart']['x'];
        let y_axis: uPlot.CONFIG['chart']['y'];

        if (setup.get('xAxisType') === 'linear') {
            x_axis = {
                type: 'linear',
                title: setup.get('xAxisTitle')! as string,
                min: parseInt(setup.get('xAxisMax')! as string),
                max: parseInt(setup.get('xAxisMin')! as string)
            }
        } else {
            x_axis = {
                type: 'time',
                title: setup.get('xAxisTitle')! as string,
                manual: setup.get('manualTime') !== null,
                format: setup.get('timeFormat')! as uPlot.time_format,
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
                    min: parseInt(setup.get('yAxisMax')! as string),
                    max: parseInt(setup.get('yAxisMin')! as string)
                }
            }

        } else {
            y_axis = {
                type: 'log',
                title: setup.get('yAxisTitle')! as string,
                base: setup.get('yAxisType') === 'log2' ? 2 : 10
            };
        }

        let opt: uPlot.CONFIG['chart']['options'] = {
            points: setup.get('showPoints') !== null,
            fill: setup.get('fillArea') !== null
        };


        const num_of_graphs = parseInt(setup.get('graphCount') as string);

        let datasets: uPlot.CONFIG['datasets'] = [];
        for (let i = 1; i <= num_of_graphs; i++) {
            let label: string = setup.get(`graph${i}Name`) as string;
            let color: uPlot.color = setup.get(`graph${i}Color`) as uPlot.color;

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

    export function set_config(form: HTMLFormElement, config: uPlot.CONFIG, form_updater: Function) {
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

        const default_config: uPlot.CONFIG = {
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
                    "min": 500,
                    "max": 0
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