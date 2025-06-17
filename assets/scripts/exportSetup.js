document.addEventListener('DOMContentLoaded', () => {
    const exportData = () => {
        // Serial Values
        const baud = document.getElementById('baud').value;
        const breakChar = document.getElementById('break_char').value;
        const cls = document.getElementById('cls_char').value;
        const csv = document.getElementById('csv_char').value;

        // Grid Values
        const title = document.getElementById('title').value;
        const xTitle = document.getElementById('xTitle').value;
        const yTitle = document.getElementById('yTitle').value;

        const xType = document.getElementById('xType').value;
        const xMin = (xType === 'linear') ? document.getElementById('xMin').value : null;
        const xMax = (xType === 'linear') ? document.getElementById('xMax').value : null;
        const xTime = (xType === 'time') ? document.getElementById('xTime').value : null;
        const xTimeMax = (xType === 'time') ? document.getElementById('xTimeMax').value : null;
        const xTimeManual = (xType === 'time') ? document.getElementById('xTimeManual').value : null;

        const yType = document.getElementById('yType').value;
        const auto = document.getElementById('auto').value === 'true';
        const yMin = auto ? null : document.getElementById('yMin').value;
        const yMax = auto ? null : document.getElementById('yMax').value;

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
            baud,
            breakChar,
            cls,
            csv,
            title,
            xTitle,
            yTitle,
            xType,
            xMin,
            xMax,
            xTime,
            xTimeMax,
            xTimeManual,
            yType,
            auto,
            yMin,
            yMax,
            points,
            fill,
            dataset_labels,
            dataset_colors
        };
    };

    const submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', () => {
        const data = exportData();
        sessionStorage.setItem('SetupData', JSON.stringify(data));
        window.location.href = 'plotter.html';
    });
});