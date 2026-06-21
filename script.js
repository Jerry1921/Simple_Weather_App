document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("searchBtn");
    const weatherResult = document.getElementById("weatherResult");
    const personalizedMessage =
        document.getElementById("personalizedMessage");

    const clearBtn = document.getElementById("clearHistoryBtn");

    const lastCity = localStorage.getItem("lastCity");

    if (lastCity) {
        personalizedMessage.textContent =
            `Welcome back! Your last searched city was ${lastCity}.`;

        document.getElementById("cityInput").value = lastCity;

        setTimeout(() => {
            button.click();
        }, 100);
    }

    button.addEventListener("click", async () => {
        const city = document.getElementById("cityInput").value;

        localStorage.setItem("lastCity", city);

        weatherResult.textContent = "Loading...";

        try {
            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
            );

            const geoData = await geoResponse.json();

            const latitude = geoData.results[0].latitude;
            const longitude = geoData.results[0].longitude;

            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
            );

            const weatherData = await weatherResponse.json();

            weatherResult.textContent =
                `${city}: ${weatherData.current.temperature_2m}°C`;

        } catch (error) {
            weatherResult.textContent =
                "Error: Could not fetch weather data";
        }
    });

    clearBtn.addEventListener("click", () => {
        localStorage.removeItem("lastCity");

        document.getElementById("cityInput").value = "";
        document.getElementById("personalizedMessage").textContent = "";
        weatherResult.textContent =
            "Weather data will appear here.";
    });
});