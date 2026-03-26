require('dotenv').config();
const cron = require('node-cron');
const { postQuote } = require('./bot');

// Default: post every 6 hours — override with CRON_SCHEDULE env var
// Examples:
//   Every hour:       0 * * * *
//   Twice a day:      0 9,18 * * *
//   Once a day 9am:   0 9 * * *
//   Every 6 hours:    0 */6 * * *
const schedule = process.env.CRON_SCHEDULE || '0 */6 * * *';

console.log(`[${new Date().toISOString()}] Twitter Quote Bot scheduler starting...`);
console.log(`[${new Date().toISOString()}] Cron schedule: "${schedule}"`);

if (!cron.validate(schedule)) {
  console.error(`Invalid cron schedule: "${schedule}"`);
  process.exit(1);
}

// Post immediately on startup
console.log(`[${new Date().toISOString()}] Posting initial quote on startup...`);
postQuote().catch((err) => console.error('Startup post failed:', err.message));

// Then post on schedule
cron.schedule(schedule, () => {
  console.log(`[${new Date().toISOString()}] Cron triggered — posting quote...`);
  postQuote().catch((err) => console.error('Scheduled post failed:', err.message));
});

console.log(`[${new Date().toISOString()}] Scheduler is running. Press Ctrl+C to stop.`);
