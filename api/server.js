const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Di produksi aman karena dibatasi oleh Nginx Proxy
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Fincthub API' });
});

// Port
const PORT = process.env.PORT || 5000;

// Test DB Connection and Start Server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful.');

    const server = app.listen(PORT, '0.0.0.0', () => {
      const address = server.address();
      const host = typeof address === 'string' ? address : address?.address;
      const port = typeof address === 'string' ? '' : address?.port;
      console.log(`Server is running on http://${host}:${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

// Diagnostic logs for unexpected exit
process.on('exit', (code) => {
  console.log(`[Diagnostic] Process is exiting with code: ${code}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Diagnostic] Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();
