const { Setting } = require('../models');

// Fetch settings for current user (and potentially global ones)
const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get user-specific settings
    const settings = await Setting.findAll({
      where: { userId }
    });

    // Format as a key-value object
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });

    res.json({ response: settingsMap });
  } catch (error) {
    console.error('Fetch settings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update or create a setting
const upsertSetting = async (req, res) => {
  try {
    const userId = req.user.id;
    const { key, value } = req.body;

    if (!key) {
      return res.status(400).json({ message: 'Key is required' });
    }

    // Convert value to string to store
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

    // Upsert logic
    const [setting, created] = await Setting.findOrCreate({
      where: { userId, key },
      defaults: { value: stringValue }
    });

    if (!created) {
      setting.value = stringValue;
      await setting.save();
    }

    res.json({ message: 'Setting saved', response: { [key]: stringValue } });
  } catch (error) {
    console.error('Upsert setting error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSettings,
  upsertSetting
};
