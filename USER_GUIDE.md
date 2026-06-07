# Buku Panduan Pengguna (User Guide) - Prime-DC

Selamat datang di **Prime-DC**, platform manajemen dan pameran properti eksklusif yang dirancang untuk memberikan pengalaman terbaik bagi Agen Properti profesional maupun Calon Pembeli.

Buku panduan ini akan membantu Anda memahami cara menggunakan semua fitur yang ada di platform ini.

---

## 1. Cara Mengakses Platform

Aplikasi ini dibagi menjadi dua bagian utama:
1. **Halaman Publik**: Area yang bisa diakses oleh siapa saja (calon pembeli) untuk melihat-lihat katalog properti.
   - **URL**: `http://[domain-anda]/`
2. **Dashboard Agen**: Area khusus yang memerlukan login, digunakan oleh agen untuk mengelola data properti.
   - **URL Login**: `http://[domain-anda]/agent/login`

---

## 2. Panduan Untuk Agen (Dashboard Admin)

### 2.1. Cara Login ke Dashboard
1. Buka halaman `http://[domain-anda]/agent/login`.
2. Masukkan kredensial Anda. Jika Anda baru pertama kali menjalankan sistem, Anda dapat menggunakan kredensial default berikut:
   - **Superadmin**: `superadmin@primeproperty.com` / `Password123!`
   - **Admin**: `admin@primeproperty.com` / `Password123!`
3. Klik tombol **Login**. Anda akan langsung diarahkan ke Dashboard.

### 2.2. Manajemen Daftar Properti
Di Dashboard, Anda memiliki kendali penuh atas inventaris properti.
- **Melihat Properti**: Pada halaman utama dashboard, Anda akan melihat tabel berisi seluruh properti yang terdaftar beserta status dan harganya.
- **Menambah Properti Baru**: 
  1. Klik tombol **"Tambah Properti"**.
  2. Isi formulir dengan lengkap (Judul, Harga, Deskripsi, Spesifikasi seperti luas tanah/bangunan, jumlah kamar).
  3. Masukkan link Google Maps atau teks lokasi pada kolom lokasi.
  4. Unggah (Upload) foto-foto properti terbaik.
  5. Klik **Simpan**. Properti akan langsung tayang di halaman publik.
- **Mengedit Properti**: Klik ikon **Edit** (Pensil) pada baris properti yang ingin diubah. Perbarui informasi yang diperlukan dan simpan.
- **Menghapus Properti**: Klik ikon **Hapus** (Tempat Sampah). *Peringatan: Properti yang dihapus tidak dapat dikembalikan.*

### 2.3. Fitur Cepat Salin Teks WhatsApp
Untuk mempermudah Anda mengirim penawaran ke klien via WhatsApp:
1. Buka detail salah satu properti di dashboard.
2. Cari tombol **"Salin Teks WA"** atau ikon *Copy*.
3. Teks promosi yang sudah diformat dengan rapi (berisi Harga, Spesifikasi, dan Link Google Maps) akan otomatis tersalin.
4. Buka aplikasi WhatsApp Anda, tekan *Paste* (Tempel) di kolom chat klien, lalu kirim!

---

## 3. Panduan Halaman Publik (Untuk Klien / Calon Pembeli)

Jika Anda memiliki klien, arahkan mereka ke halaman utama website Anda. Berikut adalah cara mereka berinteraksi:

### 3.1. Menjelajahi Katalog
- Di Beranda (`/`), klien dapat melihat daftar *carousel* atau *grid* properti unggulan.
- Klien dapat mengklik kartu properti mana pun untuk masuk ke halaman detail.

### 3.2. Fitur Halaman Detail Properti (`/properti/[id]`)
- **Galeri Foto**: Klien dapat melihat visual eksklusif properti dengan tampilan *dark theme*.
- **Informasi Lengkap**: Harga, luas tanah, luas bangunan, jumlah kamar tidur/mandi, dan deskripsi detail tersedia secara rapi.
- **Lokasi Pintar (Smart Maps)**: Terdapat tombol "Lihat Lokasi" yang akan langsung membuka aplikasi Google Maps di perangkat klien untuk memandu mereka ke lokasi properti.

### 3.3. Menghubungi Agen (`/kontak`)
Jika klien tertarik, mereka bisa menghubungi Anda melalui:
1. Tombol **"Hubungi Kami"** yang ada di detail properti.
2. Formulir otomatis akan terbuka dengan teks pesan *template* (misal: `"Halo, saya tertarik dengan properti [Nama Properti]..."`).
3. Klien hanya perlu mengisi Nama, Email, dan Nomor HP lalu menekan tombol **"Kirim Pesan"**. Pesan tersebut akan dikirim secara aman ke sistem agen.

---

## 4. Tips & Trik Tambahan
- **Resolusi Gambar**: Untuk tampilan terbaik, unggah gambar dengan resolusi minimal 1080p (orientasi *landscape*) agar terlihat mewah di layar besar.
- **Keamanan**: Jangan lupa untuk mengganti password *default* Anda setelah berhasil login pertama kali di lingkungan produksi (jika fitur ubah profil tersedia).

*Jika Anda mengalami kendala teknis atau menemukan *bug*, silakan hubungi tim pengembang IT Anda.*
