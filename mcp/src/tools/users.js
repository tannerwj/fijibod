import { z } from 'zod';
import { get, put, userName } from '../client.js';

export function registerUserTools(server) {
  server.tool(
    'get_user',
    'Get user profile',
    { user_name: z.string().optional() },
    async ({ user_name }) => {
      const name = user_name || userName;
      const result = await get(`/api/users/${encodeURIComponent(name)}`);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'update_weight',
    'Update current weight',
    { current_weight: z.number() },
    async ({ current_weight }) => {
      const result = await put('/api/users', { name: userName, current_weight });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'set_goal',
    'Set weight goal',
    {
      goal_weight: z.number(),
      goal_type: z.enum(['lose', 'gain', 'maintain']),
    },
    async ({ goal_weight, goal_type }) => {
      const result = await put('/api/users', { name: userName, goal_weight, goal_type });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );
}
