// Import Parameters
const savedData = JSON.parse(sessionStorage.getItem('SetupData'));
if (!savedData) {
    throw new Error("SetupData not found in sessionStorage. Please configure the setup first.");
}
console.log("Retrieved Setup Data:", savedData);

// Serial Configuration
const baud = parseInt(savedData.baud, 10);
const break_char = savedData.breakChar;

// Grid Variables
const title = savedData.title;
const xTitle = savedData.xTitle;
const yTitle = savedData.yTitle;

const xType = savedData.xType;
const xMin = (xType === 'linear') ? parseFloat(savedData.xMin) : null;
const xMax = (xType === 'linear') ? parseFloat(savedData.xMax) : null;

const yType = savedData.yType;
const auto = savedData.auto;
const yMin = auto ? null : parseFloat(savedData.yMin);
const yMax = auto ? null : parseFloat(savedData.yMax);

// Datasets
const point = savedData.points;
const fill = savedData.fill;
const dataset_labels = savedData.dataset_labels;
const dataset_colors = savedData.dataset_colors;