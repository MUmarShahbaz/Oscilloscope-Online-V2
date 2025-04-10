// Serial Port Connection
let serial;
let reader;
let startTime;

document.getElementById('connect').addEventListener('click', async () => {
    try {
        serial = await navigator.serial.requestPort();
        await serial.open({ baudRate: baud });
        startTime = Date.now() / 1000;
        console.log("Serial port opened at ", startTime);

        if (reader) reader.releaseLock();
        reader = serial.readable.getReader();
        readSerialData();
    } catch (err) {
        console.error('Error opening serial port:', err);
        alert('Error opening serial port!\nDoes your browser support Web Serial API?\nHave you allowed access to the serial port?\nGo to the console for more details!');
    }
});

// Read Serial Data
async function readSerialData() {
    try {
        const textDecoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                console.log("Serial port closed");
                reader.releaseLock();
                break;
            }
            if (value) {
                buffer += textDecoder.decode(value);
                let newlineIndex;
                while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
                    const message = buffer.slice(0, newlineIndex).trim();
                    //console.log("Message:", message);
                    DataProcessor(message);
                    buffer = buffer.slice(newlineIndex + 1);
                }
            }
        }
    } catch (error) {
        console.error('Error reading from serial port:', error);
    } finally {
        if (reader) reader.releaseLock();
    }
}

let count = (xType === 'linear' || xType === 'time');
let counter = 0;
let maxDataPoints = (xType === 'linear') ? (xMax - xMin + 1) : null;
maxDataPoints = (xType === 'time') ? xTimeMax : maxDataPoints;

console.log("Max data points:", maxDataPoints);

// Data Processor
function DataProcessor(message) {

    if (message == "%") {   // Reset data
        for (let i = 1; i < data.length; i++) {
            data[i] = [];
        }
    } else {
        if (xType === 'time') {
            const currentTime = Date.now() / 1000;
            data[0].push(currentTime);
        }
        const messageData = message.split(break_char);
        console.log(messageData);

        // Add data to datasets
        messageData.forEach((value, i) => {
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue)) {
                data[i + 1].push(parsedValue);
            } else {
                console.warn(`Invalid data value at index ${i}:`, value);
            }
        });

        chart.setData(data);
        if (!auto) {
            chart.setScale('y', {
                min: yMin,
                max: yMax
            });
        }

        if (count) {
            counter++;
            if (counter > maxDataPoints) {
                if (xType === 'time') {
                    data[0] = [];
                }
                for (let i = 1; i < data.length; i++) {
                    data[i] = [];
                }
                counter = 0;
            }
        }
    }
}