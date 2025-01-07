const cron = require("node-cron");
const User = require("../../models/User");
const trigger = require("../config.json").DailyDigest.cron;

// Every day at midnight, check if any users have not logged in for 30 days
// and deactivate their accounts
cron.schedule(trigger, async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const users = await User.find({ lastLogin: { $lt: thirtyDaysAgo } });

  users.forEach((user) => {
    user.status = "INACTIVE";
    user.save();
  });
});
