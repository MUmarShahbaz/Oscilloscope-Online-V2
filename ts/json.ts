function download_json(json : JSONValue) {
    const jsonStr = JSON.stringify(json, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    download_blob(blob);
}

function download_blob(blob : Blob) {
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
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