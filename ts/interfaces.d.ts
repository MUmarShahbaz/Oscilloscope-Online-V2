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

declare class Handsontable {
    constructor(
        container: HTMLElement,
        options: Handsontable.GridSettings
    );

    // Core methods
    getRowHeight(row: number): number | null;
    updateSettings(settings: Partial<Handsontable.GridSettings>): void;
    render(): void;
    destroy(): void;
    
    // Data methods
    getData(): any[][];
    setData(data: any[][]): void;
    getDataAtRow(row: number): any[] | null;
    getDataAtCol(col: number): any[] | null;
    getDataAtCell(row: number, col: number): any;
    setDataAtCell(row: number, col: number, value: any): void;
    setDataAtRowProp(row: number, prop: string | number, value: any): void;
    populateFromArray(row: number, col: number, data: any[][], endRow?: number, endCol?: number, source?: string, method?: string): void;
    
    // Selection methods
    getSelected(): number[][] | undefined;
    selectCell(row: number, col: number, endRow?: number, endCol?: number): boolean;
    deselectCell(): void;
    
    // Row/Column methods
    countRows(): number;
    countCols(): number;
    alter(action: 'insert_row' | 'insert_col' | 'remove_row' | 'remove_col', index: number, amount?: number): void;
    
    // Event methods
    addHook(key: string, callback: Function): void;
    removeHook(key: string): void;
    
    // Validation
    validateCells(callback?: Function): void;
    
    // Other utility methods
    loadData(data: any[][]): void;
    clear(): void;
    getInstance(): Handsontable;
}

declare namespace Handsontable {
    interface GridSettings {
        // Data
        data?: any[][];
        dataSchema?: object | Function;
        
        // Appearance
        themeName?: string;
        className?: string | string[];
        tableClassName?: string | string[];
        
        // Headers
        colHeaders?: boolean | string[] | Function;
        rowHeaders?: boolean | string[] | Function;
        nestedHeaders?: any[];
        
        // Dimensions
        width?: number | string;
        height?: number | string;
        minRows?: number;
        minCols?: number;
        maxRows?: number;
        maxCols?: number;
        
        // Sizing
        rowHeights?: number | number[] | string | Function;
        colWidths?: number | number[] | string | Function;
        autoRowSize?: boolean | object;
        autoColumnSize?: boolean | object;
        stretchH?: 'none' | 'last' | 'all';
        
        // Wrapping
        autoWrapRow?: boolean;
        autoWrapCol?: boolean;
        
        // Selection
        outsideClickDeselects?: boolean | Function;
        selectionMode?: 'single' | 'range' | 'multiple';
        
        // Editing
        readOnly?: boolean;
        
        // Scrolling
        virtualScrolling?: boolean;
        
        // License
        licenseKey?: string;
        
        // Hooks/Events
        afterInit?: () => void;
        afterChange?: (changes: any[] | null, source: string) => void;
        afterSelection?: (row: number, col: number, row2: number, col2: number) => void;
        beforeChange?: (changes: any[], source: string) => boolean | void;
        
        // Plugins
        contextMenu?: boolean | object;
        copyPaste?: boolean | object;
        
        // Other options
        [key: string]: any;
    }
    
    interface CellCoords {
        row: number;
        col: number;
    }
    
    interface CellChange {
        0: number; // row
        1: number | string; // col
        2: any; // oldValue
        3: any; // newValue
    }
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