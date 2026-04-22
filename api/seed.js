/**
 * Seed Script: Creates test database, runs migrations, and populates dummy data.
 * 
 * Usage: node seed.js
 */
require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT || 3306;

async function run() {
  console.log('=== Fincthub Test Database Seeder ===\n');

  // --- Step 1: Create database if not exists ---
  console.log(`[1/4] Creating database "${DB_NAME}" if not exists...`);
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    port: DB_PORT,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await connection.end();
  console.log(`  ✅ Database "${DB_NAME}" ready.\n`);

  // --- Step 2: Run migrations ---
  console.log('[2/4] Running Sequelize migrations...');
  const { execSync } = require('child_process');
  try {
    execSync(`"${process.execPath}" ./node_modules/sequelize-cli/lib/sequelize db:migrate`, {
      cwd: __dirname,
      stdio: 'inherit',
      env: process.env,
    });
  } catch (e) {
    console.log('  ⚠️  Migrations may have already been applied.');
  }
  console.log('  ✅ Migrations complete.\n');

  // --- Step 3: Connect via Sequelize ---
  console.log('[3/4] Connecting to database via Sequelize...');
  const db = require('./models');
  await db.sequelize.authenticate();
  console.log('  ✅ Connected.\n');

  const { User, Category, Transaction, Budget } = db;

  // --- Step 4: Seed data ---
  console.log('[4/4] Seeding dummy data...\n');

  // --- Users ---
  const hashedPassword = await bcrypt.hash('password123', 10);

  const [admin] = await User.findOrCreate({
    where: { email: 'admin@fincthub.com' },
    defaults: {
      username: 'Administrator',
      email: 'admin@fincthub.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`  👤 Admin: admin@fincthub.com / password123 (role: ADMIN)`);

  const [user1] = await User.findOrCreate({
    where: { email: 'suis@fincthub.com' },
    defaults: {
      username: 'Suis Setiawan',
      email: 'suis@fincthub.com',
      password: hashedPassword,
      role: 'USER',
    },
  });
  console.log(`  👤 User:  suis@fincthub.com / password123 (role: USER)`);

  const [user2] = await User.findOrCreate({
    where: { email: 'bambang@fincthub.com' },
    defaults: {
      username: 'Bambang Pamungkas',
      email: 'bambang@fincthub.com',
      password: hashedPassword,
      role: 'USER',
    },
  });
  console.log(`  👤 User:  bambang@fincthub.com / password123 (role: USER)\n`);

  // --- Categories ---
  const categoryData = [
    { name: 'Gaji', type: 'INCOME', userId: admin.id },
    { name: 'Freelance', type: 'INCOME', userId: admin.id },
    { name: 'Investasi', type: 'INCOME', userId: admin.id },
    { name: 'Makanan & Minuman', type: 'EXPENSE', userId: admin.id },
    { name: 'Transportasi', type: 'EXPENSE', userId: admin.id },
    { name: 'Hiburan', type: 'EXPENSE', userId: admin.id },
    { name: 'Belanja', type: 'EXPENSE', userId: admin.id },
    { name: 'Tagihan & Utilitas', type: 'EXPENSE', userId: admin.id },
    { name: 'Kesehatan', type: 'EXPENSE', userId: admin.id },
    { name: 'Pendidikan', type: 'EXPENSE', userId: admin.id },
  ];

  const categories = {};
  for (const cat of categoryData) {
    const [record] = await Category.findOrCreate({
      where: { name: cat.name, userId: cat.userId },
      defaults: cat,
    });
    categories[cat.name] = record;
  }
  console.log(`  📁 ${Object.keys(categories).length} categories created.\n`);

  // --- Transactions (for admin user, April 2026) ---
  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentYear = String(now.getFullYear());

  const transactionData = [
    // Income
    { description: 'Gaji Bulanan April', amount: 15000000, type: 'INCOME', categoryId: categories['Gaji'].id, date: `${currentYear}-${currentMonth}-01`, userId: admin.id },
    { description: 'Proyek Website Toko Online', amount: 5000000, type: 'INCOME', categoryId: categories['Freelance'].id, date: `${currentYear}-${currentMonth}-05`, userId: admin.id },
    { description: 'Dividen Saham BBCA', amount: 750000, type: 'INCOME', categoryId: categories['Investasi'].id, date: `${currentYear}-${currentMonth}-10`, userId: admin.id },
    { description: 'Bonus Kinerja Q1', amount: 3000000, type: 'INCOME', categoryId: categories['Gaji'].id, date: `${currentYear}-${currentMonth}-15`, userId: admin.id },
    
    // Expenses
    { description: 'Belanja Bulanan Superindo', amount: 850000, type: 'EXPENSE', categoryId: categories['Makanan & Minuman'].id, date: `${currentYear}-${currentMonth}-02`, userId: admin.id },
    { description: 'Makan Siang GrabFood', amount: 45000, type: 'EXPENSE', categoryId: categories['Makanan & Minuman'].id, date: `${currentYear}-${currentMonth}-03`, userId: admin.id },
    { description: 'Kopi Starbucks', amount: 65000, type: 'EXPENSE', categoryId: categories['Makanan & Minuman'].id, date: `${currentYear}-${currentMonth}-04`, userId: admin.id },
    { description: 'Makan Malam Restoran', amount: 350000, type: 'EXPENSE', categoryId: categories['Makanan & Minuman'].id, date: `${currentYear}-${currentMonth}-07`, userId: admin.id },
    { description: 'Bensin Pertamax', amount: 400000, type: 'EXPENSE', categoryId: categories['Transportasi'].id, date: `${currentYear}-${currentMonth}-03`, userId: admin.id },
    { description: 'Grab ke Kantor', amount: 35000, type: 'EXPENSE', categoryId: categories['Transportasi'].id, date: `${currentYear}-${currentMonth}-06`, userId: admin.id },
    { description: 'Tol Jakarta-Bandung', amount: 120000, type: 'EXPENSE', categoryId: categories['Transportasi'].id, date: `${currentYear}-${currentMonth}-12`, userId: admin.id },
    { description: 'Nonton Bioskop', amount: 100000, type: 'EXPENSE', categoryId: categories['Hiburan'].id, date: `${currentYear}-${currentMonth}-08`, userId: admin.id },
    { description: 'Langganan Netflix', amount: 186000, type: 'EXPENSE', categoryId: categories['Hiburan'].id, date: `${currentYear}-${currentMonth}-01`, userId: admin.id },
    { description: 'Langganan Spotify', amount: 54990, type: 'EXPENSE', categoryId: categories['Hiburan'].id, date: `${currentYear}-${currentMonth}-01`, userId: admin.id },
    { description: 'Beli Kemeja Uniqlo', amount: 399000, type: 'EXPENSE', categoryId: categories['Belanja'].id, date: `${currentYear}-${currentMonth}-09`, userId: admin.id },
    { description: 'Beli Sepatu Nike', amount: 1200000, type: 'EXPENSE', categoryId: categories['Belanja'].id, date: `${currentYear}-${currentMonth}-14`, userId: admin.id },
    { description: 'Token Listrik PLN', amount: 350000, type: 'EXPENSE', categoryId: categories['Tagihan & Utilitas'].id, date: `${currentYear}-${currentMonth}-05`, userId: admin.id },
    { description: 'Internet IndiHome', amount: 400000, type: 'EXPENSE', categoryId: categories['Tagihan & Utilitas'].id, date: `${currentYear}-${currentMonth}-05`, userId: admin.id },
    { description: 'BPJS Kesehatan', amount: 150000, type: 'EXPENSE', categoryId: categories['Kesehatan'].id, date: `${currentYear}-${currentMonth}-01`, userId: admin.id },
    { description: 'Obat Flu', amount: 75000, type: 'EXPENSE', categoryId: categories['Kesehatan'].id, date: `${currentYear}-${currentMonth}-11`, userId: admin.id },
    { description: 'Kursus Online Udemy', amount: 179000, type: 'EXPENSE', categoryId: categories['Pendidikan'].id, date: `${currentYear}-${currentMonth}-10`, userId: admin.id },
    
    // Previous month transactions (March)
    { description: 'Gaji Bulanan Maret', amount: 15000000, type: 'INCOME', categoryId: categories['Gaji'].id, date: `${currentYear}-03-01`, userId: admin.id },
    { description: 'Freelance Design Logo', amount: 2000000, type: 'INCOME', categoryId: categories['Freelance'].id, date: `${currentYear}-03-15`, userId: admin.id },
    { description: 'Belanja Bulanan', amount: 900000, type: 'EXPENSE', categoryId: categories['Makanan & Minuman'].id, date: `${currentYear}-03-03`, userId: admin.id },
    { description: 'Service Mobil', amount: 1500000, type: 'EXPENSE', categoryId: categories['Transportasi'].id, date: `${currentYear}-03-20`, userId: admin.id },
  ];

  let txCount = 0;
  for (const tx of transactionData) {
    const exists = await Transaction.findOne({
      where: { description: tx.description, date: tx.date, userId: tx.userId },
    });
    if (!exists) {
      await Transaction.create(tx);
      txCount++;
    }
  }
  console.log(`  💰 ${txCount} transactions created (${transactionData.length - txCount} already existed).\n`);

  // --- Budgets (for current month) ---
  const budgetData = [
    { categoryId: categories['Makanan & Minuman'].id, amount: 2000000, month: currentMonth, year: currentYear, userId: admin.id },
    { categoryId: categories['Transportasi'].id, amount: 1000000, month: currentMonth, year: currentYear, userId: admin.id },
    { categoryId: categories['Hiburan'].id, amount: 500000, month: currentMonth, year: currentYear, userId: admin.id },
    { categoryId: categories['Belanja'].id, amount: 2000000, month: currentMonth, year: currentYear, userId: admin.id },
    { categoryId: categories['Tagihan & Utilitas'].id, amount: 1000000, month: currentMonth, year: currentYear, userId: admin.id },
    { categoryId: categories['Kesehatan'].id, amount: 500000, month: currentMonth, year: currentYear, userId: admin.id },
    { categoryId: categories['Pendidikan'].id, amount: 300000, month: currentMonth, year: currentYear, userId: admin.id },
  ];

  let budgetCount = 0;
  for (const b of budgetData) {
    const exists = await Budget.findOne({
      where: { categoryId: b.categoryId, month: b.month, year: b.year, userId: b.userId },
    });
    if (!exists) {
      await Budget.create(b);
      budgetCount++;
    }
  }
  console.log(`  📊 ${budgetCount} budgets created (${budgetData.length - budgetCount} already existed).\n`);

  // --- Done ---
  console.log('=== Seeding Complete! ===\n');
  console.log('Login credentials:');
  console.log('  Admin → admin@fincthub.com / password123');
  console.log('  User  → suis@fincthub.com / password123');
  console.log('  User  → bambang@fincthub.com / password123\n');

  await db.sequelize.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
