import type { APIRoute } from 'astro';

const ADMIN_COOKIE_NAME = 'oiac_admin_session';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  // Clear the session cookie
  cookies.delete(ADMIN_COOKIE_NAME, { path: '/' });
  return redirect('/admin/login');
};

export const GET: APIRoute = async ({ cookies, redirect }) => {
  // Also support GET for simple logout links
  cookies.delete(ADMIN_COOKIE_NAME, { path: '/' });
  return redirect('/admin/login');
};
