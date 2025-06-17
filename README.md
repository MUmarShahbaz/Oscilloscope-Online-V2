<div align="center">
<a href="https://mumarshahbaz.github.io/Oscilloscope-Online-V2/" target="_blank">
<img src="https://img.shields.io/badge/Open_Oscilloscope_Online_V2-%23000?style=for-the-badge&color=%230AF" style="height:60px"></a></div>

---

<div align="center">
<img src="assets/gif/Live Plot.gif" style="width: 1000px"></div>

# Benefit

<div align="center">
<img src="assets/img/Comparision.jpg" style="width: 1000px"></div>

## 🔧 Key Features

- **Enhanced User Interface**  
  A cleaner, more intuitive UI for a seamless user experience.

- **Light & Dark Mode Support**  
  Switch between light and dark themes based on your preference or environment.

- **Plug and Play**  
  No installation required—simply open the link and start using immediately.

- **Multiple Export Options**  
  Export as a `.csv`, `.png` and even `.svg`

- **Import from CSV**  
  CSV files which follow the pattern `Time, Graph1, Graph2...` where the first line is the headings, can be imported. This is also the format of the exports. (Time is always in ms).

- **MCU Commands**  
  Trigger exporting and clear data commands via custom special chars from the MCU.

- **Custom Communication Settings**  
  Define your own baud rate, break characters for flexible serial communication.
  
- **Offline Access**  
  Fully local functionality—download the repo and host the site locally for use without an internet connection.

- **Unlimited Plotting**  
  Visualize as many data streams as you need without restrictions.

- **Real-Time Console Logging**  
  View raw serial data logs alongside plotted visuals.

- **Flexible Plotting Options**  
  Plot data by index or timestamp depending on your use case.

- **Multiple Scale Types**  
  Choose between linear, logarithmic (base 2), and logarithmic (base 10) scales.

- **Auto-Scaling Y-Axis**  
  Automatically adjusts the Y-axis range for optimal data visibility.

- **Support for Null Values**  
  Handles incomplete or missing data gracefully during plotting.

- **Auto CLS**
  Automatically clears screen after the number of collected data has passed a pre-defined threshold.

- **Interactive Visualization**  
  Zoom in and explore plots dynamically with a responsive, interactive graphing interface.

### Example of Interactivity
<div align="center">
<img src="assets/gif/Zoom.gif" style="width: 1000px"></div>

---

## 📈 Plotting Modes

The plotter supports three distinct modes to fit a variety of use cases, ranging from general-purpose visualization to precision timing:

- **Index Mode**  
  Plots data against its sequence index. This mode creates a consistent and unchanging X-axis where each point represents the order in which the data was received.

- **Automatic Time Scaling**  
  Utilizes the system's internal clock to timestamp data upon arrival and uses those values on the X-axis. Suitable for general time-based plotting, but may not offer precise millisecond accuracy due to background processing delays.

- **Manual Time Scaling**  
  Treats the first value in each data packet as the timestamp (typically in milliseconds). Ideal for high-precision plots—especially when using functions like `millis()` in Arduino-based applications. This mode offers the most reliable timing accuracy for microcontroller data.

### Example of Time Scale feature
<div align="center">
<img src="assets/gif/Time Scale.gif" style="width: 1000px"></div>

## 📤 Data Format

The plotter expects incoming data to follow this structure:

<div align="center">
<span style="font-family: monospace; font-size: x-large; font-weight: bold;">Value1 &lt;break_char&gt; Value2 &lt;break_char&gt; Value3 ...\n</span></div>

- Each value should be separated by the configured **break character**.
- The data line must end with a newline (`\n`).

### 🧹 Clear Screen Command

To clear all previously collected data, simply send:

<div align="center"><span style="font-family: monospace; font-size: x-large; font-weight: bold;">CLS_char\n</span></div>

This will reset the plotter and erase existing data.

### ⏱ Manual Time Scaling Note

If you're using **Manual Time Scale** mode, the first value (<span style="font-family: monospace; font-size: large; font-weight: bold;">Value1</span>) is treated as the **timestamp in milliseconds**.  
This is ideal for use with <span style="font-family: monospace; font-size: large; font-weight: bold;">millis()</span> in Arduino or similar microcontrollers.

## ⚙️ Setup Page

All configuration options are available on the **Setup** page.  
You can customize parameters such as baud rate, break/CLS characters, plot types, and more.

A built-in **Help** section is also provided to explain the purpose and functionality of each setting—perfect for new users or quick reference.

<div align="center">
<img src="assets/img/Screenshots/Screenshot (3).png" style="width: 1000px"></div>

## 🎨 Themes

The application supports both **Light** and **Dark** themes to suit different environments and user preferences.

You can toggle between themes anytime.  
Your selected theme is automatically applied across all pages for a consistent visual experience.

<div align="center">
<img src="assets/gif/Light - Dark Mode.gif" style="width: 1000px"></div>


## 🌐 Browser Requirements

To ensure full functionality, your browser must support the following:

- **Web Serial API** – Required for direct communication with serial devices.  
  *Supported in Chromium-based browsers like Chrome, Edge, and Opera.*

- **JavaScript** – Core functionality and interactivity rely heavily on JavaScript.

- **HTML5** – Ensures proper rendering of structural elements.

- **CSS3** – Required for styling, responsive layout, and theming (Light/Dark Mode).

## Made with uPlot
<div class="card-container" style="display: flex; align-items:center; flex-direction: row; justify-content: center; gap: 10px;">
<a href="https://github.com/leeoniya/uPlot" rel="external nofollow noopener" target="_blank">
  <img alt="leeoniya/uPlot" src="https://github-readme-stats.vercel.app/api/pin/?username=leeoniya&amp;repo=uPlot&amp;theme=default&amp;show_owner=false&amp;description_lines_count=3">
</a>
<img src="assets/img/uPlot.svg" style="width: 200px">
</div>