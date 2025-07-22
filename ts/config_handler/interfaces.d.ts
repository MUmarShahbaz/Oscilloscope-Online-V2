namespace CONFIG_HANDLER {
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
