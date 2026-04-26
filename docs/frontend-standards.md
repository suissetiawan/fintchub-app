# Frontend Coding Standards — FintchubApp UI

> Stack: **Vue 3 (Composition API) + TypeScript + Pinia + Tailwind CSS**

---

## 1. Struktur Folder

```
ui/src/
├── assets/          # Static assets (images, fonts)
├── components/
│   ├── common/      # Base components yang dipakai ulang di mana saja
│   ├── budget/      # Komponen spesifik fitur Budget
│   ├── transactions/# Komponen spesifik fitur Transactions
│   ├── categories/  # Komponen spesifik fitur Categories
│   ├── layout/      # Layout components (Navbar, Header, Sidebar)
│   └── users/       # Komponen spesifik User
├── layouts/         # Page layouts (DefaultLayout)
├── router/          # Vue Router config
├── services/        # API service (axios instance)
├── stores/          # Pinia stores
├── utils/           # Utility functions
└── views/           # Halaman (terhubung ke Router)
```

---

## 2. Penamaan

| Tipe               | Konvensi           | Contoh                          |
|--------------------|--------------------|---------------------------------|
| Komponen Vue       | `PascalCase`       | `BudgetFormDrawer.vue`          |
| Komponen base/umum | Prefix `Base`      | `BaseButton.vue`, `BaseSelect.vue` |
| Store Pinia        | `camelCase` + `Store` | `useBudgetStore`             |
| File store         | `camelCase`        | `budget.ts`                     |
| File view          | `PascalCase` + `View` | `DashboardView.vue`          |
| File util          | `camelCase` + `Helper` | `amountHelper.ts`          |
| Ref/reactive       | `camelCase`        | `isDrawerOpen`, `selectedBudget` |
| Computed           | `camelCase` noun   | `budgetOverview`, `periodRange` |
| Handler function   | `handle` / `on` prefix | `handleFilterChange`, `onSaved` |
| Async data loader  | `fetch` prefix     | `fetchBudgets`, `loadDashboardData` |

---

## 3. Standar Komponen Vue

Selalu gunakan `<script setup lang="ts">` (Composition API):

```vue
<template>
  <!-- Template selalu di atas -->
</template>

<script setup lang="ts">
// 1. Import library & framework
import { ref, computed, onMounted } from 'vue'
import { PlusIcon } from 'lucide-vue-next'

// 2. Import stores
import { useBudgetStore } from '@/stores/budget'

// 3. Import components
import BaseButton from '@/components/common/BaseButton.vue'

// 4. Import utils
import { formatNumber } from '@/utils/amountHelper'

// 5. Props & Emits
const props = withDefaults(defineProps<{
  isOpen: boolean
  budget?: Budget | null
}>(), {
  budget: null
})

const emit = defineEmits<{
  close: []
  saved: []
}>()

// 6. Store instances
const budgetStore = useBudgetStore()

// 7. Reactive state
const isLoading = ref(false)
const errorMessage = ref('')

// 8. Computed
const title = computed(() => props.budget ? 'Edit Budget' : 'Tambah Budget')

// 9. Functions & handlers
const handleSubmit = async () => { ... }

// 10. Lifecycle
onMounted(() => { ... })
</script>
```

---

## 4. Standar Komponen Base (Common)

Komponen di `components/common/` harus:
- Menggunakan prefix `Base` pada nama file dan komponen.
- Mendukung prop `size` dengan pilihan: `'xs' | 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`).
- Mendukung dark mode via Tailwind `dark:` prefix.
- Tidak berisi logika bisnis — hanya presentasi dan event.
- Menggunakan `withDefaults` untuk nilai default prop.

### Komponen yang tersedia

| Komponen           | Kapan dipakai                                          |
|--------------------|--------------------------------------------------------|
| `BaseButton`       | Semua tombol aksi (submit, delete, cancel, dsb)        |
| `BaseSelect`       | Semua dropdown/pilihan (menggantikan `<select>` native) |
| `BaseAmountInput`  | Input nilai uang (Rupiah)                              |
| `BaseSkeleton`     | Loading placeholder saat data sedang di-fetch          |
| `BaseConfirmDialog`| Konfirmasi sebelum aksi destruktif (hapus, dsb)        |
| `BaseModalLayout`  | Layout dasar untuk semua drawer/modal                  |

---

## 5. Standar Pinia Store

```ts
import { defineStore } from 'pinia'
import api from '@/services/api'
import { useUiStore } from './ui'

// 1. Definisikan interface terlebih dahulu
export interface Budget {
  id: number
  categoryId: number
  categoryName: string
  amount: number
  month: string
  year: string
}

// 2. Definisikan state interface
interface BudgetState {
  budgets: Budget[]
  loading: boolean
}

export const useBudgetStore = defineStore('budget', {
  state: (): BudgetState => ({
    budgets: [],
    loading: false,
  }),

  getters: {
    // Getter untuk data turunan (kalkulasi)
    budgetsWithUsage(): BudgetWithUsage[] { ... }
  },

  actions: {
    // READ: tidak perlu UiStore loading (gunakan state.loading)
    async fetchBudgets(params?: { month?: string; year?: string }) {
      this.loading = true
      try {
        const response = await api.get('/api/budgets', { params })
        this.budgets = response.data.response || []
      } catch (error) {
        console.error('Fetch budgets failed:', error)
      } finally {
        this.loading = false
      }
    },

    // WRITE: gunakan UiStore untuk global loading overlay
    async createBudget(data: Partial<Budget>) {
      const uiStore = useUiStore()
      uiStore.setLoading(true, 'Menyimpan budget...')
      try {
        const response = await api.post('/api/budgets', data)
        await this.fetchBudgets() // Selalu refresh setelah mutasi
        return response.data
      } catch (error) {
        throw error // Re-throw agar komponen bisa handle error
      } finally {
        uiStore.setLoading(false)
      }
    },
  },
})
```

**Aturan Store:**
- `fetchXxx` → untuk operasi READ, pakai `this.loading`, tidak throw error.
- `createXxx`, `updateXxx`, `deleteXxx` → untuk WRITE, pakai `uiStore.setLoading`, **selalu `throw error`** agar komponen bisa menangkap dan menampilkan pesan ke user.
- Setelah mutasi (create/update/delete), **selalu refresh** dengan memanggil `fetchXxx`.

---

## 6. Standar Penanganan Error di Komponen

```ts
// ✅ Tampilkan error ke user via errorMessage ref
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  try {
    await budgetStore.createBudget(form)
    emit('saved')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan. Coba lagi.'
  }
}
```

```vue
<!-- Tampilkan errorMessage di template -->
<div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
  {{ errorMessage }}
</div>
```

> **Aturan**: Jangan gunakan `alert()` atau `console.error` sebagai pengganti UI error. Selalu tampilkan pesan ke user melalui komponen atau state.

---

## 7. Standar Layout & Spacing

### Padding Halaman (View)
- Halaman menggunakan `class="space-y-5"` sebagai container utama.
- Padding kartu/panel: `p-4` (mobile) atau `p-5` (desktop dengan `sm:p-5`).

### Kartu / Panel
```html
<div class="p-4 sm:p-5 bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
  ...
</div>
```

### Tombol Aksi Utama (Primary CTA)
```html
<button class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
  Simpan
</button>
```

### Tombol Secondary / Neutral
```html
<button class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all active:scale-95">
  Batal
</button>
```

### Tombol Danger (Hapus)
```html
<button class="px-4 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 text-red-600 font-bold rounded-xl transition-all active:scale-95">
  Hapus
</button>
```

### Referensi Ukuran Border Radius

| Ukuran     | Class Tailwind   | Kapan digunakan                   |
|------------|------------------|-----------------------------------|
| Pill/Badge | `rounded-full`   | Tag, badge status, chip           |
| Card small | `rounded-xl`     | Tombol, input, item list kecil    |
| Card besar | `rounded-2xl`    | Panel, kartu utama, drawer card   |

---

## 8. Standar Loading State

Gunakan komponen `BaseSkeleton` saat data sedang di-fetch:

```vue
<div v-if="store.loading" class="space-y-3">
  <div v-for="i in 3" :key="i" class="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center">
    <div class="space-y-2">
      <BaseSkeleton width="w-32" height="h-4" />
      <BaseSkeleton width="w-24" height="h-3" />
    </div>
    <BaseSkeleton width="w-16" height="h-5" />
  </div>
</div>

<div v-else>
  <!-- Konten aktual -->
</div>
```

---

## 9. Standar Dark Mode

Semua komponen WAJIB mendukung dark mode menggunakan Tailwind `dark:` prefix:

```html
<!-- ✅ Benar -->
<p class="text-gray-900 dark:text-white">Judul</p>
<p class="text-gray-500 dark:text-gray-400">Deskripsi</p>
<div class="bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">

<!-- ❌ Salah - tidak ada dark mode fallback -->
<p class="text-gray-900">Judul</p>
```

### Palette Warna Standar

| Kegunaan              | Light                      | Dark                        |
|-----------------------|----------------------------|-----------------------------|
| Background halaman    | `bg-gray-50`               | `dark:bg-gray-950`          |
| Background kartu      | `bg-white`                 | `dark:bg-gray-900`          |
| Border kartu          | `border-gray-100`          | `dark:border-gray-800`      |
| Teks utama            | `text-gray-900`            | `dark:text-white`           |
| Teks sekunder         | `text-gray-500`            | `dark:text-gray-400`        |
| Teks placeholder      | `text-gray-400`            | `dark:text-gray-500`        |
| Aksen biru            | `text-blue-600 bg-blue-50` | `dark:text-blue-400 dark:bg-blue-900/20` |
| Bahaya/merah          | `text-red-600 bg-red-50`   | `dark:text-red-400 dark:bg-red-900/20` |
| Sukses/hijau          | `text-green-600 bg-green-50` | `dark:text-green-400 dark:bg-green-900/20` |
| Warning/amber         | `text-amber-600 bg-amber-50` | `dark:text-amber-400 dark:bg-amber-900/20` |

---

## 10. Standar Format Angka & Tanggal

Selalu gunakan helper dari `@/utils/`:

```ts
import { formatNumber, getFontSizeClass } from '@/utils/amountHelper'
import { getMonitoringDateRange, toLocalISODate } from '@/utils/dateHelper'

// Format rupiah
formatNumber(1500000)        // → "1.500.000"
formatNumber(1500000, true)  // → "1.500.000" (force show meski hide mode aktif)

// Hitung periode monitor
const { startDate, endDate } = getMonitoringDateRange(month, year, periodType, paydayDate)

// Tanggal lokal ke string YYYY-MM-DD
toLocalISODate(new Date()) // → "2026-04-26"
```

---

## 11. Ikon

Selalu gunakan `lucide-vue-next`:

```ts
import { Plus, Edit2, Trash2, ChevronRight, Calendar } from 'lucide-vue-next'
```

```html
<Plus :size="20" />
<Trash2 :size="18" class="text-red-500" />
```

> **Aturan**: Jangan gunakan emoji atau unicode sebagai ikon di UI. Selalu gunakan Lucide.
