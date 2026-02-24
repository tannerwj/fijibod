import { z } from 'zod';
import { get } from '../client.js';

export function registerLeaderboardTools(server) {
  server.tool(
    'get_leaderboard',
    'Get the full leaderboard',
    {},
    async () => {
      const result = await get('/api/leaderboard');
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'get_stats',
    'Get overall stats',
    {},
    async () => {
      const result = await get('/api/stats');
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );
}
