const apiKey = "6318c6a56d0fdfdae4c3892ea10c976c";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchInput = document.getElementById("cityInput");
const weatherData = document.getElementById("weatherData");
const errorMessage = document.getElementById("errorMessage");

async function checkWeather() {
    const city = searchInput.value;
    
    // Mencegah pencarian kosong
    if(city === "") return;

    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status === 404) {
        // Jika kota tidak ditemukan
        errorMessage.style.display = "block";
        weatherData.style.display = "none";
    } else {
        // Jika kota ditemukan
        var data = await response.json();

        document.getElementById("city").innerHTML = data.name;
        document.getElementById("temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.getElementById("humidity").innerHTML = data.main.humidity + "%";
        document.getElementById("wind").innerHTML = data.wind.speed + " km/j";

        // Mengganti ikon cuaca sesuai data API
        const iconCode = data.weather[0].icon;
        document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        weatherData.style.display = "block";
        errorMessage.style.display = "none";
    }
}

// Menambahkan fitur pencarian dengan menekan tombol Enter di keyboard
searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        checkWeather();
    }
});