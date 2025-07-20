/*
 *   NULLABLES
 *
 *   SVG_CONFIG.bg
 *   SVG_CONFIG.grid.gaps.y
 *   SVG_CONFIG.series.point
 *   SVG_CONFIG.series.fill
 *
 *   DATA.grid.x.time_format
 *   DATA.grid.y.ticks
 *   DATA.grid.y.base
 */
namespace SVG_PLOTTER {
  type color = `#${string}`;
  type rgba = `rgba(${number}, ${number}, ${number}, ${number})`;
  type gap_mode = "val" | "px";
  type time_format = "ms" | "s.ms" | "m:s" | "h:m:s" | "d-h:m";
  type data_func = (
    append?: boolean,
    new_data?: DATA,
    refresh_grid?: boolean
  ) => SVGElement;
  type init_func = (parent?: HTMLElement) => SVGElement;
  type grid_func = (append?: boolean) => SVGElement;
  type SVG_OBJECT = {
    id: string;
    data: DATA;
    config: SVG_CONFIG;
    init: init_func;
    updateGrid: grid_func;
    updateData: data_func;
  };

  interface DATA {
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
        ticks: null | {
          min: number;
          max: number;
          range: number;
        };
        base: null | 10 | 2;
      };
    };
    series: Array<{ label: string; color: color; data: Array<number> }>;
  }

  interface SVG_CONFIG {
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
