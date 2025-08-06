const express = require('express');
const path = require('path');
const fs = require('fs');

// .env dosyasını manuel olarak oku
const envPath = path.join(__dirname, '.env');
let envVars = {
    // Fallback değerler
    OPENWEATHER_API_KEY: null, // API anahtarı sadece .env'den gelir
    OPENWEATHER_API_BASE_URL: 'https://api.openweathermap.org/data/2.5',
    APP_NAME: 'WeatherApp',
    APP_VERSION: '1.0.0',
    ENABLE_LOCATION: 'true',
    ENABLE_DARK_MODE: 'true',
    ENABLE_AIR_QUALITY: 'true',
    ENABLE_AUTO_REFRESH: 'true',
    AUTO_REFRESH_INTERVAL: '5',
    API_TIMEOUT: '10000',
    API_RETRY_ATTEMPTS: '3',
    LOCATION_TIMEOUT: '10000',
    LOCATION_HIGH_ACCURACY: 'true',
    LOCATION_MAX_AGE: '300000',
    DEFAULT_THEME: 'light',
    WELCOME_SCREEN_ENABLED: 'true',
    TOAST_DURATION: '5000',
    SANITIZE_INPUT: 'true',
    VALIDATE_CITY_NAMES: 'true',
    MAX_CITY_NAME_LENGTH: '50',
    NODE_ENV: 'development'
};

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value && !key.startsWith('#')) {
            // Tüm BOM ve gizli karakterleri temizle
            const cleanKey = key.trim().replace(/[\uFEFF\u200B\u200C\u200D\u2060]/g, '');
            envVars[cleanKey] = value.trim();
            console.log(`🔧 ${cleanKey} = ${value.trim()}`);
        }
    });
    console.log('✅ .env dosyası yüklendi');
} else {
    console.log('⚠️ .env dosyası bulunamadı, fallback değerler kullanılıyor');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Static dosyaları serve et
app.use(express.static('.'));

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// .env değerlerini client'a gönder (API anahtarı hariç)
app.get('/api/config', (req, res) => {
    res.json({
        // API anahtarı client'a gönderilmiyor!
        API_BASE_URL: '/api/weather', // Proxy endpoint kullan
        APP_NAME: envVars.APP_NAME || process.env.APP_NAME,
        APP_VERSION: envVars.APP_VERSION || process.env.APP_VERSION,
        ENABLE_LOCATION: (envVars.ENABLE_LOCATION || process.env.ENABLE_LOCATION) === 'true',
        ENABLE_DARK_MODE: (envVars.ENABLE_DARK_MODE || process.env.ENABLE_DARK_MODE) === 'true',
        ENABLE_AIR_QUALITY: (envVars.ENABLE_AIR_QUALITY || process.env.ENABLE_AIR_QUALITY) === 'true',
        ENABLE_AUTO_REFRESH: (envVars.ENABLE_AUTO_REFRESH || process.env.ENABLE_AUTO_REFRESH) === 'true',
        AUTO_REFRESH_INTERVAL: parseInt(envVars.AUTO_REFRESH_INTERVAL || process.env.AUTO_REFRESH_INTERVAL) || 5,
        API_TIMEOUT: parseInt(envVars.API_TIMEOUT || process.env.API_TIMEOUT) || 10000,
        API_RETRY_ATTEMPTS: parseInt(envVars.API_RETRY_ATTEMPTS || process.env.API_RETRY_ATTEMPTS) || 3,
        LOCATION_TIMEOUT: parseInt(envVars.LOCATION_TIMEOUT || process.env.LOCATION_TIMEOUT) || 10000,
        LOCATION_HIGH_ACCURACY: (envVars.LOCATION_HIGH_ACCURACY || process.env.LOCATION_HIGH_ACCURACY) === 'true',
        LOCATION_MAX_AGE: parseInt(envVars.LOCATION_MAX_AGE || process.env.LOCATION_MAX_AGE) || 300000,
        DEFAULT_THEME: envVars.DEFAULT_THEME || process.env.DEFAULT_THEME || 'light',
        WELCOME_SCREEN_ENABLED: (envVars.WELCOME_SCREEN_ENABLED || process.env.WELCOME_SCREEN_ENABLED) === 'true',
        TOAST_DURATION: parseInt(envVars.TOAST_DURATION || process.env.TOAST_DURATION) || 5000,
        SANITIZE_INPUT: (envVars.SANITIZE_INPUT || process.env.SANITIZE_INPUT) === 'true',
        VALIDATE_CITY_NAMES: (envVars.VALIDATE_CITY_NAMES || process.env.VALIDATE_CITY_NAMES) === 'true',
        MAX_CITY_NAME_LENGTH: parseInt(envVars.MAX_CITY_NAME_LENGTH || process.env.MAX_CITY_NAME_LENGTH) || 50
    });
});

// Weather API proxy endpoint
app.get('/api/weather/:endpoint', async (req, res) => {
    try {
        const { endpoint } = req.params;
        const { q, lat, lon, units = 'metric', lang = 'tr' } = req.query;
        
        const apiKey = envVars.OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API anahtarı bulunamadı' });
        }
        
        const baseUrl = 'https://api.openweathermap.org/data/2.5';
        const url = new URL(`${baseUrl}/${endpoint}`);
        url.searchParams.append('appid', apiKey);
        url.searchParams.append('units', units);
        url.searchParams.append('lang', lang);
        
        if (q) url.searchParams.append('q', q);
        if (lat) url.searchParams.append('lat', lat);
        if (lon) url.searchParams.append('lon', lon);
        
        const response = await fetch(url.toString());
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        console.error('Weather API proxy hatası:', error);
        res.status(500).json({ error: 'Hava durumu verisi alınamadı' });
    }
});

// Air Quality API proxy endpoint
app.get('/api/air-quality', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Koordinatlar gerekli' });
        }
        
        const apiKey = envVars.OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API anahtarı bulunamadı' });
        }
        
        const url = new URL('https://api.openweathermap.org/data/2.5/air_pollution');
        url.searchParams.append('appid', apiKey);
        url.searchParams.append('lat', lat);
        url.searchParams.append('lon', lon);
        
        const response = await fetch(url.toString());
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        console.error('Air Quality API proxy hatası:', error);
        res.status(500).json({ error: 'Hava kalitesi verisi alınamadı' });
    }
});

app.listen(PORT, () => {
    console.log(`🌤️ Weather App server çalışıyor: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${envVars.NODE_ENV || process.env.NODE_ENV || 'development'}`);
    console.log(`🔑 API Key: ${envVars.OPENWEATHER_API_KEY ? '✅ Yüklendi' : '❌ Bulunamadı'}`);
}); 