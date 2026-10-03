# CLAUDE.md — mertthebabo.github.io

Mert Erdem Elmacı'nın kişisel portfolyo sitesi. Canlı: https://mertthebabo.github.io
Yapılacak işlerin tam listesi: `docs/IYILESTIRME-PLANI.md` — her oturumda önce onu oku, sıradaki açık maddeden devam et, bitince kutucuğu işaretle.
İncelemenin tüm ayrıntıları (ölçümler, gerekçeler, kod örnekleri): repo kökündeki `claude-code-prompt.md`. Bu dosya yalnızca Mert'in bilgisayarında durur, `.git/info/exclude` ile commit dışıdır — commit'leme, silme.

## Yığın ve yayın
- Düz HTML + CSS + JavaScript. **Framework, bundler, npm bağımlılığı veya build adımı ekleme.**
- GitHub Pages, "Deploy from a branch" → `main` / kök klasör. `main`'e push = ~1 dk içinde canlı. GitHub Actions dosyası yok, ekleme.
- `.nojekyll` var; silme. Repo'daki her dosya herkese açık yayınlanır (bu dosya ve plan dahil) — gizli bilgi yazma.
- GitHub Pages `Cache-Control: max-age=600` gönderir. CSS/JS değiştiğinde `index.html` içindeki referanslara `?v=N` ekle/artır.

## Dosya haritası (mevcut)
- `index.html` — tek sayfa. İçinde 2 inline `<style>` bloğu (form + logo) ve 1 inline `<script>` (iletişim formu, FormSubmit AJAX) var.
- `style.css` — ilk sürümden kalan temel stiller; içinde ölü seçiciler var (plan Phase 4'te temizlenecek).
- `enhancements.css` — `style.css`'i ezen ikinci katman (token'lar, hero, kartlar, özgeçmiş, LinkedIn kartı, print). Sonunda "Review fixes" bloğu var.
- `interactions.css` / `interactions.js` — hover tilt, spotlight, ripple, mobil reveal.
- `script.js` — tema değiştirme, mobil menü, animasyon duraklatma, reveal, okuma çubuğu, yazdır.
- `mee-favicon.svg`, `apple-touch-icon.png`, `og-image.png` (1200×630), `robots.txt`, `sitemap.xml`.

## Tasarım dili — koru
- Koyu tema varsayılan, lime vurgu. Token'lar `enhancements.css` başında: `--bg #090d0c`, `--panel #121918`, `--text`, `--muted #a0ada6`, `--line`, `--accent #b5fa59` (açık tema `#345e08`), `--field-border`, `--danger`, `--success`.
- Fontlar: başlıklar `Space Grotesk` (`--display`), metin `Manrope` (`--font`). `<head>`'de `<link>` ile yükleniyor; CSS içine `@import` geri koyma.
- Yeni renk yazarken sabit hex yerine token ya da `color-mix(in srgb, var(--accent) X%, transparent)` kullan.
- Görsel kimliği (yörünge kartı, MEE logosu, eyebrow + büyük başlık düzeni, bölüm numaraları `01 /`) yeniden tasarlama; yalnızca planda yazanı değiştir.

## Erişilebilirlik kuralları (zorunlu)
- Dekoratif ok/simge karakterleri (↗ ↘ ↑ → ✳) her zaman `<span aria-hidden="true">` içinde.
- `target="_blank"` linklere `<span class="visually-hidden"> (yeni sekmede açılır)</span>` ekle.
- Rolü olmayan `div`/`span` üzerinde `aria-label` kullanma; görünmeyen metin için `.visually-hidden`.
- Yeni animasyonlar yalnızca `transform`/`opacity`; `prefers-reduced-motion` ve `html.motion-paused` altında durmalı.
- Metin kontrastı ≥ 4.5:1, form kenarlıkları/odak halkası ≥ 3:1 — iki temada da.
- Mobil dokunma hedefi ≥ 44px.

## İçerik kuralları
- **Proje, deneyim, sertifika, tarih, şehir, unvan uydurma.** Bilmediğin her içerik için Mert'e sor; o vermeden yer tutucu `[...]` bırakıp kullanıcıya listele.
- Dil Türkçe; Türkçe karakterleri (ı, ğ, ş, İ, â) koru. Dosya UTF-8.

## Kod kuralları
- Dosya/klasör adları küçük harf ve tiresiz-boşluksuz (GitHub Pages büyük/küçük harfe duyarlı; Mert Windows kullanıyor).
- Varlık yolları göreli (`css/main.css`), OG/canonical/sitemap/JSON-LD URL'leri mutlak (`https://mertthebabo.github.io/...`).
- Satır sonları: `script.js` ve `enhancements.css` şu an CRLF, diğerleri LF. Phase 4'te `.gitattributes` ile LF'ye normalize edilene kadar dosyanın mevcut satır sonunu koru.

## Doğrulama (her phase sonunda)
```bash
python -m http.server 8080            # http://localhost:8080
npx lighthouse http://localhost:8080 --only-categories=accessibility,best-practices,seo --quiet --chrome-flags="--headless=new"
npx @axe-core/cli http://localhost:8080
```
- Masaüstü 1440px, tablet 768px, mobil 390px ve 360px'te yatay kaydırma olmamalı.
- Koyu + açık temada formu dene, klavyeyle (Tab/Shift+Tab/Esc) tüm sayfayı gez.
- Hedef: Lighthouse erişilebilirlik 100, axe 0 ihlal, konsolda hata yok.

## Git akışı
- Her phase için ayrı dal: `phase-1-kritik`, `phase-2-icerik` … Küçük, anlamlı commit'ler (Türkçe mesaj).
- Mert onaylamadan `main`'e merge/push etme. Onaydan sonra: `main`'e merge → push → 1–2 dk bekle → canlı siteyi kontrol et.
