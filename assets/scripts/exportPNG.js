const exportPNG = document.getElementById('export-png');
exportPNG.addEventListener('click', () => {
    html2canvas(document.getElementById("plot")).then(canvas => {
        const link = document.createElement("a");
        link.download = "uplot-full-export.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});