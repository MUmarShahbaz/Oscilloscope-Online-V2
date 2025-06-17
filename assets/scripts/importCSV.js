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
            csvArray[i][0] = xTimeManual ? revert_format(csvArray[i][0]) : csvArray[i][0];
            let row_data = xTimeManual ? csvArray[i].join(break_char) : csvArray[i].slice(1).join(break_char);
            DataProcessor(row_data, Date.now() - startTime);
        }
    };
    reader.readAsText(imported_csv);
});

function revert_format(time) {
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let ms = 0;

    if ((/^\d+-\d+:\d+$/).test(time)) {
        days = parseInt(time.match(/^(\d+)-\d+:\d+$/)[1], 10);
        hours = parseInt(time.match(/^\d+-(\d+):\d+$/)[1], 10);
        minutes = parseInt(time.match(/^\d+-\d+:(\d+)$/)[1], 10);
    }
    if ((/^\d+:\d+:\d+$/).test(time)) {
        hours = parseInt(time.match(/^(\d+):\d+:\d+$/)[1], 10);
        minutes = parseInt(time.match(/^\d+:(\d+):\d+$/)[1], 10);
        seconds =  parseInt(time.match(/^\d+:\d+:(\d+)$/)[1], 10);
    }
    if ((/^\d+:\d+$/).test(time)) {
        minutes = parseInt(time.match(/^(\d+):\d+$/)[1], 10);
        seconds =  parseInt(time.match(/^\d+:(\d+)$/)[1], 10);
    }
    if ((/^\d+\.\d+s$/).test(time)) {
        seconds = parseInt(time.match(/^(\d+)\.\d+s$/)[1], 10);
        ms = parseInt(time.match(/^\d+\.(\d+)s$/)[1], 10);
    }
    if ((/^\d+$/).test(time)) {
        ms = parseInt(time.match(/^(\d+)$/)[1], 10);
    }

    console.log(time);
    console.log(ms);
    const reverted = ms + seconds*1000 + minutes*60*1000 + hours*60*60*1000 + days*24*60*60*1000;
    console.log(reverted);
    return reverted.toString();
}