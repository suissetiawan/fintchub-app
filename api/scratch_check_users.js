const { User } = require('./models');

async function checkUsers() {
  try {
    const users = await User.findAll({ attributes: ['email', 'role'] });
    console.log('Registered Users:');
    users.forEach(u => console.log(`- ${u.email} (${u.role})`));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
