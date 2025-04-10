addEventListener("DOMContentLoaded", function () {
    const sun = document.getElementById("sun-icon");
    const moon = document.getElementById("moon-icon");
    const toggle = document.getElementById("theme-selector");

    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);

    function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        sun.style.display = theme === "light" ? "block" : "none";
        moon.style.display = theme === "dark" ? "block" : "none";
        localStorage.setItem("theme", theme);
    }
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        setTheme(newTheme);
    }

    toggle.addEventListener("click", toggleTheme);
});