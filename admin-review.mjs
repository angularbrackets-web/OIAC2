import { chromium } from 'playwright';

const BASE = 'https://oiacedmonton.ca';
const PASSWORD = 'OIAC_ADMIN';
const SCREENSHOTS_DIR = './admin-screenshots';

const ADMIN_PAGES = [
  { name: '01-login', path: '/admin/login' },
  { name: '02-dashboard', path: '/admin' },
  { name: '03-slideshow', path: '/admin/slideshow' },
  { name: '04-posters', path: '/admin/posters' },
  { name: '05-newcentre-updates', path: '/admin/newcentre-updates' },
  { name: '06-jobs', path: '/admin/jobs' },
  { name: '07-staff', path: '/admin/staff' },
  { name: '08-prayer-times', path: '/admin/prayer-times' },
  { name: '09-jummah-times', path: '/admin/jummah-times' },
  { name: '10-media', path: '/admin/media' },
  { name: '11-feedback', path: '/admin/feedback' },
];

async function run() {
  const browser = await chromium.launch();

  // Desktop viewport
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopContext.newPage();

  // Mobile viewport
  const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mobilePage = await mobileContext.newPage();

  // Screenshot login page first (before auth)
  console.log('Capturing login page...');
  await desktopPage.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
  await desktopPage.screenshot({ path: `${SCREENSHOTS_DIR}/01-login-desktop.png`, fullPage: true });

  await mobilePage.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: `${SCREENSHOTS_DIR}/01-login-mobile.png`, fullPage: true });

  // Login
  console.log('Logging in...');
  await desktopPage.fill('input[name="password"]', PASSWORD);
  await desktopPage.click('button[type="submit"]');
  await desktopPage.waitForURL('**/admin', { timeout: 15000 });
  console.log('Logged in successfully on desktop');

  // Get cookies and set them for mobile
  const cookies = await desktopContext.cookies();
  await mobileContext.addCookies(cookies);

  // Screenshot each admin page
  for (const page of ADMIN_PAGES) {
    if (page.name === '01-login') continue; // Already captured

    console.log(`Capturing ${page.name}...`);

    // Desktop
    await desktopPage.goto(`${BASE}${page.path}`, { waitUntil: 'networkidle', timeout: 20000 });
    await desktopPage.waitForTimeout(2000); // Wait for JS-rendered content
    await desktopPage.screenshot({ path: `${SCREENSHOTS_DIR}/${page.name}-desktop.png`, fullPage: true });

    // Mobile
    await mobilePage.goto(`${BASE}${page.path}`, { waitUntil: 'networkidle', timeout: 20000 });
    await mobilePage.waitForTimeout(2000);
    await mobilePage.screenshot({ path: `${SCREENSHOTS_DIR}/${page.name}-mobile.png`, fullPage: true });
  }

  // Also capture mobile nav open state
  console.log('Capturing mobile nav open...');
  await mobilePage.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.click('.mobile-menu-btn');
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: `${SCREENSHOTS_DIR}/12-mobile-nav-open.png`, fullPage: true });

  // Desktop nav overflow test at smaller desktop size
  const narrowContext = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const narrowPage = await narrowContext.newPage();
  await narrowContext.addCookies(cookies);
  await narrowPage.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
  await narrowPage.waitForTimeout(2000);
  await narrowPage.screenshot({ path: `${SCREENSHOTS_DIR}/13-narrow-desktop-nav.png`, fullPage: true });

  await browser.close();
  console.log('Done! Screenshots saved to', SCREENSHOTS_DIR);
}

run().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
