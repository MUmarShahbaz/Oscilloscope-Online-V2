# Oscilloscope-Online-V2

I built Oscilloscope Online to solve a simple problem: I needed a quick and accessible way to visualize electronic signals without relying on bulky hardware or expensive equipment. As someone who works with microcontrollers like Arduino and ESP32, I wanted a tool that could display waveforms directly in a web browser—no extra software, no hassle.

With this project, I made it possible to connect a microcontroller, send data over serial, and instantly see real-time waveforms on-screen. I added features like adjustable scaling, time base control, and measurement tools to make debugging signals easier. Whether you’re a student, hobbyist, or engineer, I built this for people like me—those who want a fast, simple, and effective oscilloscope without the extra cost.

This is Oscilloscope Online—my way of making signal analysis more accessible.

However, it must be noted that this project is not limited only to electric signals. Any numerical value at all can be quickly plotted. The only requirement is that is must come from a Serial Device. Sensor readings, Calculated Values or even data from an SD Card can be plotted.

Regarding the SD Card, I have added a manual timescale. This is to facilitate collecting data over long periods and then plotting it at once. If you enable the TimeScaling option, the first value in each line will be considered as time and the Plotter will automatically use it as the X-Axis Values.