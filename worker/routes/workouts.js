import { json, error } from '../lib/response.js';
import { calculateCurrentStreak } from '../lib/streaks.js';
import { calculatePoints } from '../lib/points.js';

export async function getWorkouts(db) {
  const { results } = await db.prepare(`
    SELECT w.*, u.name as user_name
    FROM workouts w
    JOIN users u ON w.user_id = u.id
    ORDER BY w.created_at DESC
  `).all();
  return json(results);
}

export async function getRecentWorkouts(db) {
  const { results } = await db.prepare(`
    SELECT w.*, u.name as user_name
    FROM workouts w
    JOIN users u ON w.user_id = u.id
    ORDER BY w.created_at DESC
    LIMIT 10
  `).all();
  return json(results);
}

export async function getWorkoutsByUser(db, userName) {
  if (!userName) {
    return error('user_name required', 400);
  }

  const user = await db.prepare('SELECT id FROM users WHERE name = ?').bind(userName).first();
  if (!user) {
    return json([]);
  }

  const { results } = await db.prepare(`
    SELECT w.*, u.name as user_name
    FROM workouts w
    JOIN users u ON w.user_id = u.id
    WHERE w.user_id = ?
    ORDER BY w.created_at DESC
  `).bind(user.id).all();

  return json(results);
}

export async function logWorkout(db, body) {
  if (!body.user_name || !body.workout_type || !body.amount) {
    return error('user_name, workout_type, and amount required', 400);
  }

  let user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.user_name).first();

  if (!user) {
    await db.prepare('INSERT INTO users (name) VALUES (?)').bind(body.user_name).run();
    user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.user_name).first();
  }

  const points = calculatePoints(body.amount);

  const result = await db.prepare(
    'INSERT INTO workouts (user_id, workout_type, amount, points) VALUES (?, ?, ?, ?)'
  ).bind(user.id, body.workout_type, body.amount, points).run();

  await db.prepare(
    'UPDATE users SET total_workouts = total_workouts + 1, total_points = total_points + ? WHERE id = ?'
  ).bind(points, user.id).run();

  const { results: workoutDays } = await db.prepare(
    `SELECT DISTINCT DATE(created_at) as day FROM workouts WHERE user_id = ? ORDER BY day DESC`
  ).bind(user.id).all();

  const streak = calculateCurrentStreak(workoutDays);

  await db.prepare(
    'UPDATE users SET current_streak = ?, longest_streak = MAX(longest_streak, ?) WHERE id = ?'
  ).bind(streak, streak, user.id).run();

  const workout = await db.prepare('SELECT * FROM workouts WHERE id = ?').bind(result.meta.last_row_id).first();

  return json({
    success: true,
    workout: { ...workout, user_name: body.user_name },
    user: await db.prepare('SELECT * FROM users WHERE id = ?').bind(user.id).first()
  });
}

export async function updateWorkout(db, id, body) {
  if (!body.user_name) {
    return error('user_name required for verification', 400);
  }

  const workout = await db.prepare('SELECT w.*, u.name as user_name FROM workouts w JOIN users u ON w.user_id = u.id WHERE w.id = ?').bind(id).first();

  if (!workout) {
    return error('Workout not found', 404);
  }

  if (workout.user_name !== body.user_name) {
    return error('Not authorized to edit this workout', 403);
  }

  const updates = [];
  const values = [];

  if (body.workout_type) {
    updates.push('workout_type = ?');
    values.push(body.workout_type);
  }
  if (body.amount) {
    updates.push('amount = ?');
    values.push(body.amount);
    const points = calculatePoints(body.amount);
    updates.push('points = ?');
    values.push(points);
  }
  if (body.created_at) {
    updates.push('created_at = ?');
    values.push(body.created_at);
  }

  if (updates.length === 0) {
    return error('No fields to update', 400);
  }

  values.push(id);
  await db.prepare(`UPDATE workouts SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();

  const updated = await db.prepare('SELECT * FROM workouts WHERE id = ?').bind(id).first();
  return json({ success: true, workout: updated });
}

export async function deleteWorkout(db, id, userName) {
  if (!userName) {
    return error('user_name required', 400);
  }

  const workout = await db.prepare('SELECT w.*, u.name as user_name FROM workouts w JOIN users u ON w.user_id = u.id WHERE w.id = ?').bind(id).first();

  if (!workout) {
    return error('Workout not found', 404);
  }

  if (workout.user_name !== userName) {
    return error('Not authorized to delete this workout', 403);
  }

  await db.prepare('DELETE FROM workouts WHERE id = ?').bind(id).run();
  await db.prepare('UPDATE users SET total_workouts = total_workouts - 1, total_points = total_points - ? WHERE id = ?').bind(workout.points, workout.user_id).run();

  return json({ success: true });
}
