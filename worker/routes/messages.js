import { json, error } from '../lib/response.js';

export async function getMessages(db) {
  const { results } = await db.prepare(`
    SELECT m.*, u.name as user_name
    FROM messages m
    JOIN users u ON m.user_id = u.id
    ORDER BY m.created_at DESC
    LIMIT 20
  `).all();
  return json(results);
}

export async function postMessage(db, body) {
  if (!body.user_name || !body.message) {
    return error('user_name and message required', 400);
  }

  let user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.user_name).first();
  if (!user) {
    await db.prepare('INSERT INTO users (name) VALUES (?)').bind(body.user_name).run();
    user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.user_name).first();
  }

  const result = await db.prepare('INSERT INTO messages (user_id, message) VALUES (?, ?)')
    .bind(user.id, body.message).run();

  const message = await db.prepare('SELECT * FROM messages WHERE id = ?').bind(result.meta.last_row_id).first();

  return json({ success: true, message });
}

export async function updateMessage(db, id, body) {
  if (!body.user_name || !body.message) {
    return error('user_name and message required', 400);
  }

  const msg = await db.prepare('SELECT m.*, u.name as user_name FROM messages m JOIN users u ON m.user_id = u.id WHERE m.id = ?').bind(id).first();

  if (!msg) {
    return error('Message not found', 404);
  }

  if (msg.user_name !== body.user_name) {
    return error('Not authorized to edit this message', 403);
  }

  await db.prepare('UPDATE messages SET message = ?, updated_at = datetime("now") WHERE id = ?').bind(body.message, id).run();

  const updated = await db.prepare('SELECT * FROM messages WHERE id = ?').bind(id).first();
  return json({ success: true, message: updated });
}

export async function deleteMessage(db, id, userName) {
  if (!userName) {
    return error('user_name required', 400);
  }

  const msg = await db.prepare('SELECT m.*, u.name as user_name FROM messages m JOIN users u ON m.user_id = u.id WHERE m.id = ?').bind(id).first();

  if (!msg) {
    return error('Message not found', 404);
  }

  if (msg.user_name !== userName) {
    return error('Not authorized to delete this message', 403);
  }

  await db.prepare('DELETE FROM messages WHERE id = ?').bind(id).run();

  return json({ success: true });
}
