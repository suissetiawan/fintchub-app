# Backend Coding Standards — FintchubApp API

> Stack: **Node.js + Express + Sequelize (MySQL)**

---

## 1. Struktur Folder

```
api/
├── config/          # Konfigurasi database & env
├── controllers/     # Business logic & handler request
├── middlewares/     # Auth, validasi, error handling
├── migrations/      # Sequelize migration files
├── models/          # Sequelize model definitions
├── routes/          # Express router
├── seeders/         # Data seeder
├── utils/           # Helper functions (jwt, dsb)
└── server.js        # Entry point
```

---

## 2. Penamaan File & Variabel

| Tipe            | Konvensi                   | Contoh                           |
|-----------------|----------------------------|----------------------------------|
| File controller | `camelCase` + `Controller` | `transactionController.js`       |
| File route      | `camelCase` + `Routes`     | `transactionRoutes.js`           |
| File model      | `PascalCase` (singular)    | `Transaction` → `transaction.js` |
| File migration  | `timestamp-kebab-case`     | `20260425000001-add-name-to-users.js` |
| Variabel        | `camelCase`                | `userId`, `categoryId`           |
| Konstanta       | `UPPER_SNAKE_CASE`         | `COLORS`, `MAX_PAGE_SIZE`        |

---

## 3. Standar Response API

Semua endpoint WAJIB menggunakan format response berikut:

### ✅ Success — Data Tunggal atau List
```json
{
  "response": { ... }       // atau array [...]
}
```

### ✅ Success — Create/Update/Delete
```json
{
  "message": "Transaction created",
  "response": { ... }       // data hasil (opsional untuk delete)
}
```

### ✅ Success — Paginasi
```json
{
  "response": [...],
  "pagination": {
    "page": 1,
    "size": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### ❌ Error — Client (4xx)
```json
{
  "message": "Deskripsi error yang jelas dalam Bahasa Indonesia atau Inggris"
}
```

### ❌ Error — Server (5xx)
```json
{
  "message": "Server error"
}
```

> **Aturan**: Jangan pernah mengembalikan `error.message` stack trace mentah ke client. Log ke `console.error` saja.

---

## 4. Standar Controller

```js
// ✅ BENAR
const createTransaction = async (req, res) => {
  try {
    const { description, amount, type, date, categoryId } = req.body;

    // Validasi input
    if (!description || !amount || !type || !date) {
      return res.status(400).json({ message: 'Field wajib tidak lengkap.' });
    }

    // Validasi keunikan (jika perlu)
    const existing = await Transaction.findOne({
      where: { userId: req.user.id, description, amount, type, date }
    });
    if (existing) {
      return res.status(400).json({ message: 'Data dengan rincian yang sama sudah ada.' });
    }

    // Proses
    const result = await Transaction.create({ ... });

    // Response
    res.status(201).json({ message: 'Transaction created', response: result });
  } catch (error) {
    console.error('Create transaction error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
```

**Aturan Penting:**
- Selalu gunakan `try/catch` di setiap controller.
- Gunakan `req.user.id` untuk memfilter data berdasarkan user yang login.
- Tambahkan validasi **keunikan** sebelum `create` dan `update`.
- HTTP status code: `200` GET/UPDATE, `201` CREATE, `400` invalid, `401` unauth, `403` forbidden, `404` not found, `500` server error.
- Log error dengan format: `console.error('[NamaFungsi] error:', error.message)`.

---

## 5. Standar Model (Sequelize)

```js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Transaction.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    }
  }

  Transaction.init({
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('INCOME', 'EXPENSE'),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Transaction',
  });

  return Transaction;
};
```

**Aturan:**
- Selalu definisikan `allowNull` pada setiap field.
- Gunakan `DECIMAL(15, 2)` untuk semua field uang/keuangan.
- Nama model selalu **PascalCase singular** (`Transaction`, bukan `Transactions`).
- Relasi selalu pakai `as` untuk aliasing yang jelas.

---

## 6. Standar Route

```js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionController');
const { authMiddleware } = require('../middlewares/auth');

// Semua route di bawah ini membutuhkan autentikasi
router.use(authMiddleware);

router.get('/', controller.getAllTransactions);
router.get('/:id', controller.getTransactionById);
router.post('/', controller.createTransaction);
router.put('/:id', controller.updateTransaction);
router.delete('/:id', controller.deleteTransaction);

module.exports = router;
```

**Aturan:**
- Pasang `authMiddleware` dengan `router.use()` bukan per-route.
- Urutan route: GET list → GET by id → POST → PUT → DELETE.
- Untuk sub-resource (e.g., `/budgets/templates`), definisikan **sebelum** route `/:id`.

---

## 7. Query Filter & Date Range

Gunakan `Op.between` untuk filter rentang tanggal, bukan `LIKE`:

```js
// ✅ Gunakan ini untuk filter tanggal
if (startDate && endDate) {
  where.date = { [Op.between]: [startDate, endDate] };
}

// ❌ Hindari ini (hanya untuk kompatibilitas lama)
where.date = { [Op.like]: `${year}-${month}%` };
```

---

## 8. Penanganan Relasi dalam Response

Flatten relasi menggunakan `map` agar frontend tidak perlu akses nested object:

```js
// ✅
const formattedBudgets = budgets.map(b => ({
  ...b.toJSON(),
  categoryName: b.category ? b.category.name : 'Unknown'
}));

// ❌ Jangan kirim nested object mentah
res.json({ response: budgets }); // frontend dapat b.category.name (fragile)
```
