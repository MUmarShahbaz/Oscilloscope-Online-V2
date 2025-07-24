function create_oscilloscope_config(form: HTMLFormElement): CONFIG_HANDLER.CONFIG {
    const setup = new FormData(form);

    const serial_info: CONFIG_HANDLER.CONFIG['serial'] = {
        break: setup.get('breakChar')! as string,
        mcu_commands: {
            cls: setup.get('clsChar')! as string,
            csv: setup.get('csvChar')! as string,
            png: setup.get('pngChar')! as string,
            json: setup.get('jsonChar')! as string,
        }
    };
    let x_axis: CONFIG_HANDLER.CONFIG['chart']['x'];
    let y_axis: CONFIG_HANDLER.CONFIG['chart']['y'];

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
            format: setup.get('timeFormat')! as CONFIG_HANDLER.time_format,
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

    let opt: CONFIG_HANDLER.CONFIG['chart']['options'] = {
        points: setup.get('showPoints') !== null,
        fill: setup.get('fillArea') !== null
    };


    const num_of_graphs = parseInt(setup.get('graphCount') as string);

    let datasets: CONFIG_HANDLER.CONFIG['datasets'] = [];
    for (let i = 1; i <= num_of_graphs; i++) {
        let label: string = setup.get(`graph${i}Name`) as string;
        let color: CONFIG_HANDLER.color = setup.get(`graph${i}Color`) as CONFIG_HANDLER.color;

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

function set_config(form: HTMLFormElement, config: CONFIG_HANDLER.CONFIG, form_updater: Function) {
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