/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const cron = require("node-cron");
const trigger = require("#config/cron.json").ServiceStatus.cron;
const readline = require("readline");
const os = require("os");

// Create a readline interface to control the console output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to update the status footer
function updateFooter(stats) {
  readline.cursorTo(process.stdout, 0, process.stdout.rows - 1);
  readline.clearLine(process.stdout, 0);
  process.stdout.write(`${stats.uptime}s | ${stats.memory}MB | ${stats.cpu}%`);
}

// Function to get CPU usage
function getCpuUsage() {
  const cpus = os.cpus();
  let user = 0;
  let nice = 0;
  let sys = 0;
  let idle = 0;
  let irq = 0;
  for (let cpu of cpus) {
    user += cpu.times.user;
    nice += cpu.times.nice;
    sys += cpu.times.sys;
    idle += cpu.times.idle;
    irq += cpu.times.irq;
  }
  const total = user + nice + sys + idle + irq;
  return ((total - idle) / total * 100).toFixed(2);
}

// Report process stats
cron.schedule(trigger, async () => {
  const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const cpu = getCpuUsage();
  const uptime = process.uptime().toFixed(0);
  updateFooter({ memory, cpu, uptime });
});