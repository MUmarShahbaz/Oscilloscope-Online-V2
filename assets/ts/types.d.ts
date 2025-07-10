type color = `#${string}`;
type rgba = `rgba(${number}, ${number}, ${number}, ${number})`;
type Uplot_Data = Array<Array<number>>;
type baud_rate = 300 | 1200 | 2400 | 4800 | 9600 | 14400 | 19200 | 28800 | 38400 | 57600 | 115200 | 230400 | 250000 | 460800 | 500000 | 921600 | 1000000 | 2000000;
type gap_mode = 'val' | 'px';
type svg_meta = {config : SVG_CONFIG; data: DATA};
type time_format = 'ms' | 's.ms' | 'm:s' | 'h:m:s' | 'd-h:m';