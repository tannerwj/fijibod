import { json, error } from '../lib/response.js';

export async function getUsers(db) {
  const { results } = await db.prepare('SELECT * FROM users ORDER BY total_points DESC').all();
  return json(results);
}

export async function getUserByName(db, name) {
  const user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(name).first();
  if (!user) {
    return error('User not found', 404);
  }
  return json(user);
}

export async function createUser(db, body) {
  if (!body.name) {
    return error('Name required', 400);
  }

  try {
    const { success } = await db.prepare(
      'INSERT INTO users (name, start_weight, goal_weight, goal_type) VALUES (?, ?, ?, ?)'
    ).bind(body.name, body.start_weight || null, body.goal_weight || null, body.goal_type || 'lose').run();

    const user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.name).first();
    return json({ success, name: body.name, user });
  } catch (e) {
    if (e.message.includes('UNIQUE')) {
      const user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.name).first();
      return json({ success: true, name: body.name, user, existing: true });
    }
    throw e;
  }
}

export async function updateUser(db, body) {
  if (!body.name) {
    return error('Name required', 400);
  }

  let user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.name).first();
  if (!user) {
    return error('User not found', 404);
  }

  const updates = [];
  const values = [];

  if (body.current_weight !== undefined) {
    updates.push('current_weight = ?');
    values.push(body.current_weight);
    if (user.start_weight === null) {
      updates.push('start_weight = ?');
      values.push(body.current_weight);
    }
  }
  if (body.goal_weight !== undefined) {
    updates.push('goal_weight = ?');
    values.push(body.goal_weight);
  }
  if (body.goal_type !== undefined) {
    updates.push('goal_type = ?');
    values.push(body.goal_type);
  }

  if (updates.length === 0) {
    return error('No fields to update', 400);
  }

  values.push(user.id);
  await db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();

  user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(user.id).first();
  return json({ success: true, user });
}
