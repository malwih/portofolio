# Personal Portofolio 2025 — Malwi Hidayat Togatorop

Website statis bertema biru dengan elemen 3D (tilt, parallax) dan animasi profesional.

## Struktur
- `index.html` — markup halaman utama.
- `styles.css` — tema biru, efek 3D, animasi, dan responsif.
- `script.js` — efek tilt, parallax, dan scroll-reveal.
- `assets/` — folder aset (kosong, untuk keperluan ke depan).

## Cara Pakai
1. Buka `index.html` di browser.
2. Ganti tautan sosial di bagian "Get In Touch" pada `index.html`:
   - Email: ganti `malwi.togatorop@example.com` dengan email Anda.
   - WhatsApp: ganti `6281234567890` dengan nomor Anda (format internasional tanpa 0).
   - LinkedIn & TikTok: ganti `username` dengan username Anda.
3. Ganti foto profil:
   - Di `index.html`, cari elemen `<img class="profile-img" .../>`.
   - Ganti atribut `src` dengan URL atau path lokal ke foto Anda, misalnya `./assets/foto-profil.jpg`.
4. Edit teks ringkasan biodata di `index.html` sesuai kebutuhan.

## Catatan Desain
- Warna utama: biru (`--primary`) dengan aksen cyan (`--accent`).
- 3D tilt dan parallax dibuat ringan agar tetap profesional dan cepat.
- Semua ikon sosial memakai SVG inline untuk menghindari dependensi eksternal.

## Kustomisasi Cepat
- Ubah skema warna di `:root` pada `styles.css`.
- Matikan efek tertentu bila diperlukan:
  - Hilangkan parallax: hapus blok `setupParallax()` di `script.js`.
  - Hilangkan tilt: hapus atribut `data-tilt` pada elemen.
  - Hilangkan reveal: hapus atribut `data-reveal` pada elemen.

Selamat menggunakan dan silakan beri tahu jika ingin menambah section lain (Skills, Projects, Experience, Contact form, dsb.) atau mengganti gaya visual.
