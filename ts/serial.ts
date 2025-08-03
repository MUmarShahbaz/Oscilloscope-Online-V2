namespace Serial_Controller {
    let start_time: number;
    let port: SerialPort | null = null;
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
    let baud: number;
    let push: Function;
    let buffer = '';
    export let isReading = false;

    export function test() {
        if (typeof navigator.serial?.requestPort === "function") {
            alerts.success('Web Serial API detected!', { dismissible: true, autoClose: 3000 });
        } else {
            alerts.error('Web Serial API not found. Use a supported browser!', { dismissible: true })
        }
    }

    export async function init(new_baud: number, new_push: Function, success: Function) {
        baud = new_baud;
        push = new_push;

        try {
            port = await navigator.serial!.requestPort();
            await port.open({ baudRate: baud });
            start_time = Date.now();
            success();
        } catch (e) {
            alerts.error('Could not connect to port', { dismissible: true })
        }
    }

    export async function start() {
        if (!port || !port.readable) {
            alerts.error('Could not read from port', { dismissible: true });
            return;
        }

        if (isReading) {
            alerts.warning('Already reading from port', { dismissible: true });
            return;
        }

        isReading = true;
        reader = port.readable.getReader();
        const decoder = new TextDecoder();
        console.log('Starting serial reading...');

        try {
            while (isReading) {
                const { value, done } = await reader.read();
                if (done) break;
                
                const text = decoder.decode(value, { stream: true });
                buffer += text;

                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const message = line.trim();
                    if (message) {
                        const elapsedTime = Date.now() - start_time;
                        push(message, elapsedTime);
                    }
                }
                
            }
        } catch (error) {
            console.error('Error reading from serial port:', error);
            if (isReading) { // Only show error if we weren't intentionally stopping
                alerts.error('Error reading from serial port', { dismissible: true });
                await quit();
            }
        } finally {
            try {
                if (reader) {
                    reader.releaseLock();
                    reader = null;
                }
            } catch (err) {
                console.warn('Error releasing reader lock:', err);
            }
            console.log('Serial port reading stopped.');
            isReading = false;
        }
    }

    export async function quit() {
        isReading = false;

        if (reader) {
            try {
                reader.releaseLock();
                reader = null;
            } catch (error) {
                console.error('Error releasing reader lock:', error);
            }
        }

        if (port) {
            try {
                await port.close();
                alerts.success('Serial port disconnected', { dismissible: true, autoClose: 2000 });
            } catch (error) {
                console.error('Error closing serial port:', error);
                alerts.error('Error closing serial port', { dismissible: true });
            }
            port = null;
        }

        buffer = '';
    }

    export function isConnected(): boolean {
        return port !== null && port !== undefined;
    }
}