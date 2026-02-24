import { z } from 'zod';
import { get, post, put, del, userName } from '../client.js';

export function registerWorkoutTools(server) {
  server.tool(
    'log_workout',
    'Log a workout',
    { workout_type: z.string(), amount: z.string() },
    async ({ workout_type, amount }) => {
      const result = await post('/api/workouts', { user_name: userName, workout_type, amount });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'get_my_workouts',
    'Get your workout history',
    {},
    async () => {
      const result = await get(`/api/workouts/by-user?user_name=${encodeURIComponent(userName)}`);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'edit_workout',
    'Edit a workout',
    {
      workout_id: z.number(),
      workout_type: z.string().optional(),
      amount: z.string().optional(),
    },
    async ({ workout_id, workout_type, amount }) => {
      const body = { user_name: userName };
      if (workout_type !== undefined) body.workout_type = workout_type;
      if (amount !== undefined) body.amount = amount;
      const result = await put(`/api/workouts/${workout_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'delete_workout',
    'Delete a workout',
    { workout_id: z.number() },
    async ({ workout_id }) => {
      const result = await del(`/api/workouts/${workout_id}?user_name=${encodeURIComponent(userName)}`);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'get_recent_workouts',
    'Get 10 most recent workouts across all users',
    {},
    async () => {
      const result = await get('/api/workouts/recent');
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );
}
