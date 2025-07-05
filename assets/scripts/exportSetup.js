document.addEventListener('DOMContentLoaded', () => {
    const exportData = () => {
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

    const submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', () => {
        const data = exportData();
        sessionStorage.setItem('settings', JSON.stringify(data));
        window.location.href = 'plotter.html';
    });
});