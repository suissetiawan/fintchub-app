const { Category } = require('../models');

const starterCategories = [
  { name: 'Gaji', type: 'INCOME' },
  { name: 'Freelance', type: 'INCOME' },
  { name: 'Investasi', type: 'INCOME' },
  { name: 'Makanan & Minuman', type: 'EXPENSE' },
  { name: 'Transportasi', type: 'EXPENSE' },
  { name: 'Hiburan', type: 'EXPENSE' },
  { name: 'Belanja', type: 'EXPENSE' },
  { name: 'Tagihan & Utilitas', type: 'EXPENSE' },
  { name: 'Kesehatan', type: 'EXPENSE' },
  { name: 'Pendidikan', type: 'EXPENSE' },
  { name: 'Lainnya', type: 'EXPENSE' },
];

const seedStarterCategories = async (userId) => {
  try {
    const categories = starterCategories.map(cat => ({
      ...cat,
      userId
    }));
    await Category.bulkCreate(categories);
    console.log(`✅ Starter categories seeded for user ${userId}`);
  } catch (error) {
    console.error(`❌ Failed to seed starter categories for user ${userId}:`, error.message);
  }
};

module.exports = {
  seedStarterCategories
};
