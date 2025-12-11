import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const GET: APIRoute = () => {
  // Read the config.yml file from the public directory
  const configPath = path.join(process.cwd(), 'public', 'admin', 'config.yml');
  const configContent = fs.readFileSync(configPath, 'utf-8');

  return new Response(configContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/yaml',
      'Cache-Control': 'no-cache',
    },
  });
};
