# 📋 Sistem Laporan Kerja Harian (CodeIgniter 4)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpanzauto46-bot%2FINPUT-DATA-LAPORAN-KERJA)
[![CodeIgniter 4](https://img.shields.io/badge/CodeIgniter-4.5-firebrick.svg)](https://codeigniter.com)
[![PHP version](https://img.shields.io/badge/PHP-%3E%3D%208.2-8892BF.svg)](https://www.php.net/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Aplikasi **Sistem Laporan Kerja Harian** adalah solusi digital modern yang dirancang untuk mempermudah karyawan dalam mencatat, memantau, dan melaporkan aktivitas kerja harian mereka. Dibangun dengan framework **CodeIgniter 4** yang ringan dan cepat, serta **Alpine.js** untuk interaktivitas frontend tanpa beban, aplikasi ini siap di-deploy secara serverless di **Vercel**.

---

## ✨ Fitur Utama

Aplikasi ini dilengkapi dengan fitur-fitur esensial untuk produktivitas kerja:

### 1. 📝 Input & Manajemen Data (CRUD)
- **Pencatatan Detail**: Mencatat tanggal, waktu mulai/selesai, kategori kegiatan, prioritas, status, hasil kerja, hingga kendala yang dihadapi.
- **Validasi Cerdas**: Memastikan data yang diinput lengkap dan logis (misal: jam selesai tidak boleh lebih awal dari jam mulai).
- **Edit & Hapus**: Kemudahan memperbarui atau menghapus laporan yang salah input.

### 2. 📊 Dashboard Analitik Interaktif
- **Visualisasi Data**: Grafik batang dan donat (menggunakan Chart.js) untuk melihat distribusi kegiatan per kategori dan status penyelesaian.
- **Ringkasan Statistik**: Menampilkan total kegiatan, persentase penyelesaian, rata-rata rating kinerja, dan total jam kerja secara *real-time*.

### 3. 🔍 Pencarian & Filter Canggih
- **Pencarian Cepat**: Temukan laporan berdasarkan kata kunci (nama, kegiatan, hasil) secara instan.
- **Multi-Filter**: Saring data berdasarkan Kategori (e.g., Meeting, Development) atau Status (e.g., Selesai, Pending).
- **Sorting**: Urutkan data berdasarkan tanggal atau prioritas.

### 4. 📂 Ekspor Data
- **Ekspor CSV**: Unduh laporan kerja ke format CSV dalam sekali klik untuk kebutuhan arsip atau analisa lebih lanjut di Excel/Spreadsheet.

### 5. 🎨 UI/UX Modern & Responsif
- **Desain Premium**: Menggunakan Tailwind CSS untuk tampilan yang bersih, profesional, dan responsif di semua perangkat (Desktop, Tablet, Mobile).
- **Mode Gelap/Terang**: (Direncanakan untuk update mendatang).
- **Notifikasi**: Feedback visual instan untuk setiap aksi (disimpan, dihapus, error).

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan *stack* teknologi modern yang efisien:

### Backend
- **Framework**: [CodeIgniter 4](https://codeigniter.com/) (PHP Framework yang ringan dan aman).
- **Runtime**: PHP 8.2 (Kompatibel dengan Vercel Serverless Function).
- **Serverless**: Dikonfigurasi khusus untuk berjalan di [Vercel](https://vercel.com) menggunakan `vercel-php`.

### Frontend
- **Logic**: [Alpine.js](https://alpinejs.dev/) (Framework JS ringan untuk reaktivitas).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS framework via CDN).
- **Charts**: [Chart.js](https://www.chartjs.org/) (Visualisasi data).
- **Icons**: [Lucide Icons](https://lucide.dev/) (Ikon vektor modern).

### Database / Penyimpanan
- **Local Storage (Demo/MVP)**: Saat ini menggunakan penyimpanan browser (Client-side) untuk demonstrasi tanpa perlu setup database server yang rumit. Data tetap tersimpan di browser pengguna.
- **SQLite / MySQL (Coming Soon)**: Struktur backend sudah siap untuk dihubungkan ke database relasional.

---

## 🚀 Panduan Instalasi & Deployment

### Prasyarat
- Akun [GitHub](https://github.com).
- Akun [Vercel](https://vercel.com).
- Git terinstal di komputer Anda.

### 1. Kloning Repositori
```bash
git clone https://github.com/panzauto46-bot/INPUT-DATA-LAPORAN-KERJA.git
cd INPUT-DATA-LAPORAN-KERJA
```

### 2. Konfigurasi Lokal (Opsional, jika ingin menjalankan di PC)
Pastikan Anda memiliki PHP 8.2+ dan Composer.
```bash
composer install
php spark serve
```
Akses di `http://localhost:8080`.

### 3. Deployment ke Vercel (Cara Termudah)
1. **Push kode** ke repositori GitHub Anda.
2. Buka **Dashboard Vercel**.
3. Klik **"Add New Project"** dan impor repositori GitHub tadi.
4. Pilih Framework Preset: **Other**.
5. Biarkan pengaturan Build & Output kosong (default).
6. Klik **Deploy**.
7. Selesai! Aplikasi Anda sudah online.

---

## 🗺️ Roadmap Pengembangan (Peta Jalan)

Rencana pengembangan aplikasi ini kedepan untuk menjadi sistem manajemen kerja yang komprehensif:

### Fase 1: MVP & Stabilitas (Sekarang) ✅
- [x] Struktur dasar CodeIgniter 4.
- [x] Integrasi Alpine.js & Tailwind.
- [x] CRUD Laporan Harian (Local Storage).
- [x] Dashboard sederhana.
- [x] Konfigurasi Deployment Vercel.

### Fase 2: Persistensi & Autentikasi (Sedang Berjalan) 🚧
- [x] **Integarasi Database**: Migrasi dari LocalStorage ke database cloud (Supabase/MySQL/PostgreSQL) agar data tersimpan permanen di server. _(Struktur Migrasi Sudah Siap)_
- [x] **Sistem Login Multi-User**: Menambahkan fitur registrasi dan login untuk membedakan data antar pengguna. _(Tabel User Sudah Siap)_
- [x] **Role Management**: Admin vs Staff (Admin bisa melihat rekap semua staff).

### Fase 3: Kolaborasi & Laporan Lanjutan (Q3 2026) 📅
- [ ] **Komentar & Feedback**: Atasan bisa memberi komentar pada laporan kerja.
- [ ] **Ekspor PDF**: Generate laporan PDF rapi dengan kop surat perusahaan.
- [ ] **Notifikasi Email**: Recap otomatis harian/mingguan via email.
- [ ] **Tim & Departemen**: Pengelompokan user berdasarkan divisi.

### Fase 4: Integrasi & Mobile (Q4 2026) 🔮
- [ ] **Integrasi Kalender**: Sinkronisasi dengan Google Calendar/Outlook.
- [ ] **Progressive Web App (PWA)**: Bisa diinstal di HP layaknya aplikasi native.
- [ ] **Analitik Lanjutan**: Prediksi beban kerja dan analisis performa karyawan berbasis AI.

---

## 📁 Struktur Proyek

```
/
├── app/
│   ├── Config/         # Konfigurasi aplikasi (Routes, Database, Paths)
│   ├── Controllers/    # Logika backend (Home.php)
│   ├── Views/          # Tampilan antarmuka (laporan_kerja.php)
│   └── ...
├── public/
│   ├── index.php       # Entry point aplikasi
│   └── ...
├── writable/           # Direktori sementara (Logs, Cache) - diset ke /tmp di Vercel
├── vercel.json         # Konfigurasi serverless Vercel
└── spark               # CLI tool CodeIgniter
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**. Silakan gunakan, modifikasi, dan distribusikan secara bebas.

---

<div align="center">
  <p>Dibuat dengan ❤️ oleh Rifqy Malikh Hanapi</p>
  <p>2026 © Hak Cipta Dilindungi</p>
</div>
