namespace SETUP_UI {
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