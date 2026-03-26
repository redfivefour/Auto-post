# Twitter Quote Bot

A Node.js bot that automatically posts random quotes from an author to X/Twitter.

## Features

- Posts a random quote from `quotes.json` to Twitter/X
- Supports scheduled posting via cron (default: every 6 hours)
- Configurable author, quotes, and posting schedule
- Automatically truncates quotes that exceed Twitter's 280-character limit

## Project Structure

```
.
├── bot.js          # Core logic: pick a random quote and post it
├── scheduler.js    # Runs bot.js on a cron schedule
├── quotes.json     # Author name and list of quotes
├── .env.example    # Template for API credentials
└── package.json
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Twitter API credentials

You need a [Twitter Developer account](https://developer.twitter.com/en/portal/dashboard) with a project that has **Read and Write** permissions using **OAuth 1.0a**.

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

```env
TWITTER_APP_KEY=your_api_key_here
TWITTER_APP_SECRET=your_api_key_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_token_secret_here
```

### 3. Customize quotes

Edit `quotes.json` to change the author and quotes:

```json
{
  "author": "Your Author Name",
  "quotes": [
    "Quote one.",
    "Quote two.",
    "..."
  ]
}
```

## Usage

### Post a single quote now

```bash
npm start
```

### Run on a schedule (default: every 6 hours)

```bash
npm run schedule
```

Override the schedule via `.env`:

```env
CRON_SCHEDULE=0 9 * * *   # Once a day at 9am
```

## Deployment

For continuous operation, run the scheduler with a process manager:

```bash
# Using PM2
npm install -g pm2
pm2 start npm --name "quote-bot" -- run schedule
pm2 save
pm2 startup
```
