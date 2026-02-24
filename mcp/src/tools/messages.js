import { z } from 'zod';
import { get, post, userName } from '../client.js';

export function registerMessageTools(server) {
  server.tool(
    'post_trash_talk',
    'Post a trash talk message',
    { message: z.string() },
    async ({ message }) => {
      const result = await post('/api/messages', { user_name: userName, message });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'get_messages',
    'Get recent messages',
    {},
    async () => {
      const result = await get('/api/messages');
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );
}
