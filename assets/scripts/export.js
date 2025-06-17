const exportButton = document.getElementById('export');
exportButton.addEventListener('click', () => {
    // Extract data
    const index = data[0];
    const columns = data.slice(1);
    const rowCount = index.length;

    // Create headings
    let headings = [(xType === 'linear' ? "Index" : "Time")];
    series.slice(1).forEach((dataset) => {
        headings.push(dataset.label);
    });

    // Parse CSV
    let csv = headings.join(',') + '\n';
    for (let i = 0; i < rowCount; i++) {
        let reading_index = xType === 'linear' ? index[i] : formatElapsed(index[i], xTime);
        let row = reading_index + ',' + columns.map(col => col[i] !== undefined ? col[i] : '').join(',');
        csv += row + '\n';
    }

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});