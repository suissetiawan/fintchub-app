const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const register = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const userCount = await User.count();
    if (userCount > 0) {
      return res.status(403).json({ message: 'Registration is currently disabled' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN', // First user is always ADMIN
    });

    res.status(201).json({
      message: 'Registration successful',
      response: {
        userId: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = signAccessToken({ id: user.id, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });

    res.json({
      message: 'Login successful',
      response: {
        accessToken,
        refreshToken,
        userId: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const accessToken = signAccessToken({ id: user.id, role: user.role });

    res.json({
      message: 'Token refreshed',
      response: {
        accessToken,
      },
    });
  } catch (error) {
    console.error('Refresh error:', error.message);
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

const logout = async (req, res) => {
  // In a simple JWT setup, logout is mostly handled on the frontend (removing token).
  // Ideally, we'd blacklist the token, but for now we just return success.
  res.json({ message: 'Logged out successfully' });
};

const checkSetupStatus = async (req, res) => {
  try {
    const userCount = await User.count();
    res.json({ response: { usersExist: userCount > 0 } });
  } catch (error) {
    console.error('Setup check error:', error.message);
    res.status(500).json({ message: 'Server error check context' });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  checkSetupStatus,
};
