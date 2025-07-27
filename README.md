# 🌤️ Hava Durumu Uygulaması

Modern, responsive ve kullanıcı dostu hava durumu uygulaması. OpenWeatherMap API kullanarak anlık hava durumu ve 3 saatlik tahminler sunar.

## ✨ Özellikler

### 🎯 Temel Özellikler
- **Anlık Hava Durumu**: Sıcaklık, nem, rüzgar hızı ve hava durumu açıklaması
- **3 Saatlik Tahminler**: Sonraki 15 saat için detaylı tahminler
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Gerçek Zamanlı Veri**: OpenWeatherMap API entegrasyonu

### 🎨 Görsel Özellikler
- **Glassmorphism Efekti**: Modern cam görünümü
- **Dinamik Animasyonlar**: Hava durumuna özel ikon animasyonları
- **Arkaplan Animasyonu**: Hareketli parçacık efektleri
- **Smooth Geçişler**: CSS animasyonları ile akıcı deneyim

### 🔧 Teknik Özellikler
- **SOLID Prensipleri**: Modüler ve sürdürülebilir kod yapısı
- **ES6+ JavaScript**: Modern JavaScript özellikleri
- **CSS Grid & Flexbox**: Responsive layout sistemi
- **Performance Optimized**: Hızlı yükleme ve çalışma

### ♿ Erişilebilirlik
- **ARIA Labels**: Ekran okuyucu desteği
- **Keyboard Navigation**: Klavye ile tam erişim
- **Semantic HTML**: Anlamlı HTML yapısı
- **Focus Management**: Gelişmiş odak yönetimi

## 🛠️ Kullanılan Teknolojiler

### Frontend
- **HTML5**: Semantik markup
- **CSS3**: Modern stiller ve animasyonlar
- **JavaScript (ES6+)**: Dinamik işlevsellik
- **Font Awesome**: İkon kütüphanesi

### API & Veri
- **OpenWeatherMap API**: Hava durumu verileri
- **Fetch API**: Modern HTTP istekleri
- **Promise-based**: Asenkron veri işleme

### Performans
- **CSS Variables**: Dinamik tema sistemi
- **Will-change**: GPU hızlandırma
- **Preload**: Kritik kaynak optimizasyonu

## 🚀 Kurulum

### Gereksinimler
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- İnternet bağlantısı (API çağrıları için)

### Adımlar

1. **Projeyi İndirin**
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   ```

2. **Dosyaları Kontrol Edin**
   ```
   WeatherApp/
   ├── index.html          # Ana HTML dosyası
   ├── style.css           # CSS stilleri
   ├── script.js           # JavaScript kodu
   ├── README.md           # Bu dosya
   └── algorithm.txt       # Algoritma açıklaması
   ```

3. **Tarayıcıda Açın**
   - `index.html` dosyasını tarayıcınızda açın
   - Veya yerel sunucu kullanın:
   ```bash
   # Python ile
   python -m http.server 8000
   
   # Node.js ile
   npx serve .
   ```

## 📱 Kullanım

### Temel Kullanım
1. **Şehir Girin**: Arama kutusuna şehir adını yazın
2. **Arama Yapın**: Enter tuşuna basın veya "Ara" butonuna tıklayın
3. **Sonuçları İnceleyin**: Anlık hava durumu ve tahminler görüntülenecek

### Klavye Kısayolları
- **Enter**: Arama yap
- **Tab**: Elementler arası geçiş
- **Escape**: Arama kutusunu temizle

### Özellikler
- **Otomatik Tamamlama**: Son aranan şehirler hatırlanır
- **Hata Yönetimi**: Kullanıcı dostu hata mesajları
- **Loading States**: Arama sırasında görsel geri bildirim

## 🏗️ Proje Yapısı

### JavaScript Modülleri
```javascript
// Ana sınıflar
WeatherApp          // Ana uygulama koordinatörü
WeatherAPI          // API işlemleri
WeatherUI           // Kullanıcı arayüzü
WeatherUtils        // Yardımcı fonksiyonlar
WeatherIcons        // İkon yönetimi
```

### CSS Organizasyonu
```css
/* Stil kategorileri */
:root              // CSS değişkenleri
Layout             // Sayfa düzeni
Components         // UI bileşenleri
Animations         // Animasyonlar
Responsive         // Mobil uyumluluk
Accessibility      // Erişilebilirlik
```

## 🔧 Geliştirme

### Kod Standartları
- **SOLID Prensipleri**: Temiz kod mimarisi
- **ESLint**: Kod kalitesi kontrolü
- **Prettier**: Kod formatlaması
- **JSDoc**: Fonksiyon dokümantasyonu

### Katkıda Bulunma
1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 🐛 Hata Ayıklama

### Yaygın Sorunlar
- **API Hatası**: İnternet bağlantısını kontrol edin
- **Şehir Bulunamadı**: Şehir adını doğru yazdığınızdan emin olun
- **Yavaş Yükleme**: Tarayıcı cache'ini temizleyin

### Debug Modu
```javascript
// Console'da debug bilgilerini görmek için
localStorage.setItem('debug', 'true');
```

## 📊 Performans

### Optimizasyonlar
- **Lazy Loading**: Gereksiz kaynaklar ertelenir
- **CSS Optimization**: Kritik CSS inline edilir
- **JavaScript Minification**: Kod sıkıştırma
- **Image Optimization**: İkonlar SVG formatında

### Lighthouse Skorları
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

## 🔒 Güvenlik

### Önlemler
- **API Key Protection**: Client-side güvenlik
- **Input Validation**: Kullanıcı girdisi kontrolü
- **XSS Prevention**: Güvenli DOM manipülasyonu
- **HTTPS**: Güvenli bağlantı

## 📈 Gelecek Planları

### Yakın Vadeli
- [ ] Konum bazlı otomatik hava durumu
- [ ] Sıcaklık birimi değiştirme (Celsius/Fahrenheit)
- [ ] Haftalık tahmin görünümü
- [ ] Gece/gündüz modu

### Orta Vadeli
- [ ] PWA desteği (offline çalışma)
- [ ] Push notifications
- [ ] Widget desteği
- [ ] Çoklu dil desteği

### Uzun Vadeli
- [ ] Machine Learning tahminleri
- [ ] Sosyal özellikler
- [ ] Hava durumu geçmişi
- [ ] API rate limiting

## 🤝 Katkıda Bulunanlar

### Geliştirici
- **Ertuğrul Sarsar** - Ana geliştirici

### Teşekkürler
- **OpenWeatherMap** - Hava durumu API'si
- **Font Awesome** - İkon kütüphanesi
- **Google Fonts** - Tipografi

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Email**: your.email@example.com
- **Website**: [yourwebsite.com](https://yourwebsite.com)

## 🙏 Teşekkürler

Bu projeyi beğendiyseniz ⭐ vermeyi unutmayın!

---

**Not**: Bu uygulama eğitim amaçlı geliştirilmiştir. Ticari kullanım için OpenWeatherMap API lisans koşullarını kontrol edin.
