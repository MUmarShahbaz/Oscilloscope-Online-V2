/*
*   NULLABLES
*
*   SVG_CONFIG.bg
*   SVG_CONFIG.grid.gaps.y
*   SVG_CONFIG.series.point
*   SVG_CONFIG.series.fill
* 
*   ESSENTIAL_CONFIG.axes.x.time
*   ESSENTIAL_CONFIG.axes.x.linear
*   ESSENTIAL_CONFIG.axes.y.base
*   ESSENTIAL_CONFIG.axes.y.min
*   ESSENTIAL_CONFIG.axes.y.max
* 
*   DATA.grid.x.time_format
*   DATA.grid.y.ticks
*   DATA.grid.y.base
*/


type color = `#{string}`;

interface SVG_CONFIG {
    bg: null | color;
    dimensions: {
        width: { image: number; plot: number; };
        height: { image: number; plot: number; };
        margins: { left: number; right: number; top: number; bottom: number; };
    };
    grid: {
        gaps: {
            x: { gap_by: 'val' | 'px'; val: number; };
            y: null | { gap_by: 'val' | 'px'; val: number; };
        };
        lines: {
            axes: { color: color; width: number; };
            main: { color: color; width: number; };
            font: { color: color; size: number; };
        };
    };
    series: {
        width: number;
        alpha: number;
        point: null | { radius: number; alpha: number; };
        fill: null | { alpha: number; };
    };
}

interface ESSENTIAL_CONFIG {
    title: string;
    serial: {
        baud: 300 | 1200 | 2400 | 4800 | 9600 | 14400 | 19200 | 28800 | 38400 | 57600 | 115200 | 230400 | 250000 | 460800 | 500000 | 921600 | 1000000 | 2000000;
        break: string;
        mcu_commands: { csv: string; json: string; png: string; svg: string; };
    };
    series: {
        labels: Array<string>;
        colors: Array<color>;
        points: boolean;
        fill: boolean;
    };
    axes: {
        x: {
            title: string;
            type: 'linear' | 'time';
            time: null | {
                format: 'ms' | 's.ms' | 'm:s' | 'h:m:s' | 'd-h:m';
                manual: boolean;
            };
            linear: null | {
                min: number;
                max: number;
            };
        };
        y: {
            title: string;
            type: 'linear' | 'log';
            base: null | 10 | 2;
            autoscale: boolean;
            min: null | number;
            max: null | number;
        };
    };
}

interface DATA {
    title: string;
    grid: {
        x: {
            title: string;
            type: 'linear' | 'time';
            ticks: {
                raw: Array<number>;
                formatted: Array<string>;
                min: number;
                max: number;
                range: number;
            };
            time_format: null | 'ms' | 's.ms' | 'm:s' | 'h:m:s' | 'd-h:m';
        };
        y: {
            title: string;
            type: 'linear' | 'log';
            ticks: null | {
                min: number;
                max: number;
                range: number;
            };
            base: null | 10 | 2;
        };
    };
    series: Array<{ label: string; color: color; data: Array<number>; }>;
}