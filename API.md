# Fiji Bod API Documentation

Base URL: `https://fijibod-api.twj.workers.dev` (production) or `https://fijibod-beta-api.twj.workers.dev` (beta)

## Users

### List Users
```
GET /api/users
```
Returns array of all users sorted by total_points.

### Create User
```
POST /api/users
Body: { "name": "John", "start_weight": 200, "goal_weight": 180, "goal_type": "lose" }
```
Creates a new user. Returns existing user if name already exists.

### Update User
```
PUT /api/users
Body: { "name": "John", "current_weight": 195, "goal_type": "gain" }
```
Updates weight or goal. Must provide user name for lookup.

## Workouts

### Log Workout
```
POST /api/workouts
Body: { "user_name": "John", "workout_type": "Pushups", "amount": "50 reps" }
```
Creates workout, auto-calculates points. Returns workout with ID.

### Edit Workout
```
PUT /api/workouts/:id
Body: { "user_name": "John", "workout_type": "Pullups", "amount": "20 reps", "created_at": "2026-02-05" }
```
Updates workout type, amount, and optionally date. User must be owner. Recalculates points.

### Delete Workout
```
DELETE /api/workouts/:id?user_name=John
```
Removes workout. User must be owner. Updates user stats.

### Get My Workouts
```
GET /api/workouts/by-user?user_name=John
```
Returns all workouts for a specific user (newest first).

## Leaderboard

### Get Rankings
```
GET /api/leaderboard
```
Returns ranked list with trend analysis (this week vs last week).

### Global Stats
```
GET /api/stats
```
Returns: total_workouts, active_users, longest_streak, total_lbs_progress

## Challenges

### List Challenges
```
GET /api/challenges
```

### Get Active Challenge
```
GET /api/challenges/active
```
Returns challenge + participants + entries.

### Join/Update Score
```
POST /api/challenge-entries
Body: { "user_name": "John", "challenge_id": 1, "score": 500 }
```

## Messages (Trash Talk)

### List Messages
```
GET /api/messages
```
Returns last 20 messages.

### Post Message
```
POST /api/messages
Body: { "user_name": "John", "message": "Crushed my workout today! 🔥" }
```

### Edit Message
```
PUT /api/messages/:id
Body: { "user_name": "John", "message": "Updated message" }
```

### Delete Message
```
DELETE /api/messages/:id?user_name=John
```

## Response Format

All responses are JSON:

```json
{
  "success": true,
  "user": { ... },
  "workout": { ... }
}
```

Errors:
```json
{
  "error": "Description of what went wrong"
}
```

Status codes:
- `200` - Success
- `400` - Bad request (missing fields)
- `403` - Forbidden (not authorized)
- `404` - Not found
- `500` - Server error
