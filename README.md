# Oscilloscope Online V2
<div align="center">
    <img style="width:300px; height;300px" src="assets/img/icon-480.png">
</div>

---

I built **Oscilloscope Online** to solve a simple problem: I needed a quick and accessible way to visualize electronic signals without relying on bulky hardware or expensive equipment.

As someone who works with microcontrollers like **Arduino** and **ESP32**, I wanted a tool that could display waveforms directly in a **web browser**—no extra software, no hassle.

With this project, I made it possible to connect a microcontroller, send data over serial, and instantly see real-time waveforms on-screen. I added features like adjustable scaling, time base control, and measurement tools to make debugging signals easier.

Whether you’re a **student, hobbyist, or engineer**, I built this for people like me—those who want a **fast, simple, and effective oscilloscope** without the extra cost.

---

 🧠 **Not just for signals!**  
 Oscilloscope Online can plot **any numeric data** coming from a serial device—sensor readings, calculated values, or even data streamed from an **SD card**.  
   
 If you're plotting logged data, set ```X Axis Type``` tp ```Time``` : the **first value** in each line will be used as the X-axis (time).

 Alternatively, if you choose ```Text```, then the first part of the string (from beginning to before the break character) will become the X Axis Value.

---

🔗 **Homepage:**  
[https://mumarshahbaz.github.io/Oscilloscope-Online-V2/](https://mumarshahbaz.github.io/Oscilloscope-Online-V2/)

---

## ✅ Supported Browsers

Oscilloscope Online relies on the **Web Serial API**, which is only available in modern Chromium-based browsers:

- Google Chrome  
- Microsoft Edge  
- Opera  

> ❌ Not supported in Firefox, Safari, or iOS browsers.
> 
> More info: [Web Serial API on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API)

---

## 📸 Screenshots

<div align="center">
<img style="width:300px" src="assets/img/Screenshots/Screenshot%20(1).png">
<img style="width:300px" src="assets/img/Screenshots/Screenshot%20(2).png">
<img style="width:500px" src="assets/img/Screenshots/Screenshot%20(3).png">
<img style="width:1000px" src="assets/img/Screenshots/Screenshot%20(4).png">
</div>

---

## ⚙️ Configuration Options

| **Input** | **Description** |
|----------|-----------------|
| **Serial** | |
| Baud rate | The baud rate of the connected serial device. |
| Break character | The character used to separate the output from the serial device. |
| **Grid** | |
| Chart, X & Y Titles | Text to be displayed above, below, and beside the chart. |
| X & Y Axis Type | *Coming soon — currently not applicable.* |
| Auto Scale | Automatically adjusts the Y-axis limits. |
| X & Y Min/Max | The manual limits for the X and Y axes. |
| **Graph** | |
| Show points | Displays a small circle at each data point. |
| Fill area below | Fills the area beneath each graph line. |
| Graph *n* Name | Label for each graph (shown in legend). |
| Graph *n* Color | Color for each graph (shown in legend). |

---

## 🛠 Features

- 📊 Real-time plotting of serial data  
- 🔌 Easy device connection using the **Web Serial API**  
- ⚡ Ultra-fast plotting with [uPlot](https://github.com/leeoniya/uPlot)  
- 🌙 Clean dark mode interface  
- 🔧 Adjustable time scale & Y-axis scaling  
- 📈 Supports multiple data channels and labels  
- 💾 Plot logged data with manual time axis support

---

## 🚀 Getting Started

1. Open [Oscilloscope Online](https://mumarshahbaz.github.io/Oscilloscope-Online-V2/) in Chrome, Opera or Edge.  
2. Visit the Setup Page by clicking **Start Plotting**.
3. Choose your settings (baud rate, labels, plot colors, etc.)
4. Click **Begin Plotting**
5. Click **Connect** and choose your serial device.  
6. Watch your data stream live in real-time!

---

## 📄 License

Licensed under the **Apache 2.0 License**.  
Full details available in [`LICENSE.md`](LICENSE.md).

---

## 💡 Built With

- [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API) – Serial communication  
- [uPlot](https://github.com/leeoniya/uPlot) – Tiny, fast plotting library  
- HTML, CSS, and JavaScript (Vanilla)

---
