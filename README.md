# 🌴 Fiji Bod

**TaxHawk's official pre-Fiji fitness motivation hub.**

Built for the TaxHawk Engineering team trip to Fiji on June 4, 2026. A friendly competition to see who can get their "Fiji Body" ready in time.

## 🚀 Live Sites

| Environment | URL |
|-------------|-----|
| **Production** | https://fijibod.com |
| **Beta** | https://beta.fijibod.com |
| **Test Suite** | https://beta.fijibod.com/test.html |

## 📁 Pages

| Page | Description |
|------|-------------|
| `index.html` | Main countdown + navigation |
| `motivation.html` | Six-pack motivation, truth bombs, roasts, Excuse Destroyer 3000 |
| `leaderboard.html` | Live rankings, achievements, trash talk, weekly trends |
| `challenge.html` | Weekly fitness challenges with scoring |
| `tracker.html` | Personal workout logging, weight tracking, goal setting |
| `shred.html` | 🔥 Secret motivation page |
| `test.html` | 🧪 Automated API test suite (beta only) |

## 🎯 Features

### Personal Tracking
- ✅ Log workouts (type, reps/duration, points)
- ✅ Edit/delete your own workouts
- ✅ Weight tracking with goal types (lose/gain/maintain)
- ✅ Personal workout history with timestamps
- ✅ Weekly workout chart
- ✅ Goal progress visualization

### Social & Competition
- ✅ Live leaderboard with rankings
- ✅ Achievement unlocks
- ✅ Weekly challenges with scoring
- ✅ Trash talk / messaging
- ✅ Streak tracking
- ✅ Team progress stats

### User Experience
- ✅ Name uniqueness enforcement with conflict resolution
- ✅ Styled modals (no browser alerts/prompts)
- ✅ Audio player (Fiji Vibes on most pages, Excuse Destroyer on motivation)
- ✅ Mobile responsive
- ✅ Real-time countdown to June 4, 2026
- ✅ Dark theme with ocean vibes

## 🥚 Easter Eggs

- **Konami Code**: ↑↑↓↓←→←→ on homepage activates SHRED MODE 🔥
- **Hidden Palms**: Three 🌴 hidden on the homepage (click them all!)
- **Secret Code**: Find the code to unlock the hidden panel on the leaderboard
- **Console Messages**: Check the browser console on every page
- **Title Click**: Click the FIJI BOD title for random motivation

## 🛠️ Tech Stack

### Frontend
- Pure HTML/CSS/JS (no build step)
- Responsive design
- Styled modals (no native browser prompts)

### Backend
- Cloudflare Pages (static hosting)
- Cloudflare Worker API (`fijibod-api` / `fijibod-beta-api`)
- D1 Database (SQLite)
- Separate prod/beta environments

### Database Schema
- `users` - profiles, goals, stats, streaks
- `workouts` - exercise logs with edit history
- `challenges` - weekly competitions
- `challenge_entries` - scores
- `messages` - trash talk

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/users` | GET, POST, PUT | User management |
| `/api/workouts` | GET, POST | Log workouts |
| `/api/workouts/:id` | PUT, DELETE | Edit/delete workouts |
| `/api/workouts/by-user` | GET | Personal history |
| `/api/leaderboard` | GET | Rankings |
| `/api/stats` | GET | Global stats |
| `/api/challenges` | GET | List challenges |
| `/api/challenges/active` | GET | Current challenge |
| `/api/challenge-entries` | GET, POST | Challenge scores |
| `/api/messages` | GET, POST | Trash talk |
| `/api/messages/:id` | PUT, DELETE | Edit/delete messages |

## 🧪 Testing

The beta environment includes an automated test suite at `/test.html` covering:

1. Health check
2. User creation
3. Workout logging
4. Weight updates
5. Leaderboard fetch
6. Active challenge
7. Global stats
8. Trash talk posting
9. **Edit workout** ✨
10. **Delete workout** ✨
11. **Goal type setting** ✨
12. **Unauthorized access prevention** ✨

## 🚀 Deployment

### Production
```bash
cd ~/repos/fijibod
npx wrangler pages deploy . --project-name=fijibod --branch=master
```

### Beta
```bash
cd ~/repos/fijibod
npx wrangler pages deploy . --project-name=fijibod-beta --branch=master
```

### Database Updates
If schema changes:
```bash
# Apply migration to production
npx wrangler d1 execute fijibod-db --remote --file=worker/migration.sql

# Apply migration to beta
npx wrangler d1 execute fijibod-beta-db --remote --file=worker/migration.sql
```

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   fijibod.com   │────▶│  Cloudflare     │────▶│  D1 Database    │
│  (Production)   │     │  Pages + Worker │     │  (Production)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ beta.fijibod.com│────▶│  Cloudflare     │────▶│  D1 Database    │
│     (Beta)      │     │  Pages + Worker │     │     (Beta)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 🔐 Security

- Workouts/messages can only be edited/deleted by their owner
- Name conflicts resolved with "Is this you?" modal
- No server-side auth (trust-based for team use)

## 📝 Changelog

### Feb 5, 2026
- Added workout edit/delete functionality
- Added goal type selector (lose/gain/maintain)
- Replaced all browser prompts with styled modals
- Added name uniqueness enforcement
- Added personal workout history view
- Added comprehensive test suite
- Added audio players
- Separated prod/beta environments

## 🏢 About

Built with 🔥 by the TaxHawk Engineering team for our Fiji trip.

**The challenge**: Get beach-ready by June 4th. The competition is friendly but the results are permanent.

---

*Summer bodies are made in winter. Fiji bodies are forged in fire.*
