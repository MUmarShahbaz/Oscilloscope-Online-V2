// Serial Port Connection
let serial;
let reader;

document.getElementById('connect').addEventListener('click', async () => {
    try {
        serial = await navigator.serial.requestPort();
        await serial.open({ baudRate: baud });
        console.log("Serial port opened");

        if (reader) reader.releaseLock();
        reader = serial.readable.getReader();
        readSerialData();
    } catch (err) {
        console.error('Error opening serial port:', err);
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

let counter = 0;
const maxDataPoints = xMax - xMin + 1;

// Data Processor
function DataProcessor(message) {
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

    counter++;
    if (counter > maxDataPoints) {
        for (let i = 1; i < data.length; i++) {
            data[i] = [];
        }
        counter = 0;
    }
}