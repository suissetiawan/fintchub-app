const { User } = require('../models');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    res.json({ response: users });
  } catch (error) {
    console.error('Fetch users error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only access their own profile; admins can access any
    const isOwn = String(req.user.id) === String(id);
    const isAdmin = req.user.role && req.user.role.toUpperCase() === 'ADMIN';

    if (!isOwn && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return in the shape the frontend expects
    res.json({
      response: {
        id: user.id,
        name: user.username || user.email,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Get user by ID error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Users can update their own profile; admins can update any
    const isOwn = String(req.user.id) === String(id);
    const isAdmin = req.user.role && req.user.role.toUpperCase() === 'ADMIN';

    if (!isOwn && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, username, email, role, password } = req.body;
    const updates = {};
    if (name !== undefined) updates.username = name;
    if (username !== undefined) updates.username = username;
    if (email !== undefined) updates.email = email;
    if (role !== undefined && isAdmin) updates.role = role;
    if (password) updates.password = await bcrypt.hash(password, 10);

    await user.update(updates);

    const userJson = user.toJSON();
    delete userJson.password;

    res.json({
      message: 'User updated',
      response: {
        id: userJson.id,
        name: userJson.username || userJson.email,
        email: userJson.email,
        role: userJson.role,
      },
    });
  } catch (error) {
    console.error('Update user error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    res.json({
      response: {
        id: user.id,
        name: user.username || user.email,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Fetch profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'USER',
    });

    res.status(201).json({
      message: 'User created successfully',
      response: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Create user error:', error.message);
    res.status(500).json({ message: 'Server error during user creation' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  updateUser: updateUserById,
  deleteUser,
  getProfile,
  createUser,
};
