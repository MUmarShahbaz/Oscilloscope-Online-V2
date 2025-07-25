// Serial Port Connection
let serial;
let reader;
let startTime;
let connected = false;
const Connect_Button = document.getElementById('connect');

Connect_Button.addEventListener('click', async () => {
    if (connected) {
        Disconnect();
        return;
    }
    try {
        serial = await navigator.serial.requestPort();
        await Connect();

        if (reader) reader.releaseLock();
        reader = serial.readable.getReader();
        readSerialData();
    } catch (err) {
        await Disconnect();
        console.error('Error opening serial port:', err);
        alert('Error opening serial port!\nDoes your browser support Web Serial API?\nHave you allowed access to the serial port?\nGo to the console for more details!');
    }
});

async function Connect() {
    await serial.open({ baudRate: settings.serial.baud_rate });
    startTime = Date.now();
    connected = true;
    console.log("Serial port opened at ", startTime);
    Connect_Button.innerHTML = "Disconnect";
}

async function Disconnect() {
    if (reader) await reader.cancel();
}

async function readSerialData() {
    const decoder = new TextDecoder();
    let buffer = '';

    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            if (value) {
                buffer += decoder.decode(value, { stream: true });

                let lines = buffer.split('\n');
                buffer = lines.pop(); // Save incomplete line for next chunk

                for (let line of lines) {
                    const message = line.trim();
                    const elapsedTime = Date.now() - startTime;
                    DataProcessor(message, elapsedTime);
                }
            }
        }
    } catch (err) {
        console.error('Serial read error:', err);
        await Disconnect();
    } finally {
        try { reader.releaseLock(); } catch { }
        console.log('Serial port closed.');
        serial.close();
        connected = false;
        Connect_Button.innerHTML = "Connect";
    }
}

let counter = 0;
const maxDataPoints = (settings.axes.x.type === 'linear') ? (settings.axes.x.linear.max - settings.axes.x.linear.min + 1) : settings.axes.x.time.max_readings;

console.log("Max data points:", maxDataPoints);

// Data Processor
function DataProcessor(message, time) {

    if (message == settings.serial.mcu_commands.cls) {   // Clear data
        if (settings.axes.x.type === 'time') {
            data[0] = [];
        }
        for (let i = 1; i < data.length; i++) {
            data[i] = [];
        }
        counter = 0;
    } else if (message == settings.serial.mcu_commands.csv) {
        document.getElementById('export-csv').click();
    } else if (message == settings.serial.mcu_commands.png) {
        document.getElementById('export-png').click();
    } else {
        const messageData = message.split(settings.serial.break);
        if (settings.axes.x.time.manual) {
            time = parseInt(messageData[0]);
            messageData.shift();
        }
        if (settings.axes.x.type === 'time') {
            data[0].push(time);
        }
        console.log(messageData, `at time ${time}`);

        // Add data to datasets
        messageData.forEach((value, i) => {
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue)) {
                data[i + 1].push(parsedValue);
            } else {
                console.warn(`Invalid data value at index ${i}:`, value);
                data[i + 1].push(null);
            }
        });

        chart.setData(data);
        if (!settings.axes.y.autoscale) {
            chart.setScale('y', {
                min: settings.axes.y.min,
                max: settings.axes.y.max
            });
        }

        counter++;
        if (counter > maxDataPoints) {
            if (settings.axes.x.type === 'time') {
                data[0] = [];
            }
            for (let i = 1; i < data.length; i++) {
                data[i] = [];
            }
            counter = 0;
        }
    }
}