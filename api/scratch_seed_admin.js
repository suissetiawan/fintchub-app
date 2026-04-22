require('dotenv').config();
const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function createDefaultUser() {
  try {
    const defaultEmail = 'admin@fincthub.com';
    const defaultPassword = 'password123';
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: defaultEmail } });
    if (existingUser) {
      console.log('Admin user already exists.');
      console.log(`Email: ${defaultEmail}`);
      process.exit(0);
    }

    // Create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);
    
    await User.create({
      name: 'Administrator',
      email: defaultEmail,
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('Account created successfully!');
    console.log(`Email: ${defaultEmail}`);
    console.log(`Password: ${defaultPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error.message);
    process.exit(1);
  }
}

createDefaultUser();
