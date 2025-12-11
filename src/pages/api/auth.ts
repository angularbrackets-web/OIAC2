import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ url, redirect }) => {
  const clientId = import.meta.env.OAUTH_CLIENT_ID;

  if (!clientId) {
    return new Response('OAuth client ID not configured', { status: 500 });
  }

  // Get the origin for the callback URL
  const origin = url.origin;
  const redirectUri = `${origin}/api/callback`;

  // Build GitHub OAuth authorization URL
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'repo,user');

  return redirect(authUrl.toString(), 302);
};
