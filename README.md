# Fincthub Monorepo 💰

Fincthub adalah aplikasi manajemen keuangan pribadi yang modern, dibangun dengan arsitektur Monorepo yang bersih dan siap untuk skala produksi.

## 🚀 Struktur Proyek
- **/api**: Backend service menggunakan Node.js, Express, dan Sequelize (MySQL).
- **/ui**: Frontend web menggunakan Vue.js 3, Vite, dan TailwindCSS.
- **Root**: Berisi konfigurasi orkestrasi Docker dan skrip manajemen global.

## 🌳 Alur Kerja Branch (Branching Strategy)
- **`main`**: Kode produksi yang stabil. Setiap push ke sini otomatis ter-deploy ke VPS (Production).
- **`develop`**: Tempat penggabungan fitur baru. Push ke sini otomatis membangun image pengujian (`:dev`).
- **Feature Branches**: Gunakan rute `feature/nama-fitur` untuk pengembangan baru, lalu buat **Pull Request** ke `develop`.

## 🏁 Memulai Cepat (Local Development)

1.  **Instalasi**:
    ```bash
    npm install
    ```
2.  **Konfigurasi**:
    Salin `.env.example` menjadi `.env` dan sesuaikan nilainya.
3.  **Jalankan**:
    ```bash
    npm run dev
    ```
    Akses UI di `http://localhost:5173` dan API di `http://localhost:5001`.

## 🤖 CI/CD Pipelines (GitHub Actions)
- **Quality Check**: Berjalan di setiap Pull Request (Lint & Build Test).
- **Auto Deploy**: Otomatis ke VPS saat merge ke branch `main`.

## 📝 Dokumentasi Lanjutan
- [Panduan Deployment & Arsitektur](DEPLOYMENT.md)
- [Panduan Docker Detail](DOCKER_GUIDE.md)
- [Contoh Variabel Lingkungan](.env.example)

---
© 2026 Fincthub Team
