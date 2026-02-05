// Fiji Bod API Worker
// Handles all data operations for the fitness tracking site

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // API Routes
      if (path === '/api/users' && method === 'GET') {
        return getUsers(env.DB, corsHeaders);
      }
      
      if (path === '/api/users' && method === 'POST') {
        const body = await request.json();
        return createUser(env.DB, body, corsHeaders);
      }

      if (path === '/api/users' && method === 'PUT') {
        const body = await request.json();
        return updateUser(env.DB, body, corsHeaders);
      }

      if (path.match(/^\/api\/users\/[^/]+$/) && method === 'GET') {
        const name = decodeURIComponent(path.split('/')[3]);
        return getUserByName(env.DB, name, corsHeaders);
      }

      if (path === '/api/workouts' && method === 'GET') {
        return getWorkouts(env.DB, corsHeaders);
      }

      if (path === '/api/workouts' && method === 'POST') {
        const body = await request.json();
        return logWorkout(env.DB, body, corsHeaders);
      }

      if (path === '/api/workouts/recent' && method === 'GET') {
        return getRecentWorkouts(env.DB, corsHeaders);
      }

      if (path === '/api/workouts/by-user' && method === 'GET') {
        const userName = url.searchParams.get('user_name');
        return getWorkoutsByUser(env.DB, userName, corsHeaders);
      }

      if (path === '/api/leaderboard' && method === 'GET') {
        return getLeaderboard(env.DB, corsHeaders);
      }

      if (path === '/api/stats' && method === 'GET') {
        return getStats(env.DB, corsHeaders);
      }

      if (path === '/api/challenges' && method === 'GET') {
        return getChallenges(env.DB, corsHeaders);
      }

      if (path === '/api/challenges/active' && method === 'GET') {
        return getActiveChallenge(env.DB, corsHeaders);
      }

      if (path === '/api/challenge-entries' && method === 'POST') {
        const body = await request.json();
        return joinChallenge(env.DB, body, corsHeaders);
      }

      if (path === '/api/challenge-entries' && method === 'GET') {
        const challengeId = url.searchParams.get('challenge_id');
        return getChallengeEntries(env.DB, challengeId, corsHeaders);
      }

      if (path === '/api/messages' && method === 'GET') {
        return getMessages(env.DB, corsHeaders);
      }

      if (path === '/api/messages' && method === 'POST') {
        const body = await request.json();
        return postMessage(env.DB, body, corsHeaders);
      }

      // Health check
      if (path === '/api/health') {
        return new Response(JSON.stringify({ status: 'ok' }), { headers: corsHeaders });
      }

      return new Response(JSON.stringify({ error: 'Not found' }), { 
        status: 404, 
        headers: corsHeaders 
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  }
};

// User operations
async function getUsers(db, headers) {
  const { results } = await db.prepare('SELECT * FROM users ORDER BY total_points DESC').all();
  return new Response(JSON.stringify(results), { headers });
}

async function getUserByName(db, name, headers) {
  const user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(name).first();
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers });
  }
  return new Response(JSON.stringify(user), { headers });
}

async function createUser(db, body, headers) {
  if (!body.name) {
    return new Response(JSON.stringify({ error: 'Name required' }), { status: 400, headers });
  }
  
  try {
    const { success } = await db.prepare(
      'INSERT INTO users (name, start_weight, goal_weight) VALUES (?, ?, ?)'
    ).bind(body.name, body.start_weight || null, body.goal_weight || null).run();
    
    const user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.name).first();
    return new Response(JSON.stringify({ success, name: body.name, user }), { headers });
  } catch (e) {
    if (e.message.includes('UNIQUE')) {
      // Return existing user
      const user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.name).first();
      return new Response(JSON.stringify({ success: true, name: body.name, user, existing: true }), { headers });
    }
    throw e;
  }
}

async function updateUser(db, body, headers) {
  if (!body.name) {
    return new Response(JSON.stringify({ error: 'Name required' }), { status: 400, headers });
  }
  
  let user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.name).first();
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers });
  }
  
  // Build update query dynamically
  const updates = [];
  const values = [];
  
  if (body.current_weight !== undefined) {
    updates.push('current_weight = ?');
    values.push(body.current_weight);
    // Set start_weight if not already set
    if (user.start_weight === null) {
      updates.push('start_weight = ?');
      values.push(body.current_weight);
    }
  }
  if (body.goal_weight !== undefined) {
    updates.push('goal_weight = ?');
    values.push(body.goal_weight);
  }
  
  if (updates.length === 0) {
    return new Response(JSON.stringify({ error: 'No fields to update' }), { status: 400, headers });
  }
  
  values.push(user.id);
  await db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  
  user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(user.id).first();
  return new Response(JSON.stringify({ success: true, user }), { headers });
}

// Workout operations
async function getWorkouts(db, headers) {
  const { results } = await db.prepare(`
    SELECT w.*, u.name as user_name 
    FROM workouts w 
    JOIN users u ON w.user_id = u.id 
    ORDER BY w.created_at DESC
  `).all();
  return new Response(JSON.stringify(results), { headers });
}

async function getRecentWorkouts(db, headers) {
  const { results } = await db.prepare(`
    SELECT w.*, u.name as user_name 
    FROM workouts w 
    JOIN users u ON w.user_id = u.id 
    ORDER BY w.created_at DESC 
    LIMIT 10
  `).all();
  return new Response(JSON.stringify(results), { headers });
}

async function getWorkoutsByUser(db, userName, headers) {
  if (!userName) {
    return new Response(JSON.stringify({ error: 'user_name required' }), { status: 400, headers });
  }
  
  const user = await db.prepare('SELECT id FROM users WHERE name = ?').bind(userName).first();
  if (!user) {
    return new Response(JSON.stringify([]), { headers });
  }
  
  const { results } = await db.prepare(`
    SELECT w.*, u.name as user_name 
    FROM workouts w 
    JOIN users u ON w.user_id = u.id 
    WHERE w.user_id = ?
    ORDER BY w.created_at DESC
  `).bind(user.id).all();
  
  return new Response(JSON.stringify(results), { headers });
}

async function logWorkout(db, body, headers) {
  if (!body.user_name || !body.workout_type || !body.amount) {
    return new Response(JSON.stringify({ error: 'user_name, workout_type, and amount required' }), { 
      status: 400, 
      headers 
    });
  }

  // Get or create user
  let user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.user_name).first();
  
  if (!user) {
    await db.prepare('INSERT INTO users (name) VALUES (?)').bind(body.user_name).run();
    user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.user_name).first();
  }

  // Calculate points
  let points = 10;
  if (body.amount.includes('reps')) {
    const num = parseInt(body.amount);
    if (!isNaN(num)) points = Math.floor(num / 10);
  }

  // Insert workout
  await db.prepare(
    'INSERT INTO workouts (user_id, workout_type, amount, points) VALUES (?, ?, ?, ?)'
  ).bind(user.id, body.workout_type, body.amount, points).run();

  // Update user stats
  await db.prepare(
    'UPDATE users SET total_workouts = total_workouts + 1, total_points = total_points + ? WHERE id = ?'
  ).bind(points, user.id).run();

  return new Response(JSON.stringify({ 
    success: true, 
    workout: { user_name: body.user_name, workout_type: body.workout_type, amount: body.amount, points },
    user
  }), { headers });
}

// Leaderboard
async function getLeaderboard(db, headers) {
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
  
  // Add ranks and calculate trend (comparing this week vs last week)
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
  
  return new Response(JSON.stringify(ranked), { headers });
}

// Stats
async function getStats(db, headers) {
  const { results: stats } = await db.prepare(`
    SELECT 
      (SELECT COUNT(*) FROM workouts) as total_workouts,
      (SELECT COUNT(DISTINCT user_id) FROM workouts) as active_users,
      (SELECT MAX(current_streak) FROM users) as longest_streak,
      (SELECT COALESCE(SUM(CASE WHEN start_weight > current_weight THEN start_weight - current_weight ELSE 0 END), 0) FROM users WHERE current_weight IS NOT NULL) as total_lbs_lost
  `).all();

  return new Response(JSON.stringify(stats[0] || {}), { headers });
}

// Challenges
async function getChallenges(db, headers) {
  const { results } = await db.prepare('SELECT * FROM challenges ORDER BY week_number').all();
  return new Response(JSON.stringify(results), { headers });
}

async function getActiveChallenge(db, headers) {
  const challenge = await db.prepare('SELECT * FROM challenges WHERE is_active = 1 LIMIT 1').first();
  if (!challenge) {
    return new Response(JSON.stringify({ error: 'No active challenge' }), { status: 404, headers });
  }
  
  // Get participants
  const { results: participants } = await db.prepare(`
    SELECT DISTINCT u.name 
    FROM challenge_entries ce
    JOIN users u ON ce.user_id = u.id
    WHERE ce.challenge_id = ?
  `).bind(challenge.id).all();
  
  // Get entries
  const { results: entries } = await db.prepare(`
    SELECT ce.*, u.name as user_name
    FROM challenge_entries ce
    JOIN users u ON ce.user_id = u.id
    WHERE ce.challenge_id = ?
    ORDER BY ce.score DESC
  `).bind(challenge.id).all();
  
  return new Response(JSON.stringify({
    ...challenge,
    participants: participants.map(p => p.name),
    entries
  }), { headers });
}

async function joinChallenge(db, body, headers) {
  if (!body.user_name || !body.challenge_id) {
    return new Response(JSON.stringify({ error: 'user_name and challenge_id required' }), { 
      status: 400, 
      headers 
    });
  }
  
  let user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.user_name).first();
  if (!user) {
    await db.prepare('INSERT INTO users (name) VALUES (?)').bind(body.user_name).run();
    user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.user_name).first();
  }
  
  await db.prepare(
    'INSERT OR REPLACE INTO challenge_entries (challenge_id, user_id, score, notes) VALUES (?, ?, COALESCE((SELECT score FROM challenge_entries WHERE challenge_id = ? AND user_id = ?), 0) + ?, ?)'
  ).bind(body.challenge_id, user.id, body.challenge_id, user.id, body.score || 0, body.notes || '').run();
  
  return new Response(JSON.stringify({ success: true }), { headers });
}

async function getChallengeEntries(db, challengeId, headers) {
  if (!challengeId) {
    return new Response(JSON.stringify({ error: 'challenge_id required' }), { status: 400, headers });
  }
  
  const { results } = await db.prepare(`
    SELECT ce.*, u.name as user_name
    FROM challenge_entries ce
    JOIN users u ON ce.user_id = u.id
    WHERE ce.challenge_id = ?
    ORDER BY ce.score DESC
  `).bind(challengeId).all();
  
  return new Response(JSON.stringify(results), { headers });
}

// Messages/Trash talk
async function getMessages(db, headers) {
  const { results } = await db.prepare(`
    SELECT m.*, u.name as user_name
    FROM messages m
    JOIN users u ON m.user_id = u.id
    ORDER BY m.created_at DESC
    LIMIT 20
  `).all();
  return new Response(JSON.stringify(results), { headers });
}

async function postMessage(db, body, headers) {
  if (!body.user_name || !body.message) {
    return new Response(JSON.stringify({ error: 'user_name and message required' }), { 
      status: 400, 
      headers 
    });
  }
  
  let user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.user_name).first();
  if (!user) {
    await db.prepare('INSERT INTO users (name) VALUES (?)').bind(body.user_name).run();
    user = await db.prepare('SELECT * FROM users WHERE name = ?').bind(body.user_name).first();
  }
  
  await db.prepare('INSERT INTO messages (user_id, message) VALUES (?, ?)')
    .bind(user.id, body.message).run();
  
  return new Response(JSON.stringify({ success: true }), { headers });
}
