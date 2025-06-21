const express = require("express");
const router = express.Router();
const Settings = require("../models/settingSchema");
const loadSetting = require("../utils/loadSetting");

router.get("/admin/settings", require('../auth/isLoginAuth'), (req, res) => {
  res.render("settings", {
    settings: global.cachedSettings,
    messages: req.flash()
  });
});


router.post("/admin/settings", async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate(
      {},
      {
        $set: {
          maintenanceMode: req.body.maintenance_mode === "true",
          showMonthlyResult: req.body.showMonthlyResult === "true",
          updatedAt: new Date(),
        },
      },
      { new: true, upsert: true }
    );

    await loadSetting(true);
    req.flash("success", "Settings updated successfully!");
    res.redirect("/admin/settings");
  } catch (err) {
    console.error("❌ Update failed:", err);
    req.flash("error", "Failed to update settings.");
    res.redirect("/admin/settings");
  }
});


module.exports = router;
