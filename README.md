# Trendyol Login Test Otomasyonu

Bu proje, Trendyol giriş sayfasını ve isteğe bağlı olarak gerçek bir **test hesabıyla** giriş akışını [Playwright](https://playwright.dev/) kullanarak kontrol eder.

## Gereksinimler

- Node.js 20 veya üzeri
- Size ait, otomasyon için ayrılmış bir Trendyol test hesabı

## Kurulum

```bash
npm install
npx playwright install chromium
```

## Testleri çalıştırma

Kimlik bilgisi vermeden çalıştırıldığında giriş formu testi koşar; gerçek giriş testi güvenli biçimde atlanır:

```bash
npm test
```

Gerçek giriş akışını da çalıştırmak için bilgileri kaynak koda veya Git'e eklemeden ortam değişkeni olarak verin:

```bash
TRENDYOL_EMAIL='test@example.com' \
TRENDYOL_PASSWORD='sifreniz' \
npm test
```

Alternatif olarak örnek dosyayı kopyalayıp yalnızca yerel `.env` dosyasını düzenleyebilirsiniz:

```bash
cp .env.example .env
npm test
```

`.env` Git tarafından yok sayılır ve Playwright yapılandırması tarafından otomatik yüklenir.

Tarayıcıyı görerek çalıştırmak için `npm run test:headed`, interaktif Playwright arayüzü için `npm run test:ui` kullanılabilir. Son HTML raporu `npm run test:report` ile açılır.

## Test kapsamı

- `/giris` sayfasının ve e-posta/şifre alanlarının görünürlüğü
- Alanların kullanıcı girişine açık olması
- Ortam değişkenleri sağlandığında başarılı giriş sonrası giriş sayfasından ayrılma
- Başarılı girişten sonra **Hesabım** alanının görünmesi

> Trendyol CAPTCHA veya ek doğrulama gösterebilir. Otomasyon bu güvenlik kontrollerini aşmaya çalışmaz. Böyle bir durumda testi headed/UI modunda, Trendyol kullanım koşullarına uygun biçimde çalıştırın. Çok sayıda deneme veya kişisel ana hesabın kullanılması önerilmez.

## Proje yapısı

```text
tests/
├── login.spec.ts
└── pages/
    └── login.page.ts
```

Seçiciler ve giriş işlemleri Page Object içinde tutulur; senaryolar test dosyasında okunabilir kalır. CI ortamında hata oluştuğunda ekran görüntüsü, video ve trace `test-results/` dizinine kaydedilir.

## Nasıl çalışır?

```text
npm test
   │
   ├─ playwright.config.ts  → .env değerlerini ve Chromium ayarlarını yükler
   │
   └─ tests/login.spec.ts
        │
        ├─ LoginPage.goto()         → https://www.trendyol.com/giris
        ├─ expectLoaded()           → form alanlarını kontrol eder
        └─ login(email, password)   → alanları doldurup butona tıklar
                                      ↓
                              URL /giris'ten ayrıldı mı?
                              "Hesabım" görünüyor mu?
```

İlk senaryo her çalıştırmada giriş formunun açıldığını kontrol eder. İkinci senaryo `TRENDYOL_EMAIL` ve `TRENDYOL_PASSWORD` yoksa **skipped** görünür; iki değer de varsa gerçek giriş adımlarını çalıştırır. Örneğin beklenen konsol özeti şöyledir:

```text
✓ giriş formunu gösterir
- geçerli test hesabıyla giriş yapar (kimlik bilgileri yoksa skipped)
```

Başarısız bir çalıştırmayı incelemek için:

```bash
npx playwright show-trace test-results/<test-klasoru>/trace.zip
npm run test:report
```
