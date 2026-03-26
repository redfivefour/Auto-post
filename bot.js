require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const quotesData = require('./quotes.json');

// Validate required environment variables
const requiredEnvVars = [
  'TWITTER_APP_KEY',
  'TWITTER_APP_SECRET',
  'TWITTER_ACCESS_TOKEN',
  'TWITTER_ACCESS_SECRET',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const client = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const rwClient = client.readWrite;

function getRandomQuote() {
  const { quotes, author } = quotesData;
  const entry = quotes[Math.floor(Math.random() * quotes.length)];
  return { text: entry.text, source: entry.source, author };
}

function formatTweet(text, source, author) {
  // Format: "Quote" — Herman Melville, Moby-Dick, Chapter 1
  const full = `"${text}" — ${author}, ${source}`;
  if (full.length <= 280) return full;

  // If too long, try without source
  const noSource = `"${text}" — ${author}`;
  if (noSource.length <= 280) return noSource;

  // Truncate the text to fit with ellipsis, keeping attribution
  const suffix = `..." — ${author}`;
  return `"${text.substring(0, 280 - suffix.length - 1)}${suffix}`;
}

async function postQuote() {
  const { text, source, author } = getRandomQuote();
  const tweet = formatTweet(text, source, author);

  console.log(`[${new Date().toISOString()}] Posting tweet (${tweet.length} chars):\n${tweet}`);

  try {
    const response = await rwClient.v2.tweet(tweet);
    console.log(`[${new Date().toISOString()}] Tweet posted successfully! ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Failed to post tweet:`, error.message);
    if (error.data) {
      console.error('Twitter API error details:', JSON.stringify(error.data, null, 2));
    }
    throw error;
  }
}

// Run immediately when called directly
postQuote().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});

module.exports = { postQuote, getRandomQuote, formatTweet };
