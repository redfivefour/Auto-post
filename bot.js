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
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  return { quote, author };
}

function formatTweet(quote, author) {
  const tweet = `"${quote}" — ${author}`;
  // Twitter limit is 280 characters
  if (tweet.length > 280) {
    const maxQuoteLength = 280 - author.length - 6; // 6 = `"" — `.length
    return `"${quote.substring(0, maxQuoteLength - 3)}..." — ${author}`;
  }
  return tweet;
}

async function postQuote() {
  const { quote, author } = getRandomQuote();
  const tweet = formatTweet(quote, author);

  console.log(`[${new Date().toISOString()}] Posting tweet (${tweet.length} chars):`);
  console.log(tweet);

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
