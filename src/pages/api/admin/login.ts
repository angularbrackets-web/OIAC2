import type { APIRoute } from 'astro';

const ADMIN_COOKIE_NAME = 'oiac_admin_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Simple hash function for session token (same as middleware)
function createSessionToken(password: string, timestamp: number): string {
  const data = `${password}-${timestamp}-oiac-admin-secret`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36) + '-' + timestamp.toString(36);
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const formData = await request.formData();
    const password = formData.get('password')?.toString() || '';
    const redirectUrl = formData.get('redirect')?.toString() || '/admin';

    // Get the correct password from environment
    const adminPassword = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      // No password configured, just redirect
      return redirect(redirectUrl);
    }

    // Check password
    if (password !== adminPassword) {
      return redirect('/admin/login?error=invalid&redirect=' + encodeURIComponent(redirectUrl));
    }

    // Password correct, create session
    const timestamp = Date.now();
    const sessionToken = createSessionToken(adminPassword, timestamp);

    // Set cookie
    cookies.set(ADMIN_COOKIE_NAME, sessionToken, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000 // in seconds
    });

    return redirect(redirectUrl);
  } catch (error) {
    console.error('Login error:', error);
    return redirect('/admin/login?error=unknown');
  }
};
