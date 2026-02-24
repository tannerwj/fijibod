# Fiji Bod

**TaxHawk's official pre-Fiji fitness motivation hub.**

Built for the TaxHawk Engineering team trip to Fiji on June 4, 2026. A friendly competition to see who can get their "Fiji Body" ready in time.

## Live Sites

| Environment | URL |
|-------------|-----|
| **Production** | https://fijibod.com |
| **Beta** | https://beta.fijibod.com |
| **Test Suite** | https://beta.fijibod.com/test.html |

## Project Structure

```
fijibod/
  package.json            # deploy scripts
  wrangler.toml           # prod worker config
  wrangler.beta.toml      # beta worker config
  site/                   # static frontend (Cloudflare Pages)
    index.html            # main countdown + navigation
    leaderboard.html      # live rankings, trash talk, trends
    tracker.html          # personal workout logging
    challenge.html        # weekly fitness challenges
    motivation.html       # motivation + Excuse Destroyer 3000
    flex.html             # flex gallery
    shred.html            # secret motivation page
    test.html             # automated API test suite
    404.html
    beta-config.js
    audio/
      fiji-ready.mp3
      excuse-destroyer.mp3
  worker/                 # Cloudflare Worker API
    index.js              # router (~70 lines)
    routes/               # domain handlers
    lib/                  # shared helpers (cors, response, streaks, points)
    migrations/           # SQL schema + migrations
  mcp/                    # MCP server for Claude Code/Desktop
    bin/fijibod-mcp.js    # entry point
    src/                  # server + tools
```

## Features

### Personal Tracking
- Log workouts (type, reps/duration, points)
- Edit/delete your own workouts
- Weight tracking with goal types (lose/gain/maintain)
- Personal workout history with charts
- Goal progress visualization

### Social & Competition
- Live leaderboard with rankings
- Achievement unlocks
- Weekly challenges with scoring
- Trash talk / messaging
- Streak tracking
- Team progress stats

### Easter Eggs
- **Konami Code**: on homepage activates SHRED MODE
- **Hidden Palms**: three palms hidden on the homepage
- **Secret Code**: unlocks hidden panel on the leaderboard
- **Console Messages**: check the browser console on every page

## MCP Server

Log workouts, check the leaderboard, and trash talk — all from Claude Code or Claude Desktop.

### Setup

```bash
cd mcp && npm install
```

Add to your Claude Code `.mcp.json` or Claude Desktop config:

```json
{
  "mcpServers": {
    "fijibod": {
      "command": "node",
      "args": ["/path/to/fijibod/mcp/bin/fijibod-mcp.js"],
      "env": { "FIJIBOD_USER": "YourName" }
    }
  }
}
```

`FIJIBOD_USER` is **required**. Override the API URL with `FIJIBOD_API_URL` if needed.

### Available Tools

| Tool | Description |
|------|-------------|
| `log_workout` | Log a workout (type + amount) |
| `get_my_workouts` | Get your workout history |
| `edit_workout` | Edit a workout |
| `delete_workout` | Delete a workout |
| `get_recent_workouts` | Get 10 most recent across all users |
| `get_leaderboard` | Get the full leaderboard |
| `get_stats` | Get overall stats |
| `get_user` | Get user profile (defaults to self) |
| `update_weight` | Update current weight |
| `set_goal` | Set weight goal + type |
| `post_trash_talk` | Post a trash talk message |
| `get_messages` | Get recent messages |
| `get_active_challenge` | Get the current active challenge |
| `join_challenge` | Submit a challenge entry |

## Deployment

```bash
# Deploy everything (worker + pages)
npm run deploy

# Deploy beta
npm run deploy:beta

# Individual deploys
npm run deploy:worker
npm run deploy:pages
```

### Database Migrations

```bash
# Apply to production
npx wrangler d1 execute fijibod-db --remote --file=worker/migrations/001-initial.sql

# Apply to beta
npx wrangler d1 execute fijibod-beta-db --remote --file=worker/migrations/001-initial.sql
```

## API

See [API.md](API.md) for full endpoint documentation.

## Tech Stack

- **Frontend**: Pure HTML/CSS/JS (no build step), Cloudflare Pages
- **Backend**: Cloudflare Worker + D1 (SQLite)
- **MCP**: Node.js + @modelcontextprotocol/sdk
- **Environments**: Separate prod/beta with independent databases

## Security

- Workouts/messages can only be edited/deleted by their owner
- Name conflicts resolved with "Is this you?" modal
- No server-side auth (trust-based for team use)

---

*Summer bodies are made in winter. Fiji bodies are forged in fire.*
