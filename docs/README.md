# FintchubApp — Documentation Index

Selamat datang di folder dokumentasi FintchubApp. Dokumen ini berisi standar pengkodean dan panduan arsitektur untuk menjaga konsistensi di seluruh codebase.

---

## 📚 Daftar Dokumen

| Dokumen | Deskripsi |
|---|---|
| [backend-standards.md](./backend-standards.md) | Standar penulisan kode backend (Node.js, Express, Sequelize) |
| [frontend-standards.md](./frontend-standards.md) | Standar penulisan kode frontend (Vue 3, TypeScript, Pinia, Tailwind) |

---

## 🏗️ Arsitektur Singkat

```
FintchubApp
├── api/   → REST API (Node.js + Express + Sequelize + MySQL)
└── ui/    → SPA (Vue 3 + TypeScript + Pinia + Tailwind CSS)
```

**Komunikasi:** Frontend memanggil API melalui Axios (`ui/src/services/api.ts`).  
**Autentikasi:** JWT Bearer Token, di-handle oleh `authMiddleware` di setiap route.  
**State Management:** Pinia stores di `ui/src/stores/`.

---

## 🔑 Prinsip Utama

1. **Konsistensi** — Ikuti standar yang tertulis di dokumen ini, jangan improvisasi format sendiri.
2. **Keamanan** — Selalu filter data berdasarkan `req.user.id` di backend. Jangan percaya input client.
3. **Dark Mode First** — Setiap komponen baru harus langsung mendukung dark mode.
4. **Error handling yang baik** — Backend log error, frontend tampilkan pesan ke user.
5. **Jangan gunakan `alert()`** — Gunakan `errorMessage` ref dan tampilkan di template.
