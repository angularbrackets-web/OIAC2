import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code');
  const clientId = import.meta.env.OAUTH_CLIENT_ID;
  const clientSecret = import.meta.env.OAUTH_CLIENT_SECRET;

  if (!code) {
    return new Response('No authorization code provided', { status: 400 });
  }

  if (!clientId || !clientSecret) {
    return new Response('OAuth credentials not configured', { status: 500 });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return new Response(`OAuth error: ${tokenData.error_description}`, { status: 400 });
    }

    // Return HTML that posts the message to the parent window (Decap CMS)
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Authorization Success</title>
</head>
<body>
  <script>
    (function() {
      function recieveMessage(e) {
        console.log("receiveMessage %o", e);
        // send message to main window with the token
        window.opener.postMessage(
          'authorization:github:success:${JSON.stringify(tokenData)}',
          e.origin
        );
      }
      window.addEventListener("message", recieveMessage, false);
      // Start handshake with parent
      console.log("Sending message:", "authorizing:github", "*");
      window.opener.postMessage("authorizing:github", "*");
    })();
  </script>
</body>
</html>
`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    return new Response('OAuth callback failed', { status: 500 });
  }
};
