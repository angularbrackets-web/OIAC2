# Decap CMS Integration - Handoff Document

**Date:** December 11, 2025
**Session Summary:** Fixed Decap CMS configuration and identified GitHub OAuth permissions issue

---

## Current Status: ✅ 90% Complete

### What's Working
- ✅ Decap CMS loads successfully at https://www.oiacedmonton.ca/admin
- ✅ CMS interface displays with "Login with GitHub" button
- ✅ Manual initialization working correctly (no more config.yml 404 errors)
- ✅ OAuth authentication endpoints are configured and working
- ✅ All 5 content collections configured (jobs, posts, staff, prayer-times, jummah-times)

### What Needs to be Fixed
- ❌ GitHub OAuth app needs organization access approval
- ⚠️ Error: "Repo 'angularbrackets-web/OIAC2' not found" (401 Unauthorized)

---

## Problem Root Cause

**Issue:** GitHub OAuth app doesn't have permission to access the `angularbrackets-web` organization repository.

**Error Message:**
```
TypeError: Repo "angularbrackets-web/OIAC2" not found.
Please ensure the repo information is spelled correctly.
If the repo is private, make sure you're logged into a GitHub account with access.
If your repo is under an organization, ensure the organization has granted access to Decap CMS.
```

**HTTP Status:** 401 Unauthorized from GitHub API

---

## Solution Steps

### Option 1: Grant Organization Access (Recommended - Production Ready)

1. **Find OAuth App:**
   - Go to: https://github.com/settings/developers
   - Click "OAuth Apps" tab
   - Client ID: `Ov23lio2J8gIG8J8ErBW`

2. **Grant Access (if you're org admin):**
   - Go to: https://github.com/organizations/angularbrackets-web/settings/oauth_application_policy
   - Find the Decap CMS OAuth app
   - Click "Grant access" or approve pending request

3. **If not admin:**
   - Contact organization admin to approve the OAuth app
   - Or request access from organization settings

### Option 2: Test with Personal Access Token (Quick Test)

If you need immediate testing:

1. Generate GitHub Personal Access Token:
   - Go to: https://github.com/settings/tokens
   - Create token with `repo` scope

2. Temporarily switch to test-repo backend in `/src/pages/admin.astro`:
   ```javascript
   backend: {
     name: 'test-repo',  // Changed from 'github'
     // Remove other backend fields
   }
   ```

3. Use the token when logging in

---

## Technical Implementation Details

### Files Modified (Last Commit: 4f1d51f)

**Main Fix:**
- `/src/pages/admin.astro` - NEW FILE (Response API approach)
  - Uses raw HTML Response to bypass Astro's script processing
  - Sets `window.CMS_MANUAL_INIT = true` flag
  - Manually initializes CMS with full config object

**Removed:**
- `/src/pages/admin/index.astro` - DELETED (was being stripped by Vercel build)

**OAuth Handlers:**
- `/src/pages/api/auth.ts` - Initiates GitHub OAuth flow
- `/src/pages/api/callback.ts` - Handles OAuth callback

**Public Files (not used in current solution):**
- `/public/admin/index.html` - Updated but not served (SSR mode issue)
- `/public/admin/config.yml` - Original config (not used with manual init)

### Why Previous Approaches Failed

1. **Attempt 1-3:** `/src/pages/admin/index.astro` with `is:inline` directive
   - **Failed:** Vercel build stripped inline scripts completely

2. **Attempt 4:** Using Response API in `/src/pages/admin/index.astro`
   - **Failed:** Scripts still stripped during Vercel build process

3. **Final Solution:** `/src/pages/admin.astro` (single file, not directory)
   - **Success:** Response API works correctly when file is at root level

### Configuration

**Environment Variables (set in Vercel):**
- `OAUTH_CLIENT_ID` - GitHub OAuth app client ID
- `OAUTH_CLIENT_SECRET` - GitHub OAuth app client secret

**CMS Configuration Embedded in `/src/pages/admin.astro`:**
```javascript
{
  backend: {
    name: 'github',
    repo: 'angularbrackets-web/OIAC2',
    branch: 'main',
    base_url: 'https://www.oiacedmonton.ca',
    auth_endpoint: 'api/auth'
  },
  media_folder: 'public/images/uploads',
  public_folder: '/images/uploads',
  collections: [/* 5 collections configured */]
}
```

---

## Verification Steps

After granting organization access, verify:

1. **Access the CMS:**
   ```
   https://www.oiacedmonton.ca/admin
   ```

2. **Check for errors in browser console:**
   - Should see: `window.CMS_MANUAL_INIT flag set, skipping automatic initialization`
   - Should NOT see: config.yml 404 errors

3. **Click "Login with GitHub"**
   - Should redirect to GitHub OAuth
   - After approval, should redirect back to CMS
   - Should see content collections list

4. **Test content editing:**
   - Try viewing/editing existing jobs, posts, staff, etc.
   - Verify changes commit to GitHub

---

## Important Notes

### Astro SSR Routing Behavior
- Files in `/public` are NOT served as routes in SSR mode
- `/src/pages/admin/index.astro` behaves differently than `/src/pages/admin.astro`
- `is:inline` directive does NOT prevent script stripping in production builds
- Response API approach works at page root level but not in subdirectories

### OAuth Flow
- Callback URL: `https://www.oiacedmonton.ca/api/callback`
- Scopes requested: `repo,user`
- Uses postMessage for OAuth popup communication

### Content Structure
All content is stored as JSON files in:
- `src/content/jobs/*.json`
- `src/content/posts/*.json`
- `src/content/staff/*.json`
- `src/content/prayer-times/*.json`
- `src/content/jummah-times/*.json`

---

## Git History (Recent Commits)

```
4f1d51f - Fix Decap CMS by using /admin.astro route with Response API
cd28743 - Fix Decap CMS by using proper Astro template syntax
162166d - Fix Decap CMS config loading with manual initialization
d577048 - Fix Decap CMS routing with explicit Astro routes
03e08b6 - Add Vercel OAuth handlers for Decap CMS
```

---

## Next Session Quick Start

1. Check if organization access has been granted
2. Test login at https://www.oiacedmonton.ca/admin
3. If still 401 error, verify OAuth app settings at https://github.com/settings/developers
4. If working, test creating/editing content
5. Document any additional configuration needed

---

## Support Resources

- Decap CMS Docs: https://decapcms.org/docs/
- GitHub OAuth Apps: https://docs.github.com/en/developers/apps/building-oauth-apps
- Astro SSR: https://docs.astro.build/en/guides/server-side-rendering/

---

**Last Updated:** December 11, 2025
**Status:** Awaiting GitHub organization OAuth approval to complete setup
