/**
 * Hava Durumu Uygulaması - Ana JavaScript Dosyası
 * 
 * Bu uygulama OpenWeatherMap API'sini kullanarak hava durumu bilgilerini gösterir.
 * API'den hem anlık hem de tahmin verilerini alır ve kullanıcı dostu bir arayüzle sunar.
 * 
 * Teknik Seçimler:
 * - Font Awesome ikonları: Daha hafif ve hızlı yükleme için SVG ikonlar yerine tercih edildi
 * - Fetch API: Modern ve Promise tabanlı veri çekme için XMLHttpRequest yerine kullanıldı
 * - CSS Animasyonlar: Daha iyi performans için JavaScript animasyonları yerine tercih edildi
 * - ES6+ Özellikleri: Modern JavaScript özellikleri (template literals, arrow functions) kullanıldı
 * 
 * API Detayları:
 * - Base URL: api.openweathermap.org
 * - Endpoints: /data/2.5/weather (anlık) ve /data/2.5/forecast (tahmin)
 * - Parametreler: 
 *   - units=metric (Celsius)
 *   - lang=tr (Türkçe açıklamalar)
 * 
 * Hata Yönetimi:
 * - Şehir bulunamadığında kullanıcıya bilgi verilir
 * - API hatalarında alert ile kullanıcı bilgilendirilir
 * - Boş şehir girişi kontrolü yapılır
 * 
 * @author [Ertuğrul Sarsar]
 * @version 1.0.0
 * @see https://openweathermap.org/api
 */

// Lottie animasyon dosyalarının yolları
const weatherAnimations = {
    Clear: 'https://assets2.lottiefiles.com/packages/lf20_xlky4kvh.json',     // Güneşli
    Clouds: 'https://assets2.lottiefiles.com/packages/lf20_kxsd2ytf.json',    // Bulutlu
    Rain: 'https://assets2.lottiefiles.com/packages/lf20_bko4fxts.json',      // Yağmurlu
    Snow: 'https://assets2.lottiefiles.com/packages/lf20_qs1nybrq.json',      // Karlı
    Thunderstorm: 'https://assets2.lottiefiles.com/packages/lf20_bb9mtg6v.json', // Fırtınalı
    Default: 'https://assets2.lottiefiles.com/packages/lf20_xlky4kvh.json'    // Varsayılan
};

/**
 * Hava durumu ikonları için Font Awesome mapping
 * OpenWeatherMap API'den gelen hava durumu kodlarını Font Awesome ikonlarına çevirir
 * fa-4x class'ı ile ikonların boyutu büyütülmüştür
 * 
 * Neden Font Awesome?
 * - SVG tabanlı olduğu için her ekran boyutunda net görüntü
 * - Yaygın kullanım ve geniş ikon kütüphanesi
 * - Hızlı yükleme ve düşük kaynak kullanımı
 */
const weatherIcons = {
    Clear: '<i class="fas fa-sun fa-4x"></i>',          // Güneşli hava
    Clouds: '<i class="fas fa-cloud fa-4x"></i>',       // Bulutlu hava
    Rain: '<i class="fas fa-cloud-rain fa-4x"></i>',    // Yağmurlu hava
    Snow: '<i class="fas fa-snowflake fa-4x"></i>',     // Karlı hava
    Thunderstorm: '<i class="fas fa-bolt fa-4x"></i>',  // Fırtınalı hava
    Default: '<i class="fas fa-cloud fa-4x"></i>'       // Tanımlanmamış durumlar
};

// Mevcut animasyon referansını tutmak için değişken
let currentAnimation = null;

/**
 * Ana hava durumu fonksiyonu
 * Kullanıcının girdiği şehir için hava durumu verilerini çeker
 * 
 * İşlem Adımları:
 * 1. Şehir adı kontrolü
 * 2. API endpoint'lerinin hazırlanması
 * 3. Anlık hava durumu verisi çekme
 * 4. Tahmin verilerini çekme
 * 5. Hata yönetimi
 * 
 * API Parametreleri:
 * - units=metric: Sıcaklık birimi Celsius
 * - lang=tr: Türkçe hava durumu açıklamaları
 * 
 * Hata Yönetimi:
 * - Boş şehir kontrolü
 * - API response kontrolü
 * - Kullanıcı bilgilendirme
 */
function getWeather() {
    const apiKey = "777b5f48d997639e538d0d2d2fd2678a";
    const city = document.getElementById("city").value;

    // Boş şehir kontrolü
    if (!city) {
        alert("Lütfen bir şehir girin");
        return;
    }

    // API endpoint'leri
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=tr`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=tr`;

    // Promise chain ile sıralı veri çekme
    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) throw new Error("Şehir bulunamadı");
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            return fetch(forecastUrl);  // Tahmin verilerini çek
        })
        .then(response => response.json())
        .then(data => displayForecast(data.list))
        .catch(error => alert(error.message));
}

/**
 * Hava durumu verilerini ekranda gösterir
 * API'den gelen verileri kullanıcı dostu formatta sunar
 * 
 * @param {Object} data - API'den gelen hava durumu verisi
 * 
 * Gösterilen Bilgiler:
 * - Şehir adı
 * - Sıcaklık (°C)
 * - Hava durumu açıklaması
 * - Nem oranı (%)
 * - Rüzgar hızı (m/s)
 * 
 * Not: Sıcaklık değeri yuvarlanarak gösterilir
 */
function displayWeather(data) {
    const weatherType = data.weather[0].main;
    
    // Görünürlük ayarları
    document.querySelector('.weather-box').classList.add('active');
    document.querySelector('.forecast-container').classList.add('active');
    
    // DOM güncellemeleri
    document.getElementById('lottie-container').innerHTML = weatherIcons[weatherType] || weatherIcons.Default;
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind').textContent = `${data.wind.speed} m/s`;
}

/**
 * Tahmin verilerini ekranda gösterir
 * Sonraki 15 saat için 3'er saatlik tahminleri listeler
 * 
 * @param {Array} forecastData - API'den gelen tahmin verileri listesi
 * 
 * Özellikler:
 * - İlk 5 tahmin gösterilir (15 saat)
 * - Her tahmin için saat, sıcaklık ve açıklama
 * - Responsive grid yapısı
 * - Hover efektleri
 */
function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    // İlk 5 tahmini göster
    for (let i = 0; i < 5; i++) {
        const forecast = forecastData[i];
        const time = new Date(forecast.dt * 1000).getHours() + ":00";
        const weatherType = forecast.weather[0].main;
        
        // Tahmin kartı oluştur
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="forecast-time">${time}</div>
            ${weatherIcons[weatherType] || weatherIcons.Default}
            <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
            <div class="forecast-desc">${forecast.weather[0].description}</div>
        `;
        
        forecastContainer.appendChild(forecastItem);
    }
}

/**
 * Enter tuşu ile arama yapılmasını sağlar
 * Kullanıcı deneyimini iyileştirmek için eklendi
 * 
 * Özellikler:
 * - Enter tuşu kontrolü
 * - Hızlı arama imkanı
 * - Mobil kullanımda kolaylık
 */
document.getElementById('city').addEventListener('keypress', e => {
    if (e.key === 'Enter') getWeather();
}); 