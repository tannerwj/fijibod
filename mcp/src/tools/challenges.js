import { z } from 'zod';
import { get, post, userName } from '../client.js';

export function registerChallengeTools(server) {
  server.tool(
    'get_active_challenge',
    'Get the current active challenge',
    {},
    async () => {
      const result = await get('/api/challenges/active');
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'join_challenge',
    'Submit a challenge entry',
    {
      challenge_id: z.number(),
      score: z.number(),
      notes: z.string().optional(),
    },
    async ({ challenge_id, score, notes }) => {
      const body = { user_name: userName, challenge_id, score };
      if (notes !== undefined) body.notes = notes;
      const result = await post('/api/challenge-entries', body);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );
}
