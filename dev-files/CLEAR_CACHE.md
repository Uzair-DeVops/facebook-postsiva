# Clear Build Cache to Fix "pages is not defined" Error

The error you're seeing is from a cached build. The code has been fixed, but your browser/Next.js is still using old cached code.

## Steps to Fix:

1. **Stop your dev server** (Ctrl+C in the terminal where it's running)

2. **Clear the Next.js build cache:**
   ```bash
   rm -rf .next
   ```

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

4. **Hard refresh your browser:**
   - **Chrome/Edge:** Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - **Firefox:** Ctrl+F5 (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or open DevTools → Right-click refresh button → "Empty Cache and Hard Reload"

The code at line 791 now correctly uses `selectedPage` instead of `pages`, so once the cache is cleared, the error will be gone.
