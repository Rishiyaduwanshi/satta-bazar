const Settings = require("../models/settingSchema");

async function loadSetting(force = false) {
  try {
    if (force || !global.cachedSettings) {
      const settings = await Settings.findOne().select({ _id: 0, __v: 0 });

      if (settings) {
        global.cachedSettings = settings;
        console.log("✅ Admin settings loaded into cache.");
      } else {
        console.warn("⚠️ No settings found. Insert default settings in DB.");
        global.cachedSettings = null;
      }
    }
  } catch (err) {
    console.error("❌ Failed to load settings:", err);
  }
}

module.exports = loadSetting;
