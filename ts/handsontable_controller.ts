namespace Handsontable_Controller {
    let container: HTMLElement;
    export let data: Array<Array<any>> = [[]];
    let datasets_config: uPlot_Controller.CONFIG['datasets'];
    let x_type: uPlot_Controller.CONFIG['chart']['x']['type'];
    let labels;
    export let rows_filled: number = 0;
    export let table: Handsontable;

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    export function init(new_container: HTMLElement, new_datasets_config: uPlot_Controller.CONFIG['datasets'], new_x_type: uPlot_Controller.CONFIG['chart']['x']['type']) {
        container = new_container;
        datasets_config = new_datasets_config;
        x_type = new_x_type;
        labels = [capitalize(x_type)];
        datasets_config.forEach(element => { labels.push(element.label) });

        table = new Handsontable(container, {
            readOnly: true,
            virtualScrolling: true,
            themeName: 'ht-theme-main',
            data,
            rowHeaders: true,
            colHeaders: labels,
            minCols: labels.length,
            maxCols: labels.length,
            height: container.clientHeight,
            stretchH: 'all',
            autoWrapRow: true,
            autoWrapCol: true,
            licenseKey: 'non-commercial-and-evaluation',
            autoRowSize: true,
            /*afterInit: function () {
                const rowHeight = table.getRowHeight(0) || 23;
                const containerHeight = container.clientHeight;
                const rowsNeeded = Math.floor(containerHeight / rowHeight);
                table.updateSettings({ minRows: rowsNeeded });
                table.render();
            }*/
        });
    }

    export function push(data: Array<Array<any>>) {
        table.updateSettings({ readOnly: false });
        table.populateFromArray(rows_filled, 0, data);
        table.updateSettings({ readOnly: true });
    }

    export function clear() {
        data = [[]];
        table.updateSettings({ readOnly: false });
        table.loadData(data);
        table.updateSettings({ readOnly: true });
        rows_filled = 0;
    }
}