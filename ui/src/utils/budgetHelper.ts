export const DEFAULT_BUDGET_AMOUNTS: Record<string, number> = {
  'Makanan & Minuman': 2000000,
  'Transportasi': 1000000,
  'Hiburan': 500000,
  'Belanja': 1000000,
  'Tagihan & Utilitas': 1000000,
  'Kesehatan': 500000,
  'Pendidikan': 500000,
  'Tabungan': 1000000,
}

export const getDefaultAmount = (categoryName: string): number => {
  return DEFAULT_BUDGET_AMOUNTS[categoryName] || 0
}
