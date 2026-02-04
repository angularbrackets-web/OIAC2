import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

console.log('=== Testing Admin Authentication ===\n');

// Test 1: Access /admin without auth should redirect to login
console.log('Test 1: Unauthenticated access to /admin');
await page.goto('http://localhost:4321/admin');
console.log('  URL:', page.url());
console.log('  Redirected to login:', page.url().includes('/admin/login') ? 'YES ✓' : 'NO ✗');

await page.screenshot({ path: './auth-test-login.png' });

// Test 2: Login with wrong password
console.log('\nTest 2: Login with wrong password');
await page.fill('input[name="password"]', 'wrongpassword');
await page.click('button[type="submit"]');
await page.waitForLoadState('networkidle');
console.log('  URL:', page.url());
console.log('  Shows error:', page.url().includes('error=invalid') ? 'YES ✓' : 'NO ✗');

// Test 3: Login with correct password
console.log('\nTest 3: Login with correct password');
await page.goto('http://localhost:4321/admin/login');
await page.fill('input[name="password"]', 'oiac-admin-2024');
await page.click('button[type="submit"]');
await page.waitForLoadState('networkidle');
console.log('  URL:', page.url());
console.log('  Reached dashboard:', page.url().endsWith('/admin') || page.url().includes('/admin?') ? 'YES ✓' : 'NO');

await page.screenshot({ path: './auth-test-dashboard.png' });

// Test 4: Check dashboard content
const hasDashboard = await page.$('text=Admin Dashboard');
console.log('  Dashboard content visible:', hasDashboard ? 'YES ✓' : 'NO ✗');

// Test 5: Check logout button exists
const hasLogout = await page.$('a[href="/api/admin/logout"]');
console.log('  Logout button exists:', hasLogout ? 'YES ✓' : 'NO ✗');

// Test 6: Access other admin pages while logged in
console.log('\nTest 4: Access other admin pages while authenticated');
await page.goto('http://localhost:4321/admin/media');
console.log('  /admin/media URL:', page.url());
console.log('  Can access:', !page.url().includes('/login') ? 'YES ✓' : 'NO ✗');

// Test 7: Logout
console.log('\nTest 5: Logout');
await page.goto('http://localhost:4321/api/admin/logout');
await page.waitForLoadState('networkidle');
console.log('  Redirected to login:', page.url().includes('/admin/login') ? 'YES ✓' : 'NO ✗');

// Test 8: After logout, cannot access admin
console.log('\nTest 6: After logout, admin is protected again');
await page.goto('http://localhost:4321/admin');
await page.waitForLoadState('networkidle');
console.log('  Redirected to login:', page.url().includes('/admin/login') ? 'YES ✓' : 'NO ✗');

await browser.close();
console.log('\n=== Test Complete ===');
