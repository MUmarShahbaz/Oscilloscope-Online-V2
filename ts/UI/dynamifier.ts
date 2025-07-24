function setup_ui(DOM_Elements : SETUP_UI.DOM_Elements, form: HTMLFormElement) : SETUP_UI.Refresher {
    // Toggle between time and linear settings
  function toggleTimeSettings() {
    if (DOM_Elements.xType.value === "time") {
      DOM_Elements.timeS.style.display = "block";
      DOM_Elements.linearS.style.display = "none";
    } else {
      DOM_Elements.timeS.style.display = "none";
      DOM_Elements.linearS.style.display = "block";
    }
  }

  // Update auto scale logic based on Y-axis type
  function updateAutoScaleLogic() {
    const isLogScale = DOM_Elements.yType.value === "log10" || DOM_Elements.yType.value === "log2";

    if (isLogScale) {
      // Force auto scale for logarithmic Y-axis
      DOM_Elements.auto.checked = true;
      DOM_Elements.auto.disabled = true;
      DOM_Elements.yRange.style.display = "none";
    } else {
      // Enable auto scale checkbox for linear Y-axis
      DOM_Elements.auto.disabled = false;
      DOM_Elements.yRange.style.display = DOM_Elements.auto.checked ? "none" : "block";
    }
  }

  // Update graph configurations based on count
  function updateGraphConfigs() {
    DOM_Elements.graphsS.innerHTML = "";
    const count = parseInt(DOM_Elements.graphs.value);
    const colors = [
      "#007bff", "#28a745", "#dc3545", "#ffc107", "#17a2b8",
      "#6f42c1", "#fd7e14", "#20c997", "#6c757d", "#343a40"
    ];

    for (let i = 1; i <= count; i++) {
      const graphDiv = document.createElement("div");
      graphDiv.className = "border rounded p-3 mb-3 graph-config";
      graphDiv.setAttribute("data-graph", i.toString());

      const color = colors[(i - 1) % colors.length];
      graphDiv.innerHTML = `
        <h5 class="mb-3">Graph ${i} Configuration</h5>
        <div class="row g-3">
          <div class="col-md-6">
            <label for="graph${i}Name" class="form-label">Graph Name</label>
            <input type="text" class="form-control" id="graph${i}Name" name="graph${i}Name" value="Graph ${i}" required>
          </div>
          <div class="col-md-6">
            <label for="graph${i}Color" class="form-label">Graph Color</label>
            <input type="color" class="form-control form-control-color" id="graph${i}Color" name="graph${i}Color" value="${color}" required>
          </div>
        </div>
      `;
      DOM_Elements.graphsS.appendChild(graphDiv);
    }
  }

  function refresh_form() {
    toggleTimeSettings();
    updateAutoScaleLogic();
    updateGraphConfigs();
  }

  const default_config : CONFIG_HANDLER.CONFIG = {
  "serial": {
    "break": "/",
    "mcu_commands": {
      "cls": "%",
      "csv": "@",
      "png": "&",
      "json": "$"
    }
  },
  "chart": {
    "title": "Oscilloscope",
    "x": {
      "type": "linear",
      "title": "Index",
      "min": 500,
      "max": 0
    },
    "y": {
      "type": "linear-auto",
      "title": "Value"
    },
    "options": {
      "points": false,
      "fill": false
    }
  },
  "datasets": [
    {
      "label": "Graph 1",
      "color": "#007bff"
    }
  ]
};

  function reset_form() {
    set_config(form, default_config, refresh_form);
  }

    return {
        all: refresh_form,
        x: toggleTimeSettings,
        y: updateAutoScaleLogic,
        graphs: updateGraphConfigs,
        reset: reset_form
    };
} 