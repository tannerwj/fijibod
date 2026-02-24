import { json } from '../lib/response.js';
import { calculateCurrentStreak, calculateLongestStreak } from '../lib/streaks.js';

export async function recalculateStreaks(db) {
  const { results: users } = await db.prepare('SELECT id FROM users').all();
  const updated = [];

  for (const user of users) {
    const { results: workoutDays } = await db.prepare(
      'SELECT DISTINCT DATE(created_at) as day FROM workouts WHERE user_id = ? ORDER BY day DESC'
    ).bind(user.id).all();

    const streak = calculateCurrentStreak(workoutDays);
    const longest = calculateLongestStreak(workoutDays);

    await db.prepare(
      'UPDATE users SET current_streak = ?, longest_streak = ? WHERE id = ?'
    ).bind(streak, longest, user.id).run();
    updated.push({ id: user.id, current_streak: streak, longest_streak: longest });
  }

  return json({ success: true, updated });
}
