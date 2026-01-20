# RezzoniX Analyzer - Profesyonel Android APK Uygulaması

## 🎯 Genel Bakış

RezzoniX Analyzer, Yakup Öner'in analiz yaklaşımını temel alan, futuristik arayüzlü bir bio-analiz mobil uygulamasıdır. Uygulama, BLE (Bluetooth Low Energy) ve USB sensörler aracılığıyla 12 farklı organ sistemini analiz eder ve kullanıcılara detaylı raporlar sunar.

## ✨ Temel Özellikler

### 📱 Mobil Uygulama
- **Futuristik Arayüz**: Dark theme, neon efektler ve modern tasarım
- **528 Hz Rezonans Frekansı**: Universal Core Resonance göstergesi
- **12 Organ Sistemi Analizi**: Beyin, Kalp, Akciğer, Karaciğer, Böbrek, Mide, Pankreas, Bağırsak, Tiroid, Omurga, Bağışıklık, Dolaşım
- **Çoklu Sensör Desteği**:
  - BLE (Bluetooth Low Energy) cihaz tarama ve bağlantı
  - USB OTG sensör desteği
- **Çoklu Dil**: Türkçe ve İngilizce
- **PDF Rapor**: Detaylı analiz raporlarını PDF olarak dışa aktarma
- **Analiz Geçmişi**: Tüm analizlerin kaydı ve görüntülenmesi
- **Offline Çalışma**: AsyncStorage ile local veri depolama

### 🔬 Analiz Özellikleri
- **Skor Sistemi**: 0-100 arası organ skorları
- **Stres Seviyeleri**: 0-10 arası stres göstergeleri
- **Durum Sınıflandırması**:
  - Dengeli (≥80 puan)
  - Takip (70-79 puan)
  - Yüksek Takip (<70 puan)
- **Otomatik Notlar**: Her organ için öneriler

### 🎨 Tasarım ve UX
- **Renk Paleti**:
  - Primary: #00D9FF (Cyan)
  - Secondary: #8B5CF6 (Purple)
  - Background: #0A0E1A (Dark Blue-Black)
  - Success: #10B981 (Green)
- **Animasyonlar**: Pulse efektleri, gradient geçişler
- **Responsive**: Tüm ekran boyutlarına uyumlu

## 🛠️ Teknoloji Stack

### Frontend (Mobile)
- **Framework**: Expo SDK 54 + React Native
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Internationalization**: i18next + react-i18next
- **UI Components**: 
  - expo-linear-gradient
  - react-native-svg
  - @expo/vector-icons
- **Sensors**: react-native-ble-plx
- **PDF Export**: expo-print + expo-sharing
- **Storage**: @react-native-async-storage/async-storage
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB + Motor (async)
- **Validation**: Pydantic
- **CORS**: Starlette middleware

## 📂 Proje Yapısı

```
/app
├── backend/
│   ├── server.py           # FastAPI uygulaması
│   ├── requirements.txt    # Python bağımlılıkları
│   └── .env               # Environment değişkenleri
│
├── frontend/
│   ├── app/               # Expo Router ekranları
│   │   ├── index.tsx      # Ana ekran (528 Hz display)
│   │   ├── patient.tsx    # Danışan bilgisi
│   │   ├── organs.tsx     # Organ seçimi
│   │   ├── sensor.tsx     # Sensör bağlantısı
│   │   ├── scan.tsx       # Analiz tarama
│   │   ├── results.tsx    # Sonuçlar
│   │   ├── history.tsx    # Geçmiş analizler
│   │   ├── settings.tsx   # Ayarlar
│   │   ├── about.tsx      # Hakkında
│   │   └── _layout.tsx    # Root layout
│   │
│   ├── components/        # Reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ResonanceVisualizer.tsx
│   │
│   ├── locales/          # Dil dosyaları
│   │   ├── tr.json
│   │   ├── en.json
│   │   └── i18n.ts
│   │
│   ├── store/            # Zustand store
│   │   └── useAppStore.ts
│   │
│   ├── utils/            # Utilities
│   │   ├── api.ts
│   │   └── constants.ts
│   │
│   ├── app.json          # Expo configuration
│   └── package.json
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+
- Python 3.9+
- MongoDB
- Expo CLI

### Backend Kurulumu

```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend Kurulumu

```bash
cd frontend
yarn install
yarn start
```

### Mobilde Test

1. **Expo Go ile** (Development):
   ```bash
   yarn start
   ```
   QR kodu Expo Go uygulaması ile tarayın

2. **Web Preview**:
   ```bash
   yarn web
   ```
   http://localhost:3000 adresinde açılır

## 📱 Android APK Oluşturma

### EAS Build ile (Önerilen)

1. **EAS CLI Kurulumu**:
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Build Yapılandırması**:
   ```bash
   cd frontend
   eas build:configure
   ```

3. **APK Build**:
   ```bash
   # Production build
   eas build --platform android --profile production
   
   # Development build
   eas build --platform android --profile preview
   ```

4. **APK İndirme**:
   Build tamamlandığında, EAS dashboard'dan APK'yı indirin

### Local Build (Alternatif)

```bash
cd frontend
expo build:android -t apk
```

## 🔌 API Endpoints

### Health Check
```http
GET /api/
```

### Analiz Oluşturma
```http
POST /api/analysis
Content-Type: application/json

{
  "patient_name": "Ahmet Yılmaz",
  "patient_age": 35,
  "selected_organs": ["Kalp", "Karaciğer", "Böbrek"],
  "sensor_type": "BLE",
  "sensor_name": "RezzoniX Bio-Sensor X1"
}
```

### Analizleri Listele
```http
GET /api/analysis?limit=50
```

### Tek Analiz Getir
```http
GET /api/analysis/{analysis_id}
```

## 🎯 Kullanım Akışı

1. **Disclaimer Ekranı**: Kullanım şartlarını kabul et
2. **Ana Ekran**: 528 Hz rezonans göstergesi ve sistem durumu
3. **Danışan Bilgisi**: Ad, soyad ve yaş girişi
4. **Organ Seçimi**: 12 organdan istediğinizi seçin
5. **Sensör Seçimi**: BLE veya USB sensör bağlantısı
6. **Tarama**: Animasyonlu analiz süreci
7. **Sonuçlar**: Detaylı skorlar, grafikler ve öneriler
8. **PDF Export**: Raporu paylaş veya kaydet

## 🔒 Güvenlik ve İzinler

### Android İzinleri (app.json)
- `BLUETOOTH` - BLE sensör bağlantısı
- `BLUETOOTH_ADMIN` - BLE yönetimi
- `BLUETOOTH_CONNECT` - BLE cihaz bağlantısı
- `BLUETOOTH_SCAN` - BLE cihaz tarama
- `ACCESS_FINE_LOCATION` - BLE için gerekli
- `ACCESS_COARSE_LOCATION` - BLE için gerekli

### iOS İzinleri
- `NSBluetoothAlwaysUsageDescription`: "Scan and connect to BLE sensors for analysis"
- `NSBluetoothPeripheralUsageDescription`: "Connect to BLE sensors for health analysis"

## 📊 Veri Modeli

### Analysis Schema
```typescript
interface Analysis {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_age?: number;
  selected_organs: string[];
  overall_score: number;        // 0-100
  band: string;                 // "Dengeli" | "Takip" | "Yüksek takip"
  results: OrganResult[];
  sensor_type: string;          // "BLE" | "USB"
  sensor_name?: string;
  frequency: number;            // 528 Hz
  created_at: string;
}

interface OrganResult {
  organ: string;
  score: number;                // 0-100
  stress: number;               // 0-10
  note: string;
}
```

## 🧪 Test

### Backend Test
```bash
# API test
curl http://localhost:8001/api/

# Analiz oluşturma testi
curl -X POST http://localhost:8001/api/analysis \
  -H "Content-Type: application/json" \
  -d '{"patient_name":"Test","patient_age":30,"selected_organs":["Kalp"],"sensor_type":"BLE"}'
```

### Frontend Test
- Manuel test: Expo Go ile QR kod tarayın
- Web preview: http://localhost:3000

## 📝 Yasal Uyarı

Bu yazılım **yalnızca destekleyici analiz amaçlıdır**. Tanı, tedavi veya tıbbi müdahale amacıyla kullanılmaz. Uygulama çıktıları klinik değerlendirme yerine geçmez. Sağlıkla ilgili kararlar yetkili sağlık profesyonellerinin değerlendirmesine dayanmalıdır.

## 👥 Geliştirici

- **Firma**: RezzoniX
- **Yaklaşım/Metodoloji**: Yakup Öner
- **Versiyon**: 1.0.0
- **Build**: 2025.01

## 📄 Lisans

© 2025 RezzoniX. Tüm hakları saklıdır.

## 🆘 Destek

Herhangi bir sorun için:
1. Expo logs kontrol edin: `expo start`
2. Backend logs: `/var/log/supervisor/backend.err.log`
3. MongoDB bağlantısı kontrol edin
4. API endpoint'leri test edin

## 🎉 Özellikler

- ✅ Futuristik dark theme arayüz
- ✅ 528 Hz rezonans göstergesi
- ✅ 12 organ sistemi analizi
- ✅ BLE ve USB sensör desteği
- ✅ Çoklu dil (TR/EN)
- ✅ PDF rapor çıktısı
- ✅ Analiz geçmişi
- ✅ MongoDB entegrasyonu
- ✅ Responsive tasarım
- ✅ Offline çalışma
- ✅ Cross-platform (iOS/Android)
