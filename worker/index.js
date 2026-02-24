// Fiji Bod API Worker
import { handleOptions } from './lib/cors.js';
import { json, error } from './lib/response.js';
import { getUsers, getUserByName, createUser, updateUser } from './routes/users.js';
import { getWorkouts, getRecentWorkouts, getWorkoutsByUser, logWorkout, updateWorkout, deleteWorkout } from './routes/workouts.js';
import { getLeaderboard, getStats } from './routes/leaderboard.js';
import { getChallenges, getActiveChallenge, joinChallenge, getChallengeEntries } from './routes/challenges.js';
import { getMessages, postMessage, updateMessage, deleteMessage } from './routes/messages.js';
import { recalculateStreaks } from './routes/admin.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const db = env.DB;

    if (method === 'OPTIONS') return handleOptions();

    try {
      // Users
      if (path === '/api/users' && method === 'GET') return getUsers(db);
      if (path === '/api/users' && method === 'POST') return createUser(db, await request.json());
      if (path === '/api/users' && method === 'PUT') return updateUser(db, await request.json());
      if (path.match(/^\/api\/users\/[^/]+$/) && method === 'GET')
        return getUserByName(db, decodeURIComponent(path.split('/')[3]));

      // Workouts
      if (path === '/api/workouts/recent' && method === 'GET') return getRecentWorkouts(db);
      if (path === '/api/workouts/by-user' && method === 'GET')
        return getWorkoutsByUser(db, url.searchParams.get('user_name'));
      if (path === '/api/workouts' && method === 'GET') return getWorkouts(db);
      if (path === '/api/workouts' && method === 'POST') return logWorkout(db, await request.json());
      if (path.match(/^\/api\/workouts\/\d+$/) && method === 'PUT')
        return updateWorkout(db, path.split('/')[3], await request.json());
      if (path.match(/^\/api\/workouts\/\d+$/) && method === 'DELETE')
        return deleteWorkout(db, path.split('/')[3], url.searchParams.get('user_name'));

      // Leaderboard & Stats
      if (path === '/api/leaderboard' && method === 'GET') return getLeaderboard(db);
      if (path === '/api/stats' && method === 'GET') return getStats(db);

      // Challenges
      if (path === '/api/challenges/active' && method === 'GET') return getActiveChallenge(db);
      if (path === '/api/challenges' && method === 'GET') return getChallenges(db);
      if (path === '/api/challenge-entries' && method === 'POST') return joinChallenge(db, await request.json());
      if (path === '/api/challenge-entries' && method === 'GET')
        return getChallengeEntries(db, url.searchParams.get('challenge_id'));

      // Messages
      if (path === '/api/messages' && method === 'GET') return getMessages(db);
      if (path === '/api/messages' && method === 'POST') return postMessage(db, await request.json());
      if (path.match(/^\/api\/messages\/\d+$/) && method === 'PUT')
        return updateMessage(db, path.split('/')[3], await request.json());
      if (path.match(/^\/api\/messages\/\d+$/) && method === 'DELETE')
        return deleteMessage(db, path.split('/')[3], url.searchParams.get('user_name'));

      // Admin
      if (path === '/api/admin/recalculate-streaks' && method === 'POST') return recalculateStreaks(db);

      // Health check
      if (path === '/api/health') return json({ status: 'ok' });

      return error('Not found', 404);
    } catch (e) {
      return error(e.message, 500);
    }
  }
};
