# Fincthub Docker Guide 🐳

Panduan ini menjelaskan cara mengoperasikan Fincthub menggunakan Docker untuk pengembangan dan produksi.

## 🏗️ File Docker Compose

| File | Kegunaan | Port Host (UI/API) | Port Internal |
|:---|:---|:---|:---|
| `docker-compose.local.yml` | Pengujian lokal dengan Hot Reload | 3000 / 5001 | 3000 / 5000 |
| `docker-compose.yml` | Konfigurasi Produksi (VPS) | 3000 / - | 3000 / 5000 |

## 🏷️ Docker Tagging Strategy
Sistem CI/CD kami menggunakan strategi penamaan berikut:
- **`:latest`**: Versi stabil yang sedang berjalan di produksi (dari branch `main`).
- **`:dev`**: Versi pengujian terbaru (dari branch `develop`).
- **`:${GITHUB_SHA}`**: Tag unik untuk setiap build guna memudahkan *rollback*.

## 🛠️ Cara Menjalankan (Lokal)

Untuk menjalankan environment pengujian yang lengkap di laptop Anda:

```bash
docker compose -f docker-compose.local.yml up --build
```

**Mengapa ini penting?**
- Ini mensimulasikan lingkungan VPS di laptop Anda.
- Menggunakan database MySQL dalam kontainer (terpisah dari database host).
- Menjalankan migrasi dan seeding data secara otomatis.

## ⚙️ Migrasi & Seeding Otomatis

Aplikasi menggunakan skrip `docker-entrypoint.sh` pada kontainer API:
- `RUN_MIGRATIONS=true`: Menjalankan migrasi database otomatis.
- `RUN_SEEDS=true`: Mengisi data awal (user & category).

---
Dibuat dengan ❤️ oleh Antigravity untuk Fincthub.
