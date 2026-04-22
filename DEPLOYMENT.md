# Fincthub Deployment Guide

Panduan ini menjelaskan arsitektur monorepo Fincthub dan cara mengelolanya di berbagai lingkungan.

## 🏗️ Dasar Arsitektur
Aplikasi ini menggunakan struktur monorepo dengan **API (Node.js/Sequelize)** dan **UI (Vue/Vite)**.

| Lingkungan | Akses UI | Akses API (Host) | API Internal |
|:---|:---|:---|:---|
| **Local Machine** | localhost:5173 | localhost:5001 | N/A |
| **Docker Local** | localhost:3000 | localhost:5001 | api:5000 |
| **Production (VPS)** | Domain/IP:3000 | Domain/IP:5000 | api:5000 |

---

## 💻 1. Pengembangan Lokal (Host)
Gunakan mode ini untuk pengembangan fitur harian yang cepat.
- **Setup**: `npm run install:all`
- **Jalankan**: `npm run dev`
- **Config**: Edit `.env` di root. Gunakan `PORT=5001`.

## 🐳 2. Pengujian Docker Lokal
Gunakan mode ini untuk memastikan aplikasi siap di-deploy ke server.
- **Jalankan**: `docker compose -f docker-compose.local.yml up --build`
- **Config**: Edit `docker-compose.local.yml`. Port API otomatis di-mapping dari 5000 ke 5001.

## 🚀 3. Produksi (VPS Deployment)
Automatisasi menggunakan GitHub Actions.
- **Pipeline**: CI/CD akan membangun image dan melakukan push ke DockerHub.
- **Deploy**: Image ditarik ke VPS dan dijalankan menggunakan `docker-compose.yml`.
- **Database**: Pastikan network `apps-network` sudah tersedia di VPS.

## 🤖 4. GitHub Actions Pipelines
- **Quality Check (PR)**: Menjalankan Lint & Build test untuk setiap Pull Request ke branch `main` atau `develop`.
- **Staging Release (Dev)**: Membangun image `:dev` saat ada push ke branch `develop`.
- **Production Release (Prod)**: Membangun image `:latest` dan otomatis deploy ke VPS saat ada push ke branch `main`.

---

## 🛠️ Perintah Berguna (Root)
- `npm run lint:all`: Cek kesalahan kode di seluruh proyek.
- `npm run format:all`: Rapikan format kode (Prettier).
- `npm run db:reset`: Hapus data, migrasi ulang, dan isi data seed (Hati-hati!).

## ❓ Troubleshooting
- **CORS Error**: Pastikan `VITE_API_BASE_URL` di `.env` sudah sesuai dengan port API yang sedang aktif (5000 vs 5001).
- **Network Error (Docker)**: Cek apakah API mendengarkan di `0.0.0.0:5000`.
