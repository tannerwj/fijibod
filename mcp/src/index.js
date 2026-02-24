import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerWorkoutTools } from './tools/workouts.js';
import { registerUserTools } from './tools/users.js';
import { registerLeaderboardTools } from './tools/leaderboard.js';
import { registerMessageTools } from './tools/messages.js';
import { registerChallengeTools } from './tools/challenges.js';

export async function startServer() {
  const server = new McpServer({ name: 'fijibod', version: '1.0.0' });

  registerWorkoutTools(server);
  registerUserTools(server);
  registerLeaderboardTools(server);
  registerMessageTools(server);
  registerChallengeTools(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
