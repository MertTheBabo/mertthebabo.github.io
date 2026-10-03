# İyileştirme Planı

Kaynak: 3 Ekim 2026 tarihli site incelemesi (Lighthouse, axe, kontrast ölçümü, 6 viewport ekran görüntüsü).
Kurallar için `CLAUDE.md`. Her maddeyi bitirince `[x]` yap. Etiketler: **[O]** objektif teknik sorun, **[Z]** zevk/strateji (Mert'e danış).

---

## Mert'ten gereken bilgiler (Phase 2 başlamadan sor)
- [x] Hedef pozisyon: CV başlığıyla aynı — "Bilgisayar Programcısı | IT Destek · Sistem & Ağ · Yazılım"
- [x] Şehir: Kocaeli (LinkedIn: iş yerinde · hibrit)
- [ ] Gösterilecek 3 gerçek proje: ad, 1-2 cümle problem/çözüm, teknolojiler, GitHub/canlı link, varsa ekran görüntüsü — şimdilik yalnızca bu site (CV ve GitHub'daki tek proje)
- [x] CV PDF dosyası (`cv/mert-erdem-elmaci-cv.pdf`) — Ekim 2026 sürümü; Mert olduğu gibi yayınlanmasını onayladı
- [x] E-posta sayfada görünür yazılsın mı? Telefon eklensin mi? — e-posta görünür; telefon sayfaya eklenmeyecek (Mert'in kararı)
- [x] Profesyonel fotoğraf kullanılacak mı? — şimdilik hayır; 2.6'da "bir bakışta" listesi seçildi
- [ ] FormSubmit aktivasyon e-postasındaki rastgele alias (Phase 1.7 için)

---

## Phase 1 — Kritik sorunlar
1.1–1.5 `66f372e` commit'inde uygulandı; 3 Ekim 2026'da doğrulandı (axe 0 ihlal: koyu/açık × 1440/390, Lighthouse a11y 100).
- [x] 1.1 [O] `.button{border:0;cursor:pointer}` — "Mesaj gönder" butonundaki tarayıcı varsayılan kenarlığı yok
- [x] 1.2 [O] Form kenarlığı `var(--field-border)`, odak `var(--accent)`, durum mesajları `var(--danger)`/`var(--success)` — iki temada ≥3:1 / ≥4.5:1
- [x] 1.3 [O] `.ticker` → `aria-hidden="true"`; `.animated-intro` → `<p>` + `.visually-hidden` metin; header "İletişim ↗" → "İletişim"; link içi oklar `aria-hidden`
- [x] 1.4 [O] Tema `<head>` içindeki inline script ile ilk boyamadan önce uygulanıyor (açık tema flaşı yok); `script.js` yalnızca senkronize ediyor
- [x] 1.5 [O] Font `@import` kaldırıldı → `preconnect` + `<link>`; canonical, OG, Twitter card, JSON-LD Person, apple-touch-icon, robots.txt, sitemap.xml, og-image.png
- [x] 1.6 [O] Tüm `target="_blank"` linklere "(yeni sekmede açılır)" görünmez metni (hero, özgeçmiş kimlik kartı, GitHub şeridi, iletişim, FormSubmit linki)
- [ ] 1.7 [O] FormSubmit `action` ve `fetch` URL'lerinde e-posta yerine alias (Mert alias'ı verince)
- **Kabul:** axe 0 ihlal (koyu/açık × 1440/390), Lighthouse a11y 100, LinkedIn Post Inspector'da önizleme görseli çıkıyor.

## Phase 2 — İçerik ve UI/UX (en yüksek etki)
- [x] 2.1 [Z] Hero: eyebrow "İŞ & STAJ FIRSATLARINA AÇIK · [ŞEHİR]"; h1 altına tek cümlelik `.hero-role` (hedef pozisyon); birincil CTA "Özgeçmişi indir (PDF)", ikincil "İletişime geç", sonra GitHub/LinkedIn
- [x] 2.2 [O] Yeni `#projeler` bölümü (Hakkımda'dan sonra), mevcut `.card` bileşeniyle; kart yapısı: etiket → başlık → problem/ne yaptım → teknoloji listesi (`<ul class="focus-tags">`) → Kaynak kod / Canlı linkleri. Görsel varsa WebP, `width`/`height`, `loading="lazy"`, anlamlı `alt`
- [x] 2.3 [O] Tekrarları kaldır: "03 / Yol Haritam" bölümünü sil (benzersiz bilgiyi Hakkımda'ya 1 satır olarak taşı); özgeçmişteki "PROFİL" ve "AKADEMİK & KARİYER HEDEFİ" maddelerini sil. DGS hedefi sayfada en fazla 1 kez geçsin
- [x] 2.4 [O] Yeni sıra ve nav: Hakkımda · Projeler · Deneyim · İletişim; bölüm numaralarını (01–04) ve `id`'leri güncelle; `section[id]` gözlemcisi yeni id'lerle çalışsın
- [x] 2.5 [O] Yetenekleri grupla (Diller / Altyapı & Bulut / Araçlar); HTML, CSS, JavaScript, Git & GitHub, Microsoft Azure (temel) ekle; "Bilgi teknolojisi", "Yazılım geliştirme", "Yapay zekâ" gibi alan adlarını kaldır
- [x] 2.6 [Z] Sağdaki yörünge kartı: monogram yerine `<dl class="glance">` (Durum / Odak / Son deneyim / Eğitim) ya da fotoğraf; yörünge arka planı ve animasyon kalsın
- [x] 2.7 [O] CV: `cv/` altındaki PDF'e `download` linki; e-posta görünür + "Kopyala" butonu (`navigator.clipboard`, `aria-live` ile "Kopyalandı")
- [x] 2.8 [O] Print CSS: kimlik kartı linklerinin URL'si yazılsın (`a::after{content:" — " attr(href)}`), "Eğitimden, deneyime." başlığı yazdırmada gizlensin, e-posta görünsün
- [x] 2.9 [O] `<title>` ve meta description yeni konumlanmaya göre; OG başlık/açıklama aynı; JSON-LD `jobTitle`/`knowsAbout` güncel; `og-image.png` metni değiştiyse yeniden üret
- **Kabul:** Hero'ya bakan biri 5 sn'de rol, durum ve CV'ye ulaşabiliyor; mobil sayfa yüksekliği belirgin kısaldı (önce ~8.500px @390).

## Phase 3 — Responsive + erişilebilirlik
- [ ] 3.1 [O] ≤760px: hero birincil buton tam genişlik; metin linkleri, tema/menü/duraklatma butonları ≥44px dokunma alanı
- [ ] 3.2 [O] Mobil menü: açılınca ilk linke odak, Esc/kapatınca odak menü butonuna dönsün
- [ ] 3.3 [O] Tema butonu açık temada ay ikonu göstersin; duraklatma butonunda "Ⅱ" yerine SVG pause/play ikonu
- [ ] 3.4 [O] Animasyon duraklatma tercihi localStorage'da saklansın (tema gibi, try/catch ile)
- [ ] 3.5 [O] Açık temada `.identity-art .status-dot` görünür olsun (`background:#b5fa59`)
- [ ] 3.6 [O] `.certificate-row` ≤760px'te alt alta (tarih başlığın altında)
- **Kabul:** 360/390/768/1024/1440px'te taşma yok; klavyeyle tüm etkileşimler çalışıyor.

## Phase 4 — Performans + kod yapısı
- [ ] 4.1 [O] CSS'i tek `css/main.css`'te birleştir (sıra: tokens, base, layout, header, hero, cards, resume, contact/form, utilities, motion, print); inline `<style>` bloklarını taşı; `index.html` referanslarını güncelle (`?v=` ile)
- [ ] 4.2 [O] Ölü seçicileri sil: `.orbit*`, `.monogram*`, `.art-cross`, `.cross-*`, `.art-tag`, `.card-link*`, `.card-arrow`, `.contact-link*`, `.contact-handle*`, `.wordmark-dot`, `.message-fields`, `.art-bottom svg`, `.card-top svg`, `nav a span`, `.hero-description span`, `@keyframes arrive`; çift tanımlı token'ları tekilleştir
- [ ] 4.3 [O] Sabit `#b5fa59…` renklerini (26 adet) token/`color-mix` ile değiştir — açık temada lime gölge kalmasın
- [ ] 4.4 [O] JS'i `js/main.js`'te birleştir (script.js + interactions.js + inline form script), `defer`
- [ ] 4.5 [O] `interactions.js`'teki scroll dinleyicisi: tüm öğeleri değil yalnızca `.is-hovered` olanları sıfırla
- [ ] 4.6 [O] Hero ve ticker ekran dışındayken animasyonları durdur (IntersectionObserver → `.is-offscreen{animation-play-state:paused}`); `twinkle` ve `dotPulse` yalnızca `opacity`/`transform` kullansın
- [ ] 4.7 [O] Logo SVG'si bir kez `<symbol id="mee">` olarak tanımlanıp header/footer'da `<use>` ile kullanılsın; kullanılmayan `mee-logo.svg` silinsin
- [ ] 4.8 [O] `.gitattributes` (`* text=auto eol=lf`, `*.png binary`, `*.pdf binary`) + `git add --renormalize .`
- [ ] 4.9 [O] Kökte `404.html` (logo, kısa mesaj, ana sayfaya dön; aynı CSS)
- [ ] 4.10 [Z] İsteğe bağlı: Manrope + Space Grotesk değişken woff2 dosyalarını `fonts/` altına self-host et, `@font-face` + ana fontu `preload`
- **Kabul:** Görsel fark yok (önce/sonra ekran görüntüsü karşılaştır); Lighthouse performans ≥95 mobil; `css/main.css` mevcut 3 dosyanın toplamından küçük.

## Phase 5 — Polish
- [x] 5.1 [Z] Ticker'ı kaldır ya da yalnızca masaüstünde göster — ≤760px'te gizlendi (Phase 2)
- [ ] 5.2 [Z] Proje kartı hover: ekran görüntüsü hafif yukarı kayar (`transform`)
- [ ] 5.3 [Z] Aktif bölümün numarası (`01 /`) accent renge geçer (mevcut `aria-current` mantığını kullan)
- [ ] 5.4 [Z] Tema değişiminde `document.startViewTransition` (destek yoksa normal geçiş, reduced-motion'da kapalı)
- [ ] 5.5 [Z] İngilizce sürüm `/en/index.html` + `hreflang` (yalnızca Mert isterse)
- [ ] 5.6 [O] Bu plan dosyası tamamlanınca `docs/` klasörünü silmeyi Mert'e öner (repo herkese açık yayınlanıyor)
