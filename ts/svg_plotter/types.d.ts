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