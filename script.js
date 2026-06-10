const apiKey = "6318c6a56d0fdfdae4c3892ea10c976c";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// 1. FUNGSI UTAMA UNTUK UPDATE TAMPILAN
async function updateWeatherUI(data) {
    document.getElementById("city").innerHTML = data.name;
    document.getElementById("temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.getElementById("humidity").innerHTML = data.main.humidity + "%";
    document.getElementById("wind").innerHTML = data.wind.speed + " km/j";
    document.getElementById("desc").innerHTML = data.weather[0].description;
    
    const iconCode = data.weather[0].icon;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // Mengubah warna background berdasarkan kondisi cuaca asli
    const main = data.weather[0].main;
    const body = document.body;
    if(main === "Clear") body.style.background = "linear-gradient(135deg, #f39c12, #f1c40f)";
    else if(main === "Rain") body.style.background = "linear-gradient(135deg, #2c3e50, #34495e)";
    else if(main === "Clouds") body.style.background = "linear-gradient(135deg, #7f8c8d, #95a5a6)";
    else body.style.background = "linear-gradient(135deg, #00feba, #5b548a)";

    document.getElementById("weatherData").style.style.opacity = "1";
    document.getElementById("errorMessage").style.display = "none";
}

// 2. FUNGSI UNTUK MENCARI KOTA MANUAL
async function checkWeather() {
    const city = document.getElementById("cityInput").value;
    if(city.trim() === "") return;

    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (response.status === 404) {
        document.getElementById("errorMessage").style.display = "block";
    } else {
        const data = await response.json();
        updateWeatherUI(data);
    }
}

// 3. FUNGSI DETEKSI LOKASI GPS HP/LAPTOP
function getLocation() {
    if (navigator.geolocation) {
        document.getElementById("city").innerHTML = "Mencari Lokasi...";
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
                const data = await res.json();
                updateWeatherUI(data);
            },
            (error) => {
                // Jika user menolak izin lokasi, ambil default kota Denpasar
                loadDefaultCity();
            }
        );
    } else {
        loadDefaultCity();
    }
}

// 4. FUNGSI JIKA LOKASI DI-BLOCK / GA AD AKSES GPS
async function loadDefaultCity() {
    const defaultCity = "Denpasar"; // Anda bebas mengganti kota awal ini
    const response = await fetch(apiUrl + defaultCity + `&appid=${apiKey}`);
    const data = await response.json();
    updateWeatherUI(data);
}

// 5. OTOMATIS JALAN SAAT HALAMAN DIBUKA (Paling Penting!)
window.onload = function() {
    getLocation(); // Pertama, coba pakai lokasi GPS asli user. Jika gagal otomatis lari ke Denpasar.
};

// Fitur Enter Keyboard
document.getElementById("cityInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        checkWeather();
    }
});