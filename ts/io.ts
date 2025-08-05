function download_json(json : JSONValue, name: string) {
    const jsonStr = JSON.stringify(json, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    download_blob(blob, name);
}

function download_svg(svg : SVGElement, name : string) {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const svgWithHeader = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;
    const blob = new Blob([svgWithHeader], { type: 'image/svg+xml' });
    download_blob(blob, name);
}

function download_csv(csv: string, name: string) {
    const blob = new Blob([csv], { type: 'text/csv' });
    download_blob(blob, name);
}

function download_blob(blob : Blob, name : string) {
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}

function import_json(file: File): Promise<JSONValue> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target!.result as string);
            resolve(jsonData);
        } catch (err) {
            reject(err);
        }
        };
        reader.onerror = function(err) { reject(err); }
        reader.readAsText(file);
    });
}