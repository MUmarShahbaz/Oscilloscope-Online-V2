declare class uPlot {
    constructor(
        options: any,
        data: number[][],
        target: HTMLElement
    );

    setData(data: number[][]): void;
    setScale(scale: string, val: { min: number; max: number; }): void;
    destroy(): void;
}

namespace uPlot_Controller {
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

    interface EXPORT {
        title: string;
        grid: {
            x: {
                title: string;
                type: "linear" | "time";
                ticks: {
                    raw: Array<number>;
                    formatted: Array<string>;
                    min: number;
                    max: number;
                    range: number;
                };
                time_format: null | time_format;
            };
            y: {
                title: string;
                type: "linear" | "log";
                ticks: {
                    min: number;
                    max: number;
                    range: number;
                };
                base: null | 10 | 2;
            };
        };
        series: Array<{ label: string; color: color; data: Array<number> }>;
    }
}

namespace SVG {
    type gap_mode = "val" | "px";
    type color = `#${string}`;
    interface CONFIG {
        bg: null | color;
        dimensions: {
            width: { image: number; plot: number };
            height: { image: number; plot: number };
            margins: { left: number; right: number; top: number; bottom: number };
        };
        grid: {
            gaps: {
                x: { gap_by: gap_mode; val: number };
                y: null | { gap_by: gap_mode; val: number };
            };
            lines: {
                axes: { color: color; width: number };
                main: { color: color; width: number };
                font: { color: color; size: number };
            };
        };
        series: {
            width: number;
            alpha: number;
            point: null | { radius: number; alpha: number };
            fill: null | { alpha: number };
        };
    }
}

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

    namespace svg {
        interface Refresher {
            all: Function;
            bg: Function;
            points: Function;
            fill: Function;
            yGap: Function;
            reset: Function;
        };

        interface DOM_Elements {
            tbg: HTMLInputElement;
            points: HTMLInputElement;
            fill: HTMLInputElement;

            bgS: HTMLElement;
            pointsS: HTMLElement;
            fillS: HTMLElement;
            yGapS: HTMLElement;
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