# Auth Flow Diagrams

## 1. Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    APP INITIALIZATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. App mounts (layout.tsx)                                    │
│     ↓                                                           │
│  2. AuthProvider wraps app                                     │
│     ↓                                                           │
│  3. Session hydration starts                                   │
│     ├─ Check localStorage for access_token                    │
│     ├─ If found, validate with GET /auth/me                   │
│     ├─ Check Facebook token: GET /oauth/tokens?platform=fb   │
│     └─ Set isHydrated = true                                  │
│     ↓                                                           │
│  4. App renders with auth state                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Login Flow (Email/Password)

```
START: /login page loads
    ↓
┌─────────────────────────────────┐
│ User enters email & password    │
│ Clicks "Sign In"                │
└──────────────┬──────────────────┘
               ↓
        ┌──────────────────────────────────────┐
        │ POST /auth/login                     │
        │ { email, password }                  │
        └──────────┬───────────────────────────┘
                   ↓
            ✓ Valid credentials?
            ├─ YES ─→ Backend returns access_token
            └─ NO  ─→ Show error, stay on /login
                   ↓
        ┌──────────────────────────────────────┐
        │ Store token in localStorage          │
        │ Set user state in context            │
        └──────────┬───────────────────────────┘
                   ↓
        ┌──────────────────────────────────────┐
        │ GET /oauth/tokens?platform=facebook  │
        │ Check if user has Facebook token     │
        └──────────┬───────────────────────────┘
                   ↓
          ✓ Has Facebook token?
          ├─ YES ─→ router.push('/dashboard')
          └─ NO  ─→ router.push('/facebook-connect')
                   ↓
              END: Redirected
```

---

## 3. Google OAuth Flow

```
START: /login page
    ↓
┌─────────────────────────────────┐
│ User clicks                     │
│ "Continue with Google"          │
└──────────────┬──────────────────┘
               ↓
    ┌──────────────────────────────────────────┐
    │ Redirect to:                             │
    │ /auth/google/login?redirect_uri=/callback│
    └──────────┬───────────────────────────────┘
               ↓
    ┌──────────────────────────────────────────┐
    │ Google OAuth Consent Screen              │
    │ User approves permissions                │
    └──────────┬───────────────────────────────┘
               ↓
    ┌──────────────────────────────────────────┐
    │ Google redirects to:                     │
    │ /auth/google/callback?code=XXX&state=YYY│
    └──────────┬───────────────────────────────┘
               ↓
    ┌──────────────────────────────────────────┐
    │ Backend exchanges code for token         │
    │ Returns access_token & user info         │
    └──────────┬───────────────────────────────┘
               ↓
    ┌──────────────────────────────────────────┐
    │ Store token in localStorage              │
    │ & HTTP-only cookie                       │
    └──────────┬───────────────────────────────┘
               ↓
    ┌──────────────────────────────────────────┐
    │ Check Facebook token status              │
    │ GET /oauth/tokens?platform=facebook      │
    └──────────┬───────────────────────────────┘
               ↓
        ✓ Has Facebook token?
        ├─ YES ─→ Redirect to /dashboard
        └─ NO  ─→ Redirect to /facebook-connect
               ↓
           END: Conditional redirect
```

---

## 4. Facebook Connection Flow

```
START: /facebook-connect page
    ↓
┌──────────────────────────────────────────┐
│ User sees Facebook connection UI         │
│ Clicks "Connect Facebook" button         │
└─────────────┬──────────────────────────┘
              ↓
   ┌─────────────────────────────────────────┐
   │ POST /oauth/facebook/create-token       │
   │ (with Bearer token in header)           │
   └─────────────┬──────────────────────────┘
                 ↓
   ┌─────────────────────────────────────────┐
   │ Backend generates OAuth URL:            │
   │ https://www.facebook.com/dialog/oauth?..│
   │ Returns { auth_url, state, ... }        │
   └─────────────┬──────────────────────────┘
                 ↓
   ┌─────────────────────────────────────────┐
   │ window.location.href = auth_url         │
   │ Redirect to Facebook                    │
   └─────────────┬──────────────────────────┘
                 ↓
   ┌─────────────────────────────────────────┐
   │ Facebook Permissions Screen             │
   │ "...wants access to:"                   │
   │ ✓ Pages you manage                      │
   │ ✓ Page insights and stats               │
   │ ✓ Publish to your pages                 │
   └─────────────┬──────────────────────────┘
                 ↓
   ┌─────────────────────────────────────────┐
   │ User clicks "Continue" or "Allow"       │
   └─────────────┬──────────────────────────┘
                 ↓
   ┌─────────────────────────────────────────┐
   │ Facebook redirects back to backend:     │
   │ /facebook/oauth/callback?code=XXX       │
   └─────────────┬──────────────────────────┘
                 ↓
   ┌─────────────────────────────────────────┐
   │ Backend exchanges code for:             │
   │ • User access token                     │
   │ • Managed pages list                    │
   │ Stores in database                      │
   └─────────────┬──────────────────────────┘
                 ↓
   ┌─────────────────────────────────────────┐
   │ Redirect to /dashboard                  │
   └─────────────┬──────────────────────────┘
                 ↓
           END: Connected & in dashboard
```

---

## 5. Session Persistence

```
┌────────────────────────────────────────────┐
│ User on /dashboard                         │
│ Refreshes page (F5)                        │
└─────────────┬──────────────────────────────┘
              ↓
   ┌──────────────────────────────────────────┐
   │ App remounts                             │
   │ AuthProvider hydration runs              │
   └─────────────┬──────────────────────────┘
                 ↓
   ┌──────────────────────────────────────────┐
   │ Check localStorage:                      │
   │ • access_token exists? ✓                 │
   │ • user_info exists? ✓                    │
   └─────────────┬──────────────────────────┘
                 ↓
   ┌──────────────────────────────────────────┐
   │ Validate token with GET /auth/me         │
   │ ✓ Still valid? → Continue                │
   │ ✗ Expired? → Clear & redirect to /login  │
   └─────────────┬──────────────────────────┘
                 ↓
   ┌──────────────────────────────────────────┐
   │ Set isHydrated = true                    │
   │ Render dashboard with auth context       │
   └─────────────┬──────────────────────────┘
                 ↓
        ✓ NO login required
        Dashboard renders immediately
             ↓
           SUCCESS
```

---

## 6. Route Protection

```
START: User tries to access protected route
    ↓
   ┌──────────────────────────────────────────┐
   │ Dashboard Layout renders                 │
   └─────────────┬──────────────────────────┘
                 ↓
   ┌──────────────────────────────────────────┐
   │ Check: if (!isHydrated) {                │
   │   return <LoadingSpinner />              │
   │ }                                        │
   └─────────────┬──────────────────────────┘
                 ↓
              Show spinner
              while loading...
                 ↓
   ┌──────────────────────────────────────────┐
   │ Hydration complete                       │
   │ Check: if (!user) {                      │
   │   router.push('/login')                  │
   │   return null                            │
   │ }                                        │
   └─────────────┬──────────────────────────┘
                 ↓
        ✓ User authenticated?
        ├─ YES ─→ Render dashboard
        └─ NO  ─→ Redirect to /login
                 ↓
        NO flash of content!
        Smooth user experience
             ↓
           SUCCESS
```

---

## 7. State Management Timeline

```
PHASE 1: APP MOUNT
┌─────────────────────────────┐
│ isHydrated: false           │
│ user: null                  │
│ isLoading: true             │
│ hasFacebookToken: false     │
└────────┬────────────────────┘
         ↓ [1-2 seconds]
         
PHASE 2: CHECKING SESSION
┌─────────────────────────────┐
│ isHydrated: false           │
│ user: null (checking...)    │
│ isLoading: true             │
│ hasFacebookToken: false     │
└────────┬────────────────────┘
         ↓ [API calls]
         
PHASE 3: SESSION FOUND
┌─────────────────────────────┐
│ isHydrated: false           │
│ user: { email, name, ... }  │
│ isLoading: true             │
│ hasFacebookToken: checking..│
└────────┬────────────────────┘
         ↓ [FB token check]
         
PHASE 4: READY TO RENDER
┌─────────────────────────────┐
│ isHydrated: true ✓          │
│ user: { email, name, ... }  │
│ isLoading: false ✓          │
│ hasFacebookToken: true/false│
└────────┬────────────────────┘
         ↓
    RENDER WITH
    AUTH CONTEXT
```

---

## 8. localStorage Structure

```
┌────────────────────────────────────┐
│        localStorage Keys           │
├────────────────────────────────────┤
│                                    │
│ access_token:                      │
│ "eyJhbGciOiJIUzI1NiIsInR5cCI..."   │
│                                    │
│ user_info:                         │
│ {                                  │
│   "email": "uzair1@postiva.com",   │
│   "username": "uzair",             │
│   "full_name": "Uzair",            │
│   "id": "cb02da6e-3715-...",       │
│   "is_active": true                │
│ }                                  │
│                                    │
└────────────────────────────────────┘
```

---

## 9. API Call Sequence

```
LOGIN REQUEST:
┌─────────────────────────────────────────┐
│ 1. POST /auth/login                     │
│    ↓                                    │
│ 2. GET /auth/me (validate token)        │
│    ↓                                    │
│ 3. GET /oauth/tokens?platform=facebook  │
│    ↓ (3 API calls total)                │
│ Conditional redirect based on #3       │
└─────────────────────────────────────────┘

SESSION HYDRATION:
┌─────────────────────────────────────────┐
│ 1. GET /auth/me                         │
│    ↓                                    │
│ 2. GET /oauth/tokens?platform=facebook  │
│    ↓ (2 API calls on mount)             │
│ Set isHydrated = true                   │
└─────────────────────────────────────────┘

FACEBOOK CONNECTION:
┌─────────────────────────────────────────┐
│ 1. POST /oauth/facebook/create-token    │
│    ↓                                    │
│ Returns auth_url                        │
│    ↓                                    │
│ 2. User approves on Facebook            │
│    ↓                                    │
│ 3. Backend callback processes token     │
│    ↓ (3 external redirects + 1 API)     │
│ User now has Facebook token             │
└─────────────────────────────────────────┘
```

---

## 10. Error Handling Paths

```
LOGIN ERROR SCENARIOS:

1. Invalid Credentials
   POST /auth/login fails
   ↓
   Show: "Invalid email or password"
   ↓
   Stay on /login page

2. Network Error
   POST /auth/login timeout
   ↓
   Show: "Connection failed, please try again"
   ↓
   Allow retry

3. Expired Token
   GET /auth/me returns 401
   ↓
   Clear localStorage
   ↓
   Show: "Session expired, please login again"
   ↓
   Redirect to /login

4. Facebook Token Check Fails
   GET /oauth/tokens returns error
   ↓
   Treat as no token
   ↓
   Redirect to /facebook-connect

5. Google OAuth Error
   Google returns error parameter
   ↓
   Show: "Google authentication failed"
   ↓
   Redirect to /login
```

---

## Summary

- **Fast hydration**: Checks session once on mount
- **Minimal API calls**: Combines requests efficiently
- **No rerenders**: Context updates only on auth changes
- **Session persistent**: localStorage keeps user logged in
- **Error handling**: Comprehensive error scenarios covered
- **User experience**: Loading states, smooth redirects

