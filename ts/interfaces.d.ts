namespace uPlot {
    type color = `#${string}`;
    type time_format = "ms" | "s.ms" | "m:s" | "h:m:s" | "d-h:m";

    interface CONFIG {
        serial: {
            break: string;
            mcu_commands: {
                cls: string;
                csv: string;
                png: string;
                json: string;
            };
        };
        chart: {
            title: string;
            x: {
                type: "linear";
                title: string;
                min: number;
                max: number;
            }
            | {
                type: "time";
                title: string;
                manual: boolean;
                format: time_format;
                max: number;
            };
            y: {
                type: 'linear-auto';
                title: string;
            }
            | {
                type: 'linear-manual';
                title: string;
                min: number;
                max: number;
            }
            | {
                type: 'log';
                title: string;
                base: number;
            };
            options: {
                points: boolean;
                fill: boolean;
            };
        };
        datasets: Array<{ label: string; color: color; }>;
    }
}

namespace SVG { }

namespace Serial { }

namespace Forms {
    namespace setup {
        interface Refresher {
            all: Function;
            x: Function;
            y: Function;
            graphs: Function;
            reset: Function;
        };

        interface DOM_Elements {
            xType: HTMLInputElement;
            yType: HTMLInputElement;
            auto: HTMLInputElement;
            graphs: HTMLInputElement;

            timeS: HTMLElement;
            linearS: HTMLElement;
            graphsS: HTMLElement;
            yRange: HTMLElement;
        };
    }
}

type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONObject
    | JSONArray;