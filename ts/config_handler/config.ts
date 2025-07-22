function oscilloscope_config(form : HTMLFormElement) : CONFIG_HANDLER.CONFIG {
    const setup = new FormData(form);

    const serial_info : CONFIG_HANDLER.CONFIG['serial'] = {
        break: setup.get('breakChar')! as string,
        mcu_commands: {
            cls: setup.get('clsChar')! as string,
            csv: setup.get('csvChar')! as string,
            png: setup.get('pngChar')! as string,
            json: setup.get('jsonChar')! as string,
        }
    };
    let x_axis : CONFIG_HANDLER.CONFIG['chart']['x'];
    let y_axis : CONFIG_HANDLER.CONFIG['chart']['y'];

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

    let opt : CONFIG_HANDLER.CONFIG['chart']['options'] = {
        points: setup.get('showPoints') !== null,
        fill: setup.get('fillArea') !== null
    };


    const num_of_graphs = parseInt(setup.get('graphCount') as string);

    let datasets : CONFIG_HANDLER.CONFIG['datasets'] = [];
    for (let i = 1; i <= num_of_graphs; i++) {
        let label : string = setup.get(`graph${i}Name`) as string;
        let color : CONFIG_HANDLER.color = setup.get(`graph${i}Color`) as CONFIG_HANDLER.color;

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