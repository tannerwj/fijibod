import { json } from '../lib/response.js';

export async function getLeaderboard(db) {
  const { results } = await db.prepare(`
    SELECT
      u.id,
      u.name,
      u.total_points as score,
      u.total_workouts,
      u.current_streak,
      (SELECT COUNT(*) FROM workouts WHERE user_id = u.id AND created_at > date('now', '-7 days')) as this_week,
      (SELECT COUNT(*) FROM workouts WHERE user_id = u.id AND created_at > date('now', '-14 days') AND created_at <= date('now', '-7 days')) as last_week
    FROM users u
    WHERE u.total_workouts > 0
    ORDER BY u.total_points DESC
  `).all();

  const ranked = results.map((u, i) => {
    let trend = 'same';
    if (u.this_week > u.last_week) trend = 'up';
    else if (u.this_week < u.last_week) trend = 'down';

    return {
      ...u,
      rank: i + 1,
      trend,
      trend_info: `${u.this_week} this week vs ${u.last_week} last week`
    };
  });

  return json(ranked);
}

export async function getStats(db) {
  const { results: stats } = await db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM workouts) as total_workouts,
      (SELECT COUNT(DISTINCT user_id) FROM workouts) as active_users,
      (SELECT MAX(longest_streak) FROM users) as longest_streak,
      (SELECT
        COALESCE(SUM(
          CASE
            WHEN goal_type = 'gain' AND current_weight > start_weight THEN current_weight - start_weight
            WHEN goal_type = 'lose' AND start_weight > current_weight THEN start_weight - current_weight
            ELSE 0
          END
        ), 0)
        FROM users
        WHERE current_weight IS NOT NULL AND start_weight IS NOT NULL
      ) as total_lbs_progress
  `).all();

  return json(stats[0] || {});
}
