# Prime-DC

Prime Property (Prime-DC) adalah platform manajemen dan pameran properti eksklusif yang dirancang khusus untuk agen properti profesional. Platform ini menyediakan antarmuka publik yang elegan (*luxury dark theme*) untuk calon pembeli, serta Dashboard Agent yang fungsional untuk mengelola inventaris properti.

## Fitur Utama

### 1. Halaman Publik (Klien)
- **Desain Eksklusif**: Tampilan *Luxury Dark Mode* dengan elemen glassmorphism dan tipografi elegan.
- **Katalog Properti**: Menampilkan properti unggulan dengan informasi detail (harga, spesifikasi, lokasi).
- **Integrasi Maps Pintar**: Tombol lokasi yang otomatis mendeteksi apakah tautan berupa URL Google Maps atau teks pencarian.
- **Formulir Kontak**: Pengunjung dapat mengirim pesan langsung kepada agen dengan animasi *feedback* (toast) modern.

### 2. Dashboard Agent
- **Manajemen Inventaris**: Tambah, edit, dan hapus properti dengan mudah.
- **Upload Gambar**: Dukungan untuk mengunggah gambar properti secara langsung.
- **Tombol Pintas WhatsApp**: Fitur *Salin Teks WA* yang secara otomatis membuat draf pesan berisi detail properti dan tautan lokasi untuk dibagikan ke klien.
- **Tema Gelap Konsisten**: Dashboard agen menggunakan skema warna yang identik dengan halaman publik demi menjaga konsistensi identitas merek.

---

## Panduan Penggunaan (User Guide)

### Persyaratan Sistem
- **Node.js**: Versi 18.x atau lebih baru.
- **Database**: SQLite (dikonfigurasi menggunakan `sqlite3` via file lokal `prime.db`).

### Instalasi dan Menjalankan Proyek Secara Lokal

1. **Clone Repositori**
   ```bash
   git clone https://github.com/dikydharmawan/Prime-DC.git
   cd Prime-DC
   ```

2. **Instalasi Dependensi**
   Jalankan perintah berikut untuk mengunduh semua paket yang dibutuhkan:
   ```bash
   npm install
   ```

3. **Menjalankan Server Pengembangan (Development)**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

4. **Kredensial Default**
   Untuk masuk ke Dashboard Agent, gunakan salah satu akun berikut pada halaman `/agent/login`:
   
   **Akun Superadmin**:
   - **Email**: `superadmin@primeproperty.com`
   - **Password**: `Password123!`
   
   **Akun Admin**:
   - **Email**: `admin@primeproperty.com`
   - **Password**: `Password123!`

### Struktur Navigasi
- `/` : Beranda publik (Katalog properti utama).
- `/tentang-kami` : Informasi profil perusahaan Prime Property.
- `/kontak` : Formulir komunikasi publik.
- `/agent/login` : Portal masuk eksklusif agen.
- `/agent/dashboard` : Pusat kontrol manajemen properti (membutuhkan login).

---

## Teknologi yang Digunakan
- **Framework**: Next.js (App Router)
- **Bahasa Pemrograman**: TypeScript
- **Styling**: Vanilla CSS Modules dengan variabel CSS terpusat (*theming*).
- **Ikon**: Lucide React
- **Database**: SQLite
- **Manajemen State Data**: SWR (Stale-While-Revalidate)

## Catatan Pengembangan
- Semua gaya CSS diatur dalam file lokal `.module.css` untuk mencegah konflik desain antar komponen.
- Notifikasi dan *feedback* UI dikelola menggunakan komponen *Toast* kustom yang bersifat *fixed* dan estetik.
