# Expo API Routes - Troubleshooting Guide

## Current Configuration

Your virtual try-on feature now uses **Expo API Routes** (NOT Supabase Edge Functions).

### What Changed

1. **app.json** - Added origin configuration:

```json
"plugins": [
  [
    "expo-router",
    {
      "origin": "http://localhost:8081"
    }
  ],
  // ...
]
```

2. **processTryOn.ts** - Uses relative fetch (works on all platforms):

```typescript
const response = await fetch("/virtual-try-on", {
  /* ... */
});
```

3. **Added logging** - To help debug connection issues

## How to Fix "Network request failed"

### Step 1: Restart Expo Dev Server (REQUIRED!)

After changing `app.json`, you MUST restart the dev server:

```bash
# Kill the current server
Press Ctrl+C in the terminal

# Clear cache and restart
npx expo start --clear
```

### Step 2: Verify API Route is Running

In a new terminal, test the API route directly:

```bash
curl http://localhost:8081/virtual-try-on
```

You should see: `{"error":"Method not allowed"}` (because we only support POST)

If you get "Connection refused" or "Failed to connect", the server isn't running or is on a different port.

### Step 3: Check Console Logs

When you try the virtual try-on feature, you should see these logs:

**Client side (React Native):**

```
Making request to /virtual-try-on API route...
Response status: 200
Response ok: true
API response received, has image: true
```

**Server side (Metro bundler terminal):**

```
=== Virtual Try-On API Route Called ===
Request body received: { hasTargetImage: true, hasSourceImage: true, mode: 'PRODUCT_TO_MODEL' }
Calling Gemini API...
Gemini API success, returning result
```

### Step 4: Check Environment Variables

Make sure `.env` has the GEMINI_API_KEY:

```bash
cat .env | grep GEMINI_API_KEY
```

Should show: `GEMINI_API_KEY=AIzaSy...`

## Common Issues & Solutions

### Issue: "Network request failed"

**Cause:** The app can't reach the API route server.

**Solutions:**

1. ✅ **Restart Expo dev server** (most common fix!)
2. ✅ Check if using physical device - might need your computer's IP address instead of localhost
3. ✅ For Android emulator: May need to use `10.0.2.2` instead of `localhost`
4. ✅ For iOS simulator: `localhost` should work

### Issue: "Cannot find module '@google/genai'"

**Cause:** Package not installed or bundler issue.

**Solution:**

```bash
npm install @google/genai
npx expo start --clear
```

### Issue: "Missing GEMINI_API_KEY"

**Cause:** Environment variable not loaded.

**Solutions:**

1. ✅ Check `.env` file exists in project root
2. ✅ Restart Expo dev server after adding env vars
3. ✅ API routes have access to ALL env vars (not just `EXPO_PUBLIC_*` ones)

### Issue: Works on web but not mobile

**Cause:** Origin configuration issue or device network settings.

**For Physical Devices:**

Update the origin in `app.json` to use your computer's IP:

```json
{
  "plugins": [
    [
      "expo-router",
      {
        "origin": "http://192.168.1.100:8081" // Replace with your computer's IP
      }
    ]
  ]
}
```

Find your computer's IP:

- **Windows:** `ipconfig` (look for IPv4 Address)
- **Mac/Linux:** `ifconfig` or `ip addr`

**For Android Emulator:**

The emulator sees `localhost` as itself, not your computer. Use:

```json
{
  "plugins": [
    [
      "expo-router",
      {
        "origin": "http://10.0.2.2:8081" // Special Android emulator address
      }
    ]
  ]
}
```

### Issue: "405 Method Not Allowed"

**Cause:** Making wrong HTTP method (should be POST).

**Check:** Your `processTryOn.ts` should use `method: "POST"`

## Development vs Production

### Development (Current Setup)

- Origin: `http://localhost:8081`
- Works with: `npx expo start`
- Relative fetch: `fetch("/virtual-try-on")` automatically uses origin

### Production (Future Setup)

When deploying, you'll need to:

1. **Deploy the server** (see Expo docs on hosting)
2. **Update origin in app.json** to your production URL:

```json
{
  "plugins": [
    [
      "expo-router",
      {
        "origin": "https://your-production-domain.com"
      }
    ]
  ]
}
```

Or use automatic deployment with EAS:

```bash
# Set in .env
EXPO_UNSTABLE_DEPLOY_SERVER=1

# Build automatically deploys and sets origin
eas build
```

## Testing Checklist

- [ ] Restarted Expo dev server after app.json changes
- [ ] Can curl `http://localhost:8081/virtual-try-on` successfully
- [ ] `.env` file has `GEMINI_API_KEY`
- [ ] `@google/genai` package is installed
- [ ] Using correct origin for your platform (localhost, IP, or 10.0.2.2)
- [ ] Check both client and server console logs

## Debugging Commands

```bash
# Check if dev server is running on correct port
lsof -i :8081

# Test API route directly
curl -X POST http://localhost:8081/virtual-try-on \
  -H "Content-Type: application/json" \
  -d '{"targetImage": {"base64": "test", "mimeType": "image/jpeg"}, "sourceImage": {"base64": "test", "mimeType": "image/jpeg"}, "mode": "PRODUCT_TO_MODEL"}'

# Should return error about invalid images (but proves route is accessible)

# View Metro bundler logs
# Check the terminal where you ran `npx expo start`
```

## Next Steps

1. **Restart Expo:** `npx expo start --clear`
2. **Test virtual try-on** in the app
3. **Check logs** in both Metro terminal and app console
4. **If still failing:** Share the console logs from both client and server

The key is that Expo API Routes work perfectly on all platforms when configured correctly! 🚀
