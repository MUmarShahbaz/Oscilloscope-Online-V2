const importCSV = document.getElementById('import');
const importer = document.getElementById('hiddenInput');
importCSV.addEventListener('click', () => {
    importer.click();
});

importer.addEventListener('change', () => {
    const imported_csv = importer.files[0];
    if (!imported_csv) return;

    const reader = new FileReader();
    reader.onload = e => {
        startTime = Date.now();
        const csvText = e.target.result;
        const csvArray = csvText.trim().split('\n').map(row =>
            row.split(',').map(cell => cell.trim())
        );

        // Create data
        for (let i = 1; i < csvArray.length; i++) {
            let row_data = xTimeManual ? csvArray[i].join(break_char) : csvArray[i].slice(1).join(break_char);
            DataProcessor(row_data, Date.now() - startTime);
        }
    };
    reader.readAsText(imported_csv);
});