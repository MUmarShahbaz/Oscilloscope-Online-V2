document.addEventListener('DOMContentLoaded', () => {
    // X axis Fields
    const X_Axis_Type = document.getElementById('xType');
    const X_Axis_Linear = document.getElementById('xLinearC');
    const X_Axis_Time = document.getElementById('xTimeC');

    const toggle_X_Fields = () => {
        const display_X_Linear = X_Axis_Type.value === 'linear';
        X_Axis_Linear.style.display = display_X_Linear ? 'block' : 'none';

        const display_X_Time = X_Axis_Type.value === 'time';
        X_Axis_Time.style.display = display_X_Time ? 'block' : 'none';

    }

    X_Axis_Type.addEventListener('change', toggle_X_Fields);


    // Y axis Fields Log
    const Y_Axis_Type = document.getElementById("yType");
    const Y_Min = document.getElementById("yMin");
    const Y_Max = document.getElementById("yMax");

    function update_Y_Fields() {
        if (Y_Axis_Type.value != 'linear') {
        Y_Min.min = "1";
        Y_Max.min = "1";

        if (parseFloat(Y_Min.value) <= 0) Y_Min.value = "1";
        if (parseFloat(Y_Max.value) <= 0) Y_Max.value = "1000";

        } else {
            Y_Min.removeAttribute("min");
            Y_Max.removeAttribute("min");
        }
    }

    Y_Axis_Type.addEventListener("change", update_Y_Fields);

    // Y axis Fields auto
    const Y_Axis_Auto = document.getElementById('auto');
    const Y_Axis_Fields = document.getElementById('yFieldsC');

    const toggle_Y_Fields = () => {
        const display_Y_Fields = Y_Axis_Auto.value === 'false';
        Y_Axis_Fields.style.display = display_Y_Fields ? 'block' : 'none';
    }

    Y_Axis_Auto.addEventListener('change', toggle_Y_Fields);

    // Graph Fields
    const Graph_Num = document.getElementById('graphNum');
    const Graph_Fields = document.getElementById('graphFields');

    const update_Graph_Fields = () => {
        Graph_Fields.innerHTML = '';
        const total_Graphs = parseInt(Graph_Num.value, 10);


        for (let i = 1; i <= total_Graphs; i++) {
            const random_Color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

            const graph_Name = document.createElement('div');
            graph_Name.innerHTML = `
                <label for="graph${i}Name">Graph ${i} Name:</label>
                <input id="graph${i}Name" type="text" value="Graph ${i}" required>
            `;
            const br = document.createElement('br');
            const graph_Color = document.createElement('div');
            graph_Color.innerHTML = `
                <label for="graph${i}Color">Graph ${i} Color:</label>
                <input id="graph${i}Color" type="color" value="${random_Color}" required>
            `;

            Graph_Fields.appendChild(graph_Name);
            Graph_Fields.appendChild(br);
            Graph_Fields.appendChild(graph_Color);
            Graph_Fields.appendChild(br.cloneNode(true));
            Graph_Fields.appendChild(br.cloneNode(true));
            Graph_Fields.appendChild(br.cloneNode(true));
        }
    };

    Graph_Num.addEventListener('change', update_Graph_Fields);

    // Initial setup
    toggle_X_Fields();
    toggle_Y_Fields();
    //update_Y_Fields();
    update_Graph_Fields();
});