# 🌤️ WeatherApp - Modern Hava Durumu Uygulaması

Modern, responsive ve kullanıcı dostu hava durumu uygulaması. macOS tarzı tasarım ile geliştirilmiştir.

## ✨ Özellikler

- 🌍 **Gerçek zamanlı hava durumu** - OpenWeatherMap API
- 📍 **GPS konum alma** - Otomatik şehir tespiti
- 🌙 **Dark/Light mode** - Tema değiştirici
- 🌬️ **Hava kalitesi** - Detaylı AQI bilgileri
- 📱 **Responsive tasarım** - Mobil uyumlu
- ⚡ **Hızlı arama** - Şehir adı ile arama
- 🔄 **Otomatik yenileme** - 5 dakikada bir güncelleme

## 🚀 Kurulum

### 1. Projeyi klonlayın
```bash
git clone <repository-url>
cd WeatherApp
```

### 2. API Anahtarı alın
1. [OpenWeatherMap](https://openweathermap.org/api) sitesine gidin
2. Ücretsiz hesap oluşturun
3. API anahtarınızı alın

### 3. Konfigürasyon

#### Geliştirme Ortamı (Önerilen):
`.env` dosyasını oluşturun:
```env
OPENWEATHER_API_KEY=your-api-key-here
OPENWEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5
# ... diğer ayarlar
```

#### Basit Kullanım:
`config.js` dosyasını düzenleyin:
```javascript
const CONFIG = {
    API_KEY: 'YOUR_API_KEY_HERE',
    // ... diğer ayarlar
};
```

### 4. Çalıştırın

#### Geliştirme Ortamı:
```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Tarayıcıda http://localhost:3000 açın
```

#### Basit Kullanım:
```bash
# Basit HTTP sunucusu ile
python -m http.server 8000

# veya Node.js ile
npx serve .

# veya doğrudan index.html'i açın
```

## 🔒 Güvenlik

### Önemli Notlar:
- ⚠️ **API anahtarınızı asla paylaşmayın**
- 🔒 **config.js dosyasını git'e commit etmeyin**
- 🌐 **Production'da environment variables kullanın**

### .env Dosyası (Önerilen):
```env
OPENWEATHER_API_KEY=your_api_key_here
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
```

## 📁 Proje Yapısı

```
WeatherApp/
├── 📄 index.html          # Ana HTML dosyası
├── 📄 style.css           # CSS stilleri
├── 📄 script.js           # JavaScript kodu
├── 📄 config.js           # Konfigürasyon (git'e eklemeyin!)
├── 📄 .gitignore          # Git ignore dosyası
└── 📄 README.md           # Bu dosya
```

## 🛠️ Teknolojiler

- **HTML5** - Semantik yapı
- **CSS3** - Modern stiller ve animasyonlar
- **JavaScript ES6+** - Modüler yapı
- **OpenWeatherMap API** - Hava durumu verileri
- **Tailwind CSS** - Utility-first CSS framework

## 🔧 Konfigürasyon Seçenekleri

### Feature Flags:
```javascript
ENABLE_LOCATION: true,        // GPS konum alma
ENABLE_DARK_MODE: true,       // Dark/Light mode
ENABLE_AIR_QUALITY: true,     // Hava kalitesi
ENABLE_AUTO_REFRESH: true,    // Otomatik yenileme
```

### API Ayarları:
```javascript
API_TIMEOUT: 10000,           // API timeout (ms)
API_RETRY_ATTEMPTS: 3,        // Yeniden deneme sayısı
AUTO_REFRESH_INTERVAL: 5,     // Otomatik yenileme (dakika)
```

## 🐛 Sorun Giderme

### API Anahtarı Hatası:
- API anahtarınızın doğru olduğundan emin olun
- OpenWeatherMap hesabınızın aktif olduğunu kontrol edin

### Konum Hatası:
- Tarayıcı izinlerini kontrol edin
- HTTPS kullanın (konum servisleri için gerekli)

### Stil Sorunları:
- Tailwind CSS CDN'inin yüklendiğinden emin olun
- style.css dosyasının mevcut olduğunu kontrol edin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Sorularınız için issue açabilirsiniz.

---

**Not:** Bu proje eğitim amaçlı geliştirilmiştir. Production kullanımı için ek güvenlik önlemleri alınmalıdır. 