const button = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");
const personalizedMessage =
    document.getElementById("personalizedMessage");

// load the last searched city when the page opens
const lastCity = localStorage.getItem("lastCity");


// if (lastCity) {
//     document.getElementById("cityInput").value = lastCity;

//     // Trigger search after page finishes loading
//     setTimeout(() => {
//         button.click();
//     }, 100);
// }

if (lastCity) {
    personalizedMessage.textContent =
        `Welcome back! Your last searched city was ${lastCity}.`;

    document.getElementById("cityInput").value = lastCity;

    // Automatically load weather for the saved city
    setTimeout(() => {
        button.click();
    }, 100);
}

button.addEventListener("click", async () => {
    const city = document.getElementById("cityInput").value;

    // Save the city
    localStorage.setItem("lastCity", city);

    weatherResult.textContent = "Loading...";

    try {
        // Find coordinates of the city
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        const geoData = await geoResponse.json();

        const latitude = geoData.results[0].latitude;
        const longitude = geoData.results[0].longitude;

        // Get weather for those coordinates
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
        );

        const weatherData = await weatherResponse.json();

        document.getElementById("weatherResult").textContent =
            `${city}: ${weatherData.current.temperature_2m}°C`;

    } catch (error) {
        weatherResult.textContent = "Error: Could not fetch weather data"
    }
});