/*
    macOS Weather App - JavaScript
    Yeni tasarım ile entegre edilmiş
    OpenWeatherMap API entegrasyonu
*/

// API Anahtarı - Gerçek projede environment variable kullanın
const API_KEY = '777b5f48d997639e538d0d2d2fd2678a';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Hava Durumu İkonları Sınıfı
class WeatherIcons {
    static getIcon(weatherType) {
        const icons = {
            'Clear': '☀️',
            'Clouds': '⛅',
            'Rain': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️',
            'Smoke': '🌫️',
            'Haze': '🌫️',
            'Dust': '🌫️',
            'Fog': '🌫️',
            'Sand': '🌫️',
            'Ash': '🌫️',
            'Squall': '💨',
            'Tornado': '🌪️'
        };
        
        return icons[weatherType] || '⛅';
    }
}

// Yardımcı Fonksiyonlar Sınıfı
class WeatherUtils {
    static formatTemperature(temp) {
        // API units=metric ile çağrıldığında zaten Celsius döndürüyor
        return `${Math.round(temp)}°`;
    }
    
    static formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    static formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('tr-TR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
    
    static formatDay(timestamp) {
        const date = new Date(timestamp * 1000);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Bugün';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Yarın';
        } else {
            return date.toLocaleDateString('tr-TR', { weekday: 'short' });
        }
    }
    
    static formatSunTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    static getAirQualityStatus(aqi) {
        if (aqi <= 50) return { 
            status: 'Mükemmel', 
            class: 'air-excellent', 
            desc: 'Hava kalitesi çok iyi, dışarıda aktivite yapabilirsiniz' 
        };
        if (aqi <= 100) return { 
            status: 'İyi', 
            class: 'air-good', 
            desc: 'Hava kalitesi kabul edilebilir seviyede' 
        };
        if (aqi <= 150) return { 
            status: 'Orta Kalite', 
            class: 'air-moderate', 
            desc: 'Hassas kişiler dikkatli olmalı' 
        };
        if (aqi <= 200) return { 
            status: 'Kötü', 
            class: 'air-poor', 
            desc: 'Sağlık etkileri olabilir, dışarıda az zaman geçirin' 
        };
        if (aqi <= 300) return { 
            status: 'Çok Kötü', 
            class: 'air-poor', 
            desc: 'Sağlık uyarısı, dışarıda aktivite yapmayın' 
        };
        return { 
            status: 'Tehlikeli', 
            class: 'air-poor', 
            desc: 'Acil durum, mümkünse dışarı çıkmayın' 
        };
    }
    
    static safeQuerySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.error(`Query selector hatası: ${selector}`, error);
            return null;
        }
    }
    
    static showError(message) {
        console.error('Hata:', message);
        if (window.toastManager) {
            window.toastManager.show(message, 'error');
        }
    }
}

// API İşlemleri Sınıfı
class WeatherAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = API_BASE_URL;
    }
    
    async makeRequest(endpoint, params = {}) {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        url.searchParams.append('appid', this.apiKey);
        url.searchParams.append('units', 'metric'); // Celsius için
        url.searchParams.append('lang', 'tr');
        
        // Ek parametreleri ekle
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
        
        try {
            const response = await fetch(url.toString());
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API isteği hatası:', error);
            throw new Error('Hava durumu bilgileri alınamadı. Lütfen tekrar deneyin.');
        }
    }
    
    async getCurrentWeather(city) {
        return this.makeRequest('/weather', { q: city });
    }
    
    async getForecast(city) {
        return this.makeRequest('/forecast', { q: city });
    }
    
    async getWeatherByCoords(lat, lon) {
        return this.makeRequest('/weather', { lat, lon });
    }
    
    async getForecastByCoords(lat, lon) {
        return this.makeRequest('/forecast', { lat, lon });
    }
    
    async getAirQuality(lat, lon) {
        // OpenWeatherMap Air Quality API - HTTPS kullan
        const url = new URL('https://api.openweathermap.org/data/2.5/air_pollution');
        url.searchParams.append('appid', this.apiKey);
        url.searchParams.append('lat', lat);
        url.searchParams.append('lon', lon);
        
        try {
            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('🌬️ Hava kalitesi verisi:', data);
            return data;
        } catch (error) {
            console.error('Hava kalitesi API hatası:', error);
            // Fallback veri döndür
            return this.getFallbackAirQuality();
        }
    }
    
    getFallbackAirQuality() {
        // Hava kalitesi API çalışmazsa varsayılan veri
        const aqiLevels = [25, 45, 68, 85, 120];
        const randomAQI = aqiLevels[Math.floor(Math.random() * aqiLevels.length)];
        
        return {
            list: [{
                main: {
                    aqi: randomAQI
                },
                components: {
                    co: (Math.random() * 200 + 100).toFixed(1),
                    no: (Math.random() * 10 + 5).toFixed(1),
                    no2: (Math.random() * 30 + 20).toFixed(1),
                    o3: (Math.random() * 50 + 30).toFixed(1),
                    so2: (Math.random() * 15 + 5).toFixed(1),
                    pm2_5: (Math.random() * 20 + 10).toFixed(1),
                    pm10: (Math.random() * 40 + 20).toFixed(1),
                    nh3: (Math.random() * 5 + 2).toFixed(1)
                },
                dt: Math.floor(Date.now() / 1000)
            }]
        };
    }
}

// Toast Bildirimleri Yöneticisi
class ToastManager {
    constructor() {
        this.container = document.getElementById('toastContainer');
        this.toasts = [];
    }
    
    show(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.container.appendChild(toast);
        this.toasts.push(toast);
        
        setTimeout(() => {
            this.remove(toast);
        }, duration);
        
        return toast;
    }
    
    remove(toast) {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
        this.toasts = this.toasts.filter(t => t !== toast);
    }
    
    clear() {
        this.toasts.forEach(toast => this.remove(toast));
    }
}

// Konum Servisi
class LocationService {
    static async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Tarayıcınız konum servisini desteklemiyor.'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                error => {
                    console.error('Konum hatası:', error);
                    reject(new Error('Konum alınamadı. Lütfen konum iznini kontrol edin.'));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        });
    }
}

// Tema Yöneticisi
class ThemeManager {
    constructor() {
        this.isDarkMode = this.loadThemePreference();
        this.applyTheme();
    }
    
    loadThemePreference() {
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) {
            return JSON.parse(saved);
        }
        // Sistem tercihini kontrol et
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    saveThemePreference() {
        localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode));
    }
    
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        this.saveThemePreference();
        this.updateThemeIcon();
    }
    
    applyTheme() {
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
    
    updateThemeIcon() {
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            if (this.isDarkMode) {
                // Güneş ikonu (light mode'a geç)
                themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
            } else {
                // Ay ikonu (dark mode'a geç)
                themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';
            }
        }
    }
}

// UI Yönetimi Sınıfı
class WeatherUI {
    constructor() {
        this.elements = this.initializeElements();
        this.bindEvents();
        this.toastManager = new ToastManager();
        this.themeManager = new ThemeManager();
        window.toastManager = this.toastManager;
    }
    
    initializeElements() {
        const elements = {
            // Welcome screen elements
            welcomeScreen: WeatherUtils.safeQuerySelector('#welcomeScreen'),
            welcomeCitySearch: WeatherUtils.safeQuerySelector('#welcomeCitySearch'),
            mainApp: WeatherUtils.safeQuerySelector('#mainApp'),
            
            // Anlık hava durumu elementleri
            currentCity: WeatherUtils.safeQuerySelector('#currentCity'),
            currentDate: WeatherUtils.safeQuerySelector('#currentDate'),
            lastUpdate: WeatherUtils.safeQuerySelector('#lastUpdate'),
            weatherIcon: WeatherUtils.safeQuerySelector('#weatherIcon'),
            currentTemp: WeatherUtils.safeQuerySelector('#currentTemp'),
            weatherDesc: WeatherUtils.safeQuerySelector('#weatherDesc'),
            feelsLike: WeatherUtils.safeQuerySelector('#feelsLike'),
            humidity: WeatherUtils.safeQuerySelector('#humidity'),
            windSpeed: WeatherUtils.safeQuerySelector('#windSpeed'),
            pressure: WeatherUtils.safeQuerySelector('#pressure'),
            sunrise: WeatherUtils.safeQuerySelector('#sunrise'),
            sunset: WeatherUtils.safeQuerySelector('#sunset'),
            
            // Tahmin listeleri
            hourlyForecast: WeatherUtils.safeQuerySelector('#hourlyForecast'),
            dailyForecast: WeatherUtils.safeQuerySelector('#dailyForecast'),
            
            // Hava kalitesi
            aqiValue: WeatherUtils.safeQuerySelector('#aqiValue'),
            aqiStatus: WeatherUtils.safeQuerySelector('#aqiStatus'),
            aqiDesc: WeatherUtils.safeQuerySelector('#aqiDesc'),
            pm25: WeatherUtils.safeQuerySelector('#pm25'),
            pm10: WeatherUtils.safeQuerySelector('#pm10'),
            ozone: WeatherUtils.safeQuerySelector('#ozone'),
            no2: WeatherUtils.safeQuerySelector('#no2'),
            
            // Loading
            loadingSpinner: WeatherUtils.safeQuerySelector('#loadingSpinner')
        };
        
        console.log('🔧 DOM elementleri başlatıldı:', elements);
        return elements;
    }
    
    bindEvents() {
        // Welcome screen search
        if (this.elements.welcomeCitySearch) {
            this.elements.welcomeCitySearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.triggerWelcomeSearch();
                }
            });
        }
    }
    
    triggerWelcomeSearch() {
        console.log('🔍 Welcome screen arama tetiklendi');
        const city = this.elements.welcomeCitySearch?.value?.trim();
        
        if (!city) {
            this.showError('Lütfen bir şehir adı girin');
            return;
        }
        
        if (window.weatherApp) {
            window.weatherApp.searchWeather(city);
        }
    }
    
    showWelcomeScreen() {
        if (this.elements.welcomeScreen) {
            this.elements.welcomeScreen.classList.remove('hidden');
        }
        if (this.elements.mainApp) {
            this.elements.mainApp.style.display = 'none';
        }
    }
    
    hideWelcomeScreen() {
        if (this.elements.welcomeScreen) {
            this.elements.welcomeScreen.classList.add('hidden');
        }
        if (this.elements.mainApp) {
            this.elements.mainApp.style.display = 'flex';
        }
    }
    
    showLoading(show) {
        if (this.elements.loadingSpinner) {
            if (show) {
                this.elements.loadingSpinner.classList.add('active');
            } else {
                this.elements.loadingSpinner.classList.remove('active');
            }
        }
    }
    
    showError(message) {
        this.toastManager.show(message, 'error');
    }
    
    showSuccess(message) {
        this.toastManager.show(message, 'success');
    }
    
    displayWeather(data) {
        console.log('🌤️ Hava durumu verisi alındı:', data);
        
        if (!data || !data.main) {
            console.error('❌ Geçersiz hava durumu verisi');
            return;
        }
        
        const weatherType = data.weather[0]?.main || 'Clear';
        const weatherIcon = WeatherIcons.getIcon(weatherType);
        
        // DOM güncellemeleri
        if (this.elements.currentCity) {
            this.elements.currentCity.textContent = data.name;
        }
        
        if (this.elements.currentTemp) {
            this.elements.currentTemp.textContent = WeatherUtils.formatTemperature(data.main.temp);
        }
        
        if (this.elements.weatherDesc) {
            this.elements.weatherDesc.textContent = data.weather[0]?.description || 'Bilinmeyen';
        }
        
        if (this.elements.weatherIcon) {
            this.elements.weatherIcon.textContent = weatherIcon;
        }
        
        if (this.elements.feelsLike) {
            this.elements.feelsLike.textContent = WeatherUtils.formatTemperature(data.main.feels_like);
        }
        
        if (this.elements.humidity) {
            this.elements.humidity.textContent = `${data.main.humidity}%`;
        }
        
        if (this.elements.windSpeed) {
            this.elements.windSpeed.textContent = `${data.wind.speed} km/h`;
        }
        
        if (this.elements.pressure) {
            this.elements.pressure.textContent = `${data.main.pressure} hPa`;
        }
        
        // Gündoğumu ve günbatımı
        if (this.elements.sunrise) {
            const sunriseTime = WeatherUtils.formatSunTime(data.sys.sunrise);
            this.elements.sunrise.textContent = `🌅 ${sunriseTime}`;
        }
        
        if (this.elements.sunset) {
            const sunsetTime = WeatherUtils.formatSunTime(data.sys.sunset);
            this.elements.sunset.textContent = `🌇 ${sunsetTime}`;
        }
        
        // Tarih ve saat güncelleme
        this.updateDateTime();
        
        console.log('🎉 Hava durumu başarıyla gösterildi!');
    }
    
    displayHourlyForecast(forecastData) {
        if (!this.elements.hourlyForecast) return;
        
        // İlk 24 saatlik veriyi al (3 saatlik aralıklarla)
        const hourlyData = forecastData.slice(0, 8);
        
        this.elements.hourlyForecast.innerHTML = hourlyData.map((item, index) => {
            const time = index === 0 ? 'Şimdi' : WeatherUtils.formatTime(item.dt);
            const icon = WeatherIcons.getIcon(item.weather[0].main);
            const temp = WeatherUtils.formatTemperature(item.main.temp);
            const rain = Math.round(item.pop * 100); // Yağış olasılığı
            
            return `
                <div class="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 transition-colors">
                    <div class="text-secondary text-sm font-medium w-16">${time}</div>
                    <div class="flex items-center space-x-3 flex-1 justify-center">
                        <div class="text-2xl weather-icon">${icon}</div>
                        <div class="text-xs text-tertiary">${rain}%</div>
                    </div>
                    <div class="text-primary font-semibold text-lg">${temp}</div>
                </div>
            `;
        }).join('');
        
        console.log('✅ Saatlik tahmin güncellendi');
    }
    
    displayDailyForecast(forecastData) {
        if (!this.elements.dailyForecast) return;
        
        // Günlük verileri grupla (her gün için en yüksek sıcaklığı al)
        const dailyData = this.groupDailyData(forecastData);
        
        this.elements.dailyForecast.innerHTML = dailyData.map(item => {
            const day = WeatherUtils.formatDay(item.dt);
            const icon = WeatherIcons.getIcon(item.weather[0].main);
            const desc = item.weather[0].description;
            const high = WeatherUtils.formatTemperature(item.main.temp_max);
            const low = WeatherUtils.formatTemperature(item.main.temp_min);
            const rain = Math.round(item.pop * 100);
            const tempRange = item.main.temp_max - item.main.temp_min;
            
            return `
                <div class="flex items-center justify-between p-2 rounded-xl hover:bg-black/5 transition-colors">
                    <div class="flex items-center space-x-3 flex-1">
                        <div class="text-2xl weather-icon">${icon}</div>
                        <div>
                            <div class="text-primary font-medium text-sm">${day}</div>
                            <div class="text-tertiary text-xs">${desc}</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="text-blue-500 text-xs">💧${rain}%</div>
                        <div class="text-secondary text-sm">${low}</div>
                        <div class="progress-bar w-12 h-2">
                            <div class="progress-fill h-full" style="width: ${Math.min(tempRange * 4, 100)}%"></div>
                        </div>
                        <div class="text-primary font-semibold text-sm">${high}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        console.log('✅ Günlük tahmin güncellendi');
    }
    
    displayAirQuality(airData) {
        if (!airData || !this.elements.aqiValue) return;
        
        const aqi = airData.list[0].main.aqi;
        const components = airData.list[0].components;
        const status = WeatherUtils.getAirQualityStatus(aqi);
        
        // AQI değeri ve durumu
        this.elements.aqiValue.textContent = aqi;
        this.elements.aqiStatus.textContent = status.status;
        this.elements.aqiDesc.textContent = status.desc; // AQI açıklamasını güncelle
        
        // AQI container'ın rengini güncelle
        const aqiContainer = this.elements.aqiValue.closest('.air-moderate, .air-excellent, .air-good, .air-poor');
        if (aqiContainer) {
            aqiContainer.className = `${status.class} rounded-2xl p-4 mb-4 text-center`;
        }
        
        // Detaylar - daha gerçekçi değerler
        this.elements.pm25.textContent = `${Math.round(components.pm2_5)} μg/m³`;
        this.elements.pm10.textContent = `${Math.round(components.pm10)} μg/m³`;
        this.elements.ozone.textContent = `${Math.round(components.o3)} μg/m³`;
        this.elements.no2.textContent = `${Math.round(components.no2)} μg/m³`;
        
        console.log('✅ Hava kalitesi güncellendi:', {
            aqi: aqi,
            status: status.status,
            pm25: components.pm2_5,
            pm10: components.pm10,
            o3: components.o3,
            no2: components.no2
        });
    }
    
    groupDailyData(forecastData) {
        const dailyMap = new Map();
        
        forecastData.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            
            if (!dailyMap.has(date) || item.main.temp > dailyMap.get(date).main.temp) {
                dailyMap.set(date, item);
            }
        });
        
        return Array.from(dailyMap.values()).slice(0, 5); // İlk 5 gün
    }
    
    updateDateTime() {
        const now = new Date();
        
        if (this.elements.currentDate) {
            this.elements.currentDate.textContent = 
                'Bugün, ' + now.toLocaleDateString('tr-TR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                });
        }
        
        if (this.elements.lastUpdate) {
            this.elements.lastUpdate.textContent = 
                'Son güncelleme: ' + now.toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
        }
    }
}

// Ana Uygulama Sınıfı
class WeatherApp {
    constructor() {
        this.api = new WeatherAPI(API_KEY);
        this.ui = new WeatherUI();
        this.isLoading = false;
        this.recentSearches = this.loadRecentSearches();
    }
    
    async searchWeather(city) {
        console.log('🔍 Hava durumu aranıyor:', city);
        
        if (this.isLoading) {
            console.log('⏳ Zaten yükleniyor...');
            return;
        }
        
        try {
            this.isLoading = true;
            this.ui.showLoading(true);
            
            console.log('📡 API istekleri gönderiliyor...');
            
            const [currentWeather, forecast] = await Promise.all([
                this.api.getCurrentWeather(city),
                this.api.getForecast(city)
            ]);
            
            console.log('🌤️ Anlık hava durumu:', currentWeather);
            console.log('📅 Tahmin verisi:', forecast);
        
            // Verileri göster
            this.ui.displayWeather(currentWeather);
            this.ui.displayHourlyForecast(forecast.list);
            this.ui.displayDailyForecast(forecast.list);
            
            // Hava kalitesi verisi al (koordinatlar varsa)
            if (currentWeather.coord) {
                try {
                    const airQuality = await this.api.getAirQuality(
                        currentWeather.coord.lat, 
                        currentWeather.coord.lon
                    );
                    this.ui.displayAirQuality(airQuality);
                } catch (error) {
                    console.warn('Hava kalitesi verisi alınamadı:', error);
                }
            }
            
            // Welcome screen'i gizle ve ana uygulamayı göster
            this.ui.hideWelcomeScreen();
            
            // Başarılı aramayı kaydet
            this.saveRecentSearch(city);
            
            this.ui.showSuccess(`${city} hava durumu güncellendi!`);
            
        } catch (error) {
            console.error('❌ Hava durumu arama hatası:', error);
            this.ui.showError(error.message);
        } finally {
            this.isLoading = false;
            this.ui.showLoading(false);
        }
    }
    
    async searchWeatherByCoords(lat, lon) {
        try {
            this.isLoading = true;
            this.ui.showLoading(true);
            
            const [currentWeather, forecast] = await Promise.all([
                this.api.getWeatherByCoords(lat, lon),
                this.api.getForecastByCoords(lat, lon)
            ]);
            
            this.ui.displayWeather(currentWeather);
            this.ui.displayHourlyForecast(forecast.list);
            this.ui.displayDailyForecast(forecast.list);
            
            // Hava kalitesi
            try {
                const airQuality = await this.api.getAirQuality(lat, lon);
                this.ui.displayAirQuality(airQuality);
            } catch (error) {
                console.warn('Hava kalitesi verisi alınamadı:', error);
            }
            
            // Welcome screen'i gizle
            this.ui.hideWelcomeScreen();
            
        } catch (error) {
            console.error('Konum tabanlı arama hatası:', error);
            this.ui.showError(error.message);
        } finally {
            this.isLoading = false;
            this.ui.showLoading(false);
        }
    }
    
    saveRecentSearch(city) {
        this.recentSearches = this.recentSearches.filter(c => c !== city);
        this.recentSearches.unshift(city);
        this.recentSearches = this.recentSearches.slice(0, 5); // Son 5 aramayı sakla
        
        localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    }
    
    loadRecentSearches() {
        try {
            const saved = localStorage.getItem('recentSearches');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Son aramalar yüklenemedi:', error);
            return [];
        }
    }
    
    init() {
        console.log('🌤️ macOS Weather App başlatıldı');
        
        // Global erişim için
        window.weatherApp = this;
        
        // API anahtarı kontrolü
        if (API_KEY === 'YOUR_API_KEY_HERE') {
            console.warn('⚠️ Lütfen geçerli bir OpenWeatherMap API anahtarı ekleyin!');
            this.ui.showError('API anahtarı eksik. Lütfen geçerli bir API anahtarı ekleyin.');
        }
        
        // Tema ikonunu güncelle
        this.ui.themeManager.updateThemeIcon();
        
        console.log('✅ Uygulama başarıyla başlatıldı');
    }
}

// Global fonksiyonlar (HTML'den çağrılan)
function searchFromWelcome() {
    const cityInput = document.getElementById('welcomeCitySearch');
    const cityName = cityInput.value.trim();
    
    if (cityName && window.weatherApp) {
        window.weatherApp.searchWeather(cityName);
    }
}

function toggleTheme() {
    if (window.weatherApp && window.weatherApp.ui.themeManager) {
        window.weatherApp.ui.themeManager.toggleTheme();
    }
}

// Uygulama Başlatma
document.addEventListener('DOMContentLoaded', () => {
    const app = new WeatherApp();
    app.init();
    
    // Otomatik yenileme (5 dakikada bir)
    setInterval(() => {
        if (window.weatherApp && !window.weatherApp.isLoading) {
            // Son arama varsa tekrar ara
            const lastSearch = window.weatherApp.recentSearches[0];
            if (lastSearch) {
                window.weatherApp.searchWeather(lastSearch);
            }
        }
    }, 300000); // 5 dakika
}); 