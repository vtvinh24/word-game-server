const cron = require("node-cron");
const { log } = require("../../common/Logger");
const trigger = require("../config.json").ServiceStatus.cron;

// Report process stats every minute
cron.schedule(trigger, async () => {
  const stats = `This is an example scheduled task that runs every minute.`;
  log(`\n${stats}`, "WARN", "node-cron");
});
