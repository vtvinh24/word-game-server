/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const cron = require("node-cron");
const trigger = require("#config/cron.json").ServiceStatus.cron;
const readline = require("readline");

// Create a readline interface to control the console output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to update the status footer
function updateFooter(stats) {
  readline.cursorTo(process.stdout, 0, process.stdout.rows - 1);
  readline.clearLine(process.stdout, 0);
  process.stdout.write(`Memory usage: ${stats}MB`);
}

// Report process stats every minute
cron.schedule(trigger, async () => {
  // display MB of RAM usage by this process
  const stats = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  updateFooter(stats);
});