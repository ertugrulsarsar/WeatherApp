/**
 * Hava Durumu Uygulaması - Modüler JavaScript Yapısı
 * SOLID Prensiplerine Uygun Geliştirilmiş Versiyon
 * 
 * Sınıf Yapısı:
 * - WeatherApp: Ana uygulama sınıfı
 * - WeatherAPI: API işlemleri için ayrı sınıf
 * - WeatherUI: Kullanıcı arayüzü işlemleri
 * - WeatherUtils: Yardımcı fonksiyonlar
 * 
 * @author Ertuğrul Sarsar
 * @version 2.0.0
 */

// ==================== YARDIMCI SINIFLAR ====================

/**
 * Hava durumu ikonları için sabit değerler
 * OpenWeatherMap API kodlarını Font Awesome ikonlarına eşler
 */
class WeatherIcons {
    static ICONS = {
        Clear: '<i class="fas fa-sun fa-4x"></i>',
        Clouds: '<i class="fas fa-cloud fa-4x"></i>',
        Rain: '<i class="fas fa-cloud-rain fa-4x"></i>',
        Snow: '<i class="fas fa-snowflake fa-4x"></i>',
        Thunderstorm: '<i class="fas fa-bolt fa-4x"></i>',
        Drizzle: '<i class="fas fa-cloud-drizzle fa-4x"></i>',
        Mist: '<i class="fas fa-smog fa-4x"></i>',
        Smoke: '<i class="fas fa-smog fa-4x"></i>',
        Haze: '<i class="fas fa-smog fa-4x"></i>',
        Dust: '<i class="fas fa-smog fa-4x"></i>',
        Fog: '<i class="fas fa-smog fa-4x"></i>',
        Sand: '<i class="fas fa-smog fa-4x"></i>',
        Ash: '<i class="fas fa-smog fa-4x"></i>',
        Squall: '<i class="fas fa-wind fa-4x"></i>',
        Tornado: '<i class="fas fa-wind fa-4x"></i>',
        Default: '<i class="fas fa-cloud fa-4x"></i>'
    };

    /**
     * Hava durumu tipine göre ikon döndürür
     * @param {string} weatherType - Hava durumu tipi
     * @returns {string} HTML ikon kodu
     */
    static getIcon(weatherType) {
        return this.ICONS[weatherType] || this.ICONS.Default;
    }
}

/**
 * Yardımcı fonksiyonlar sınıfı
 * Genel kullanım için utility fonksiyonları
 */
class WeatherUtils {
    /**
     * Sıcaklık değerini yuvarlar ve formatlar
     * @param {number} temp - Sıcaklık değeri
     * @returns {string} Formatlanmış sıcaklık
     */
    static formatTemperature(temp) {
        return `${Math.round(temp)}°C`;
    }

    /**
     * Unix timestamp'i saat formatına çevirir
     * @param {number} timestamp - Unix timestamp
     * @returns {string} Saat formatı (HH:00)
     */
    static formatTime(timestamp) {
        return new Date(timestamp * 1000).getHours() + ":00";
    }

    /**
     * DOM elementini güvenli şekilde seçer
     * @param {string} selector - CSS seçici
     * @returns {HTMLElement|null} DOM elementi
     */
    static safeQuerySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.error(`DOM seçici hatası: ${selector}`, error);
            return null;
        }
    }

    /**
     * API yanıtını kontrol eder
     * @param {Response} response - Fetch API yanıtı
     * @returns {Promise} Kontrol edilmiş yanıt
     */
    static async checkResponse(response) {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }
}

// ==================== API SINIFI ====================

/**
 * OpenWeatherMap API işlemleri için ayrı sınıf
 * Single Responsibility Principle'a uygun
 */
class WeatherAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.defaultParams = {
            units: 'metric',
            lang: 'tr'
        };
    }

    /**
     * API URL'ini oluşturur
     * @param {string} endpoint - API endpoint'i
     * @param {Object} params - Ek parametreler
     * @returns {string} Tam API URL'i
     */
    buildUrl(endpoint, params = {}) {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        const allParams = { ...this.defaultParams, ...params, appid: this.apiKey };
        
        Object.entries(allParams).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
        
        return url.toString();
    }

    /**
     * Anlık hava durumu verilerini çeker
     * @param {string} city - Şehir adı
     * @returns {Promise<Object>} Hava durumu verisi
     */
    async getCurrentWeather(city) {
        try {
            const url = this.buildUrl('/weather', { q: city });
            const response = await fetch(url);
            return await WeatherUtils.checkResponse(response);
        } catch (error) {
            throw new Error(`Hava durumu verisi alınamadı: ${error.message}`);
        }
    }

    /**
     * Tahmin verilerini çeker
     * @param {string} city - Şehir adı
     * @returns {Promise<Object>} Tahmin verisi
     */
    async getForecast(city) {
        try {
            const url = this.buildUrl('/forecast', { q: city });
            const response = await fetch(url);
            return await WeatherUtils.checkResponse(response);
        } catch (error) {
            throw new Error(`Tahmin verisi alınamadı: ${error.message}`);
        }
    }
}

// ==================== UI SINIFI ====================

/**
 * Kullanıcı arayüzü işlemleri için ayrı sınıf
 * DOM manipülasyonu ve görsel güncellemeler
 */
class WeatherUI {
    constructor() {
        this.elements = this.initializeElements();
        this.bindEvents();
    }

    /**
     * DOM elementlerini başlatır ve cache'ler
     * @returns {Object} DOM elementleri objesi
     */
    initializeElements() {
        return {
            cityInput: WeatherUtils.safeQuerySelector('#city'),
            searchButton: WeatherUtils.safeQuerySelector('button'),
            weatherBox: WeatherUtils.safeQuerySelector('.weather-box'),
            forecastContainer: WeatherUtils.safeQuerySelector('.forecast-container'),
            lottieContainer: WeatherUtils.safeQuerySelector('#lottie-container'),
            cityName: WeatherUtils.safeQuerySelector('#cityName'),
            temperature: WeatherUtils.safeQuerySelector('#temperature'),
            description: WeatherUtils.safeQuerySelector('#description'),
            humidity: WeatherUtils.safeQuerySelector('#humidity'),
            wind: WeatherUtils.safeQuerySelector('#wind'),
            forecast: WeatherUtils.safeQuerySelector('#forecast')
        };
    }

    /**
     * Event listener'ları bağlar
     */
    bindEvents() {
        // Enter tuşu ile arama
        this.elements.cityInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.triggerSearch();
            }
        });

        // Arama butonu ile arama
        this.elements.searchButton?.addEventListener('click', () => {
            this.triggerSearch();
        });
    }

    /**
     * Arama işlemini tetikler
     */
    triggerSearch() {
        const city = this.elements.cityInput?.value?.trim();
        if (!city) {
            this.showError('Lütfen bir şehir adı girin');
            return;
        }
        
        // Global WeatherApp instance'ını kullan
        if (window.weatherApp) {
            window.weatherApp.searchWeather(city);
        }
    }

    /**
     * Hata mesajını gösterir
     * @param {string} message - Hata mesajı
     */
    showError(message) {
        // Önceki hata mesajlarını temizle
        this.clearErrors();
        
        // Yeni hata mesajı oluştur
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            background: rgba(255, 0, 0, 0.1);
            color: #ff6b6b;
            padding: 15px;
            border-radius: 12px;
            margin: 20px 0;
            text-align: center;
            border: 1px solid rgba(255, 0, 0, 0.3);
            animation: fadeIn 0.3s ease;
        `;
        
        // Hata mesajını sayfaya ekle
        const container = WeatherUtils.safeQuerySelector('.container');
        const searchBox = WeatherUtils.safeQuerySelector('.search-box');
        container?.insertBefore(errorDiv, searchBox?.nextSibling);
        
        // 5 saniye sonra otomatik kaldır
        setTimeout(() => this.clearErrors(), 5000);
    }

    /**
     * Hata mesajlarını temizler
     */
    clearErrors() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());
    }

    /**
     * Loading durumunu gösterir
     * @param {boolean} isLoading - Loading durumu
     */
    showLoading(isLoading) {
        const button = this.elements.searchButton;
        if (button) {
            if (isLoading) {
                button.textContent = 'Aranıyor...';
                button.disabled = true;
                button.style.opacity = '0.7';
            } else {
                button.textContent = 'Ara';
                button.disabled = false;
                button.style.opacity = '1';
            }
        }
    }

    /**
     * Hava durumu verilerini ekranda gösterir
     * @param {Object} data - API'den gelen veri
     */
    displayWeather(data) {
        const weatherType = data.weather[0].main;
        
        // Görünürlük ayarları
        this.elements.weatherBox?.classList.add('active');
        this.elements.forecastContainer?.classList.add('active');
        
        // DOM güncellemeleri
        if (this.elements.lottieContainer) {
            this.elements.lottieContainer.innerHTML = WeatherIcons.getIcon(weatherType);
        }
        
        if (this.elements.cityName) {
            this.elements.cityName.textContent = data.name;
        }
        
        if (this.elements.temperature) {
            this.elements.temperature.textContent = WeatherUtils.formatTemperature(data.main.temp);
        }
        
        if (this.elements.description) {
            this.elements.description.textContent = data.weather[0].description;
        }
        
        if (this.elements.humidity) {
            this.elements.humidity.textContent = `${data.main.humidity}%`;
        }
        
        if (this.elements.wind) {
            this.elements.wind.textContent = `${data.wind.speed} m/s`;
        }
    }

    /**
     * Tahmin verilerini ekranda gösterir
     * @param {Array} forecastData - Tahmin verileri listesi
     */
    displayForecast(forecastData) {
        if (!this.elements.forecast) return;
        
        this.elements.forecast.innerHTML = '';

        // İlk 5 tahmini göster (15 saat)
        const forecasts = forecastData.slice(0, 5);
        
        forecasts.forEach(forecast => {
            const time = WeatherUtils.formatTime(forecast.dt);
            const weatherType = forecast.weather[0].main;
            
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="forecast-time">${time}</div>
                ${WeatherIcons.getIcon(weatherType)}
                <div class="forecast-temp">${WeatherUtils.formatTemperature(forecast.main.temp)}</div>
                <div class="forecast-desc">${forecast.weather[0].description}</div>
            `;
            
            this.elements.forecast.appendChild(forecastItem);
        });
    }

    /**
     * Tüm verileri temizler
     */
    clearData() {
        this.elements.weatherBox?.classList.remove('active');
        this.elements.forecastContainer?.classList.remove('active');
        this.clearErrors();
    }
}

// ==================== ANA UYGULAMA SINIFI ====================

/**
 * Ana hava durumu uygulaması sınıfı
 * Tüm bileşenleri koordine eder
 */
class WeatherApp {
    constructor(apiKey) {
        this.api = new WeatherAPI(apiKey);
        this.ui = new WeatherUI();
        this.isLoading = false;
        
        // Son aranan şehirleri localStorage'da sakla
        this.recentSearches = this.loadRecentSearches();
    }

    /**
     * Son aranan şehirleri localStorage'dan yükler
     * @returns {Array} Son aranan şehirler listesi
     */
    loadRecentSearches() {
        try {
            const saved = localStorage.getItem('weatherApp_recentSearches');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Son aranan şehirler yüklenemedi:', error);
            return [];
        }
    }

    /**
     * Son aranan şehri kaydeder
     * @param {string} city - Şehir adı
     */
    saveRecentSearch(city) {
        try {
            // Aynı şehri tekrar ekleme
            this.recentSearches = this.recentSearches.filter(c => c !== city);
            this.recentSearches.unshift(city);
            
            // Sadece son 5 şehri sakla
            this.recentSearches = this.recentSearches.slice(0, 5);
            
            localStorage.setItem('weatherApp_recentSearches', JSON.stringify(this.recentSearches));
        } catch (error) {
            console.error('Son aranan şehir kaydedilemedi:', error);
        }
    }

    /**
     * Hava durumu arama işlemi
     * @param {string} city - Şehir adı
     */
    async searchWeather(city) {
        if (this.isLoading) return;
        
        try {
            this.isLoading = true;
            this.ui.showLoading(true);
            this.ui.clearData();

            // Paralel olarak hem anlık hem tahmin verilerini çek
            const [currentWeather, forecast] = await Promise.all([
                this.api.getCurrentWeather(city),
                this.api.getForecast(city)
            ]);

            // Verileri göster
            this.ui.displayWeather(currentWeather);
            this.ui.displayForecast(forecast.list);
            
            // Başarılı aramayı kaydet
            this.saveRecentSearch(city);
            
        } catch (error) {
            console.error('Hava durumu arama hatası:', error);
            this.ui.showError(error.message);
        } finally {
            this.isLoading = false;
            this.ui.showLoading(false);
        }
    }

    /**
     * Uygulamayı başlatır
     */
    init() {
        console.log('🌤️ Hava Durumu Uygulaması başlatıldı');
        
        // Global erişim için window objesine ekle
        window.weatherApp = this;
        
        // Sayfa yüklendiğinde son aranan şehri göster (opsiyonel)
        if (this.recentSearches.length > 0) {
            const lastCity = this.recentSearches[0];
            const cityInput = this.ui.elements.cityInput;
            if (cityInput) {
                cityInput.value = lastCity;
                cityInput.placeholder = `Son aranan: ${lastCity}`;
            }
        }
    }
}

// ==================== UYGULAMA BAŞLATMA ====================

/**
 * Uygulama başlatma fonksiyonu
 * DOM yüklendiğinde çalışır
 */
function initializeWeatherApp() {
    // API anahtarını güvenli şekilde tanımla
    const API_KEY = "777b5f48d997639e538d0d2d2fd2678a";
    
    try {
        const app = new WeatherApp(API_KEY);
        app.init();
    } catch (error) {
        console.error('Uygulama başlatılamadı:', error);
        alert('Uygulama başlatılırken bir hata oluştu. Lütfen sayfayı yenileyin.');
    }
}

// DOM yüklendiğinde uygulamayı başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWeatherApp);
} else {
    initializeWeatherApp();
}

// ==================== GLOBAL FONKSİYONLAR (Geriye Uyumluluk) ====================

/**
 * Eski API uyumluluğu için global fonksiyon
 * @deprecated Yeni WeatherApp sınıfını kullanın
 */
function getWeather() {
    const cityInput = document.getElementById('city');
    const city = cityInput?.value?.trim();
    
    if (city && window.weatherApp) {
        window.weatherApp.searchWeather(city);
    } else {
        alert('Lütfen bir şehir adı girin');
    }
} 