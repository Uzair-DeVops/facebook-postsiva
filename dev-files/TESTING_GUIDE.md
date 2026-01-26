# Quick Testing Guide - Auth Implementation

## Credentials for Testing

```
Email: uzair1@postiva.com
Password: 123123123
Backend: https://backend.postsiva.com
Frontend: http://localhost:3000
```

## Test Scenarios

### 1️⃣ Email/Password Login Flow
**Scenario:** User logs in with email and password
```
Steps:
1. Go to http://localhost:3000/login
2. Enter email: uzair1@postiva.com
3. Enter password: 123123123
4. Click "Sign In"

Expected:
- If NO Facebook token → Redirect to /facebook-connect
- If YES Facebook token → Redirect to /dashboard
- Session stored in localStorage
```

### 2️⃣ Google OAuth Flow
**Scenario:** User logs in with Google
```
Steps:
1. Go to http://localhost:3000/login
2. Click "Continue with Google"
3. Complete Google authentication
4. Return to app

Expected:
- Redirects to http://localhost:3000/auth/google/callback
- Exchanges Google code for backend tokens
- Checks Facebook token status
- Redirects to /facebook-connect or /dashboard
```

### 3️⃣ Facebook Connection Flow
**Scenario:** User connects their Facebook account
```
Steps:
1. Login successfully (if no Facebook token → on /facebook-connect page)
2. Click "Connect Facebook"
3. Approve Facebook permissions
4. Facebook redirects to backend

Expected:
- Facebook OAuth URL opens: https://www.facebook.com/dialog/oauth?...
- After approval, redirects back
- Dashboard shows connected Facebook account
```

### 4️⃣ Session Persistence
**Scenario:** User stays logged in after refresh
```
Steps:
1. Login successfully
2. Refresh the page (F5 or Cmd+R)
3. Check localStorage

Expected:
- No login required
- Session hydrates from localStorage
- access_token and user_info preserved
- Page loads normally
```

### 5️⃣ Route Protection
**Scenario:** Unauthenticated user tries to access dashboard
```
Steps:
1. Clear localStorage (DevTools)
2. Try to access http://localhost:3000/dashboard
3. Observe redirect

Expected:
- Redirected to /login
- Cannot access /dashboard without auth
- Loading spinner shows briefly during auth check
```

### 6️⃣ Facebook Disconnect Scenario
**Scenario:** User without Facebook token sees connect page
```
Steps:
1. Login to account without Facebook token
2. After login

Expected:
- Redirects to /facebook-connect
- Shows "Connect Your Facebook Account" page
- Has option to skip or connect
```

### 7️⃣ Session Expiry
**Scenario:** Access token expires during usage
```
Steps:
1. Login successfully
2. Wait 24+ hours (or manually expire token in localStorage)
3. Try to access protected resource

Expected:
- Auth context detects invalid token
- Redirects to /login
- Error message shown (if applicable)
```

### 8️⃣ Signup Flow
**Scenario:** New user creates account
```
Steps:
1. Go to http://localhost:3000/signup
2. Enter:
   - Full Name: John Doe
   - Email: test@example.com
   - Password: SecurePassword123
3. Click "Get Started Free"

Expected:
- Account created
- Auto-logged in
- Redirects to /facebook-connect (no Facebook token)
```

---

## Checking localStorage

Open DevTools (F12) and check:
```javascript
// In Console:
localStorage.getItem('access_token')      // JWT token
localStorage.getItem('user_info')         // { email, username, full_name, id }

// Check expiry
const decoded = JSON.parse(atob(token.split('.')[1]))
new Date(decoded.exp * 1000)  // Expiry date
```

---

## API Debugging

### Check Login Response
```bash
curl -X POST https://backend.postsiva.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "uzair1@postiva.com",
    "password": "123123123"
  }'
```

### Check Facebook Token Status
```bash
curl -X GET "https://backend.postsiva.com/oauth/tokens?platform=facebook" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Check Current User
```bash
curl -X GET "https://backend.postsiva.com/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Common Issues & Solutions

### ❌ "Invalid email or password"
**Solution:** Check that you're using correct credentials
```
uzair1@postiva.com (not postiva.com)
password: 123123123
```

### ❌ Redirect loop between login and facebook-connect
**Solution:** Facebook token might be expired
- Clear localStorage
- Login again
- Complete Facebook connection

### ❌ "Session expired" after refresh
**Solution:** Token may have expired
- Check token expiry in localStorage
- Login again

### ❌ Google OAuth not working
**Solution:** Check redirect URI matches backend configuration
- Backend expects: http://localhost:3000/auth/google/callback
- Update in Google Cloud Console if needed

### ❌ Facebook connection not saving
**Solution:** Ensure token is being stored in localStorage
- Check `/auth/google/callback` route handler
- Verify backend returning auth_url correctly

---

## Expected Behavior Timeline

```
1. User opens /login
   ↓
2. AuthContext hydrates session (1-2 seconds)
   ↓
3. User logs in or uses Google/Facebook OAuth
   ↓
4. Backend returns access_token
   ↓
5. Token stored in localStorage
   ↓
6. AuthContext checks Facebook token status
   ↓
7. Conditional redirect:
   - No Facebook token → /facebook-connect
   - Has Facebook token → /dashboard
   ↓
8. Dashboard protected route checks auth
   ↓
9. User can interact with dashboard features
```

---

## Performance Metrics

Monitor these in DevTools (Performance tab):

- **Auth Hydration:** < 500ms
- **Login Response:** < 1 second
- **Redirect:** < 100ms
- **Page Load:** < 2 seconds total

---

## Rollback Instructions

If something breaks:

1. **Revert AuthContext:**
   ```bash
   git checkout src/lib/hooks/auth/AuthContext.tsx
   ```

2. **Revert Layout:**
   ```bash
   git checkout src/app/layout.tsx
   ```

3. **Clear localStorage in browser:**
   ```javascript
   localStorage.clear()
   ```

4. **Hard reload:**
   ```
   Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   ```

---

## Next Phase: Integration with Dashboard

After confirming auth works:
1. Add logout button to sidebar
2. Connect to post creation hooks
3. Integrate media upload
4. Add Facebook page selection
5. Implement post scheduling

See `AUTH_IMPLEMENTATION.md` for complete details.
