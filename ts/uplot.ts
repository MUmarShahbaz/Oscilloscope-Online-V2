namespace uPlot_Controller {
    export let chart : uPlot;
    let width : number;
    let height : number;
    let data : Array<Array<number>> = [];
    let config : CONFIG;
    let container : HTMLElement;
    export let length : number;

    // Helper Function
    function formatElapsed(ms: number, format: time_format): string {
        const sec = Math.floor(ms / 1000);
        const msec = ms % 1000;
        const s = sec % 60;
        const m = Math.floor((sec / 60) % 60);
        const h = Math.floor((sec / 3600) % 24);
        const d = Math.floor(sec / 86400);

        switch (format) {
            case "ms":
                return `${ms}ms`;
            case "s.ms":
                return `${sec}.${msec.toString().padStart(3, '0')}s`;
            case "m:s":
                return `${m}:${s.toString().padStart(2, '0')}`;
            case "h:m:s":
                return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            case "d-h:m":
                return `${d}-${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            default:
                return `${ms}ms`; // fallback to ms format
        }
    }

    const capitalize = (str : string) => str.charAt(0).toUpperCase() + str.slice(1);

    export function init(new_config : CONFIG, new_container : HTMLElement) {
        // Init Container and get config
        config = new_config;
        container = new_container;
        width = new_container.clientWidth;
        height = new_container.clientHeight;

        // Init Data
        clear()

        // Init Scales
        const yLog = config.chart.y.type === 'log' ? config.chart.y.base : false;
        const yType = config.chart.y.type.split('-')[0];
        const yManual = config.chart.y.type === 'linear-manual';

        const scale: {
            x: { type: string; time: boolean; };
            y: { type: string; distr?: number; log?: any; min?: number; max?: number; };
        } = {
            x: {
                type: 'linear',
                time: false,
            },
            y: {
                type: yType
            }
        }

        if (yLog) {
            scale.y.distr = 3;
            scale.y.log = yLog;
        }

        if (yManual) {
            const y = config.chart.y as {
                type: 'linear-manual';
                title: string;
                min: number;
                max: number;
            };
            scale.y.min = y.min;
            scale.y.max = y.max;
        }

        // Axes Initialization
        const xTime = config.chart.x.type === 'time';
        const axes: Array<{ label: string; values?: (u: any, ticks: number[]) => any[] }> = [
            {
                label: config.chart.x.title
            },
            {
                label: config.chart.y.title
            }
        ];

        if (xTime) axes[0].values = (u, ticks) => ticks.map((t : number) => formatElapsed(t, (config.chart.x as {
                type: "time";
                title: string;
                manual: boolean;
                format: time_format;
                max: number;
            }).format));
        
        // Series Initialization
        const series : Array<{
            label: string,
            stroke?: color,
            fill?: string | null,
            points?: {
                show: boolean,
                size: number,
                stroke: color,
                fill: string
            }
        }> = [{ label: config.chart.x.title }];

        for (let i = 0; i < config.datasets.length; i++) {
            const this_dataset = config.datasets[i];
            const [r, g, b] = this_dataset.color.match(/\w\w/g)!.map((x) => parseInt(x, 16));
            const rgba = `rgba(${r}, ${g}, ${b}, 0.1)`;
            series.push({
                label: this_dataset.label,
                stroke: this_dataset.color,
                fill:  config.chart.options.fill ? rgba : null,
                points: {
                    show: config.chart.options.points,
                    size: 5,
                    stroke: this_dataset.color,
                    fill: rgba,
                }
            });
        }

        // Create options
        const options = {
            title: config.chart.title,
            width: width,
            height: height,
            scales: scale,
            axes: axes,
            series: series,
            pixelRatio: window.devicePixelRatio || 1
        };

        length = config.chart.x.type === 'linear' ? config.chart.x.max - config.chart.x.min : config.chart.x.max;

        // Create Chart
        try {
            chart = UPLOT_MAKER(options, data, container);
        } catch (error) {
            throw new Error(`Failed to create uPlot chart: ${error}`);
        }
    }

    export function update(new_data : Array<Array<number>>) {
        if (!chart) {
            throw new Error("Chart not initialized. Call init() first.");
        }
        data = new_data;
        chart.setData(new_data);
        if (config.chart.y.type === 'linear-manual') {
            const y = config.chart.y as {
                type: 'linear-manual';
                title: string;
                min: number;
                max: number;
            };
            chart.setScale('y', {
                min: y.min,
                max: y.max
            });
        }
    }

    export function resize() {
        if (!chart || !container) {
            throw new Error("Chart not initialized. Call init() first.");
        }
        width = container.clientWidth;
        height = container.clientHeight;
        // Note: uPlot resize method may need to be implemented based on the library version
        // chart.setSize({width, height}); // Uncomment if uPlot supports this method
    }

    export function destroy() {
        if (chart) {
            chart.destroy();
            chart = null as any;
        }
        data = [];
        config = null as any;
        container = null as any;
    }

    export function isInitialized(): boolean {
        return chart !== null && chart !== undefined;
    }

    export function push(message : string, time : number) {
        if (message === config.serial.mcu_commands.cls) {
            clear();
        } else {
            data.forEach((row, i) => {
                if (length === row.length) row.shift();
            });

            const messageData = message.split(config.serial.break);
            if (config.chart.x.type === 'time') {
                if (config.chart.x.manual) {
                    time = parseInt(messageData[0]);
                    messageData.shift();
                }
                data[0].push(time);
            }
            console.log(messageData, `at time ${time}`);

            messageData.forEach((value, i) => {
                const parsedValue = parseFloat(value);
                if (!isNaN(parsedValue)) {
                    data[i + 1].push(parsedValue);
                } else {
                    console.warn(`Invalid data value at index ${i}:`, value);
                    data[i + 1].push(NaN);
                }
            });
        }
    }

    export function refresh() {
        update(data);
    }

    export function clear()  {
        data = [];
        if (config.chart.x.type === 'linear') {
            const x = config.chart.x as { type: "linear"; title: string; min: number; max: number; };
            data.push(Array.from({ length: x.max - x.min + 1 }, (_, i) => x.min + i));
        } else {
            data.push([]);
        }
        config.datasets.forEach(element => {
            data.push([]);
        });
    }

    export function export_json() : EXPORT {
        const title = config.chart.title;

        // Helper function to format time values
        function formatElapsed(ms: number, format: time_format): string {
            const sec = Math.floor(ms / 1000);
            const msec = ms % 1000;
            const s = sec % 60;
            const m = Math.floor((sec / 60) % 60);
            const h = Math.floor((sec / 3600) % 24);
            const d = Math.floor(sec / 86400);

            switch (format) {
                case "ms":
                    return `${ms}ms`;
                case "s.ms":
                    return `${sec}.${msec.toString().padStart(3, '0')}s`;
                case "m:s":
                    return `${m}:${s.toString().padStart(2, '0')}`;
                case "h:m:s":
                    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                case "d-h:m":
                    return `${d}-${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                default:
                    return `${ms}ms`;
            }
        }

        // Extract X-axis data and create ticks
        const xData = data[0] || [];
        const xMin = Math.min(...xData);
        const xMax = Math.max(...xData);
        const xRange = xMax - xMin;
        
        const xTicks = {
            raw: [...xData],
            formatted: config.chart.x.type === 'time' 
                ? xData.map(t => formatElapsed(t, (config.chart.x as any).format))
                : xData.map(t => t.toString()),
            min: xMin,
            max: xMax,
            range: xRange
        };

        // Extract Y-axis information
        const allYData: number[] = [];
        data.slice(1).forEach(series => {
            series.forEach((val: number) => {
                if (!isNaN(val)) {
                    allYData.push(val);
                }
            });
        });
        
        const yType = config.chart.y.type.split('-')[0] as "linear" | "log";
        const yBase = config.chart.y.type === 'log' ? (config.chart.y as any).base : null;
        
        const dataMin = allYData.length > 0 ? Math.min(...allYData) : 0;
        const dataMax = allYData.length > 0 ? Math.max(...allYData) : 0;
        
        const yMin = yBase === null ? dataMin : Math.pow(yBase, Math.floor(Math.log(dataMin) / Math.log(yBase)));
        const yMax = yBase === null ? dataMax : Math.pow(yBase, Math.ceil(Math.log(dataMax) / Math.log(yBase)));
        
        const yRange = yMax - yMin;

        // Create series data
        const series = config.datasets.map((dataset, index) => ({
            label: dataset.label,
            color: dataset.color,
            data: data[index + 1] || []
        }));

        return {
            title,
            grid: {
                x: {
                    title: config.chart.x.title,
                    type: config.chart.x.type,
                    ticks: xTicks,
                    time_format: config.chart.x.type === 'time' ? (config.chart.x as any).format : null
                },
                y: {
                    title: config.chart.y.title,
                    type: yType,
                    ticks: {
                        min: yMin,
                        max: yMax,
                        range: yRange
                    },
                    base: yBase
                }
            },
            series
        };
    }

    export function export_csv() : string {
        // Extract data
        const index = data[0];
        const columns = data.slice(1);
        const rowCount = index.length;

        // Create headings
        let headings = [capitalize(config.chart.x.type)];
        config.datasets.forEach((dataset) => {
            headings.push(dataset.label);
        });

        // Parse CSV
        let csv = headings.join(',') + '\n';
        for (let i = 0; i < rowCount; i++) {
            let reading_index = config.chart.x.type === 'linear' ? index[i] : formatElapsed(index[i],config.chart.x.format);
            let row = reading_index + ',' + columns.map(col => col[i] !== undefined ? col[i] : '').join(',');
            csv += row + '\n';
            console.log(row);
        }

        return csv;
    }
}

function UPLOT_MAKER(options : Object, data : Array<Array<number>>, container : HTMLElement) {
    return new uPlot(options, data, container);
}