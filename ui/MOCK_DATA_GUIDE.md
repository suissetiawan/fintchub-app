# Panduan Penggunaan Mock Data

Aplikasi ini mendukung penggunaan mock data untuk development tanpa perlu backend yang berjalan. Semua komponen sudah dikonfigurasi untuk bekerja dengan mock data.

## Cara Menggunakan Mock Data

### 1. Aktifkan Mode Mock

Edit file `.env` dan set:

```env
VITE_USE_MOCKS=true
```

### 2. Nonaktifkan Mode Mock (Gunakan API Asli)

Edit file `.env` dan set:

```env
VITE_USE_MOCKS=false
```

**Catatan:** Setelah mengubah `.env`, restart development server (`npm run dev`)

## Fitur Mock Data

### ✅ Endpoint yang Didukung

#### Authentication

- `POST /auth/login` - Login dengan credentials mock
- `POST /auth/register` - Register user baru
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout

**Credentials Mock:**

- Admin: `suis@admin.com` / `pass`
- User: `bambang@user.com` / `pass`

#### Transactions

- `GET /api/transactions` - List transactions (dengan filter month/year, pagination)
- `GET /api/transactions/:id` - Detail transaction
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

#### Categories

- `GET /api/categories` - List categories
- `GET /api/categories/:id` - Detail category
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

#### Users

- `GET /api/users` - List users
- `GET /api/users/:id` - User profile
- `POST /auth/register` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Dashboard

- `GET /api/dashboard/summary` - Summary data
- `GET /api/dashboard/breakdown` - Financial breakdown

## Cara Kerja

1. **Mock Interceptor**: Semua request axios diintercept oleh mock interceptor
2. **In-Memory Storage**: Data disimpan di memory (akan reset saat refresh page)
3. **CRUD Operations**: Semua operasi CRUD didukung dengan simulasi database sederhana

## Switching ke API Asli

Ketika `VITE_USE_MOCKS=false`:

- Mock interceptor tidak aktif
- Request akan dikirim ke API asli melalui proxy di `vite.config.ts`
- Proxy mengarahkan request ke `https://api-fintracker.suissetiawan.my.id`

## Struktur Mock Data

Mock data tersimpan di folder `src/mocks/data/`:

- `auth.ts` - Login responses
- `users.ts` - User data
- `transactions.ts` - Transaction data
- `categories.ts` - Category data
- `dashboard.ts` - Dashboard summary dan breakdown

## Catatan Penting

⚠️ **Data Mock akan hilang saat refresh page** karena disimpan di memory
⚠️ **Mock data hanya untuk development**, tidak untuk production
✅ **Semua komponen sudah kompatibel** dengan mock data dan API asli
✅ **Tidak perlu perubahan code** saat switch antara mock dan API asli
