import { json, error } from '../lib/response.js';

export async function getChallenges(db) {
  const { results } = await db.prepare('SELECT * FROM challenges ORDER BY week_number').all();
  return json(results);
}

export async function getActiveChallenge(db) {
  const challenge = await db.prepare("SELECT * FROM challenges WHERE date('now') >= start_date AND date('now') <= end_date LIMIT 1").first();
  if (!challenge) {
    return error('No active challenge', 404);
  }

  const { results: participants } = await db.prepare(`
    SELECT DISTINCT u.name
    FROM challenge_entries ce
    JOIN users u ON ce.user_id = u.id
    WHERE ce.challenge_id = ?
  `).bind(challenge.id).all();

  const { results: entries } = await db.prepare(`
    SELECT ce.*, u.name as user_name
    FROM challenge_entries ce
    JOIN users u ON ce.user_id = u.id
    WHERE ce.challenge_id = ?
    ORDER BY ce.score DESC
  `).bind(challenge.id).all();

  return json({
    ...challenge,
    participants: participants.map(p => p.name),
    entries
  });
}

export async function joinChallenge(db, body) {
  if (!body.user_name || !body.challenge_id) {
    return error('user_name and challenge_id required', 400);
  }

  let user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.user_name).first();
  if (!user) {
    await db.prepare('INSERT INTO users (name) VALUES (?)').bind(body.user_name).run();
    user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.user_name).first();
  }

  await db.prepare(
    'INSERT OR REPLACE INTO challenge_entries (challenge_id, user_id, score, notes) VALUES (?, ?, COALESCE((SELECT score FROM challenge_entries WHERE challenge_id = ? AND user_id = ?), 0) + ?, ?)'
  ).bind(body.challenge_id, user.id, body.challenge_id, user.id, body.score || 0, body.notes || '').run();

  return json({ success: true });
}

export async function getChallengeEntries(db, challengeId) {
  if (!challengeId) {
    return error('challenge_id required', 400);
  }

  const { results } = await db.prepare(`
    SELECT ce.*, u.name as user_name
    FROM challenge_entries ce
    JOIN users u ON ce.user_id = u.id
    WHERE ce.challenge_id = ?
    ORDER BY ce.score DESC
  `).bind(challengeId).all();

  return json(results);
}
