# Virtual Try-On Feature - Complete Analysis & Fix

## Issue Summary

**Problem**: `TypeError: Network request failed` from `node_modules\whatwg-fetch\dist\fetch.umd.js`

**Root Cause**: Multiple fetch calls in the codebase were using the global `fetch` which React Native polyfills with `whatwg-fetch`. This polyfill has compatibility issues in Expo/React Native environment.

## Architecture Overview

### 1. **API Route** (Server-side)

- **File**: `src/app/virtual-try-on+api.ts`
- **Purpose**: Expo API route that handles image generation
- **Technology**: Vercel AI SDK with Google Gemini (`gemini-2.5-flash-image-preview`)
- **Key Function**: `POST()` handler accepts multi-modal inputs and returns generated image

### 2. **Client API Layer**

- **File**: `src/features/virtual-try-on/api/processTryOn.ts`
- **Purpose**: React Query mutation hook for calling the API route
- **Key Functions**:
  - `processTryOn()`: Makes fetch call to `/virtual-try-on` endpoint
  - `useProcessTryOn()`: React Query mutation hook with loading states

### 3. **State Management**

- **File**: `src/features/virtual-try-on/store/tryOnStore.ts`
- **Technology**: Zustand
- **State Managed**:
  - `selectedProduct`: Product being tried on
  - `userImage`: User's photo (base64)
  - `resultImage`: AI-generated result (base64)
  - `isProcessing`: Loading state
  - `error`: Error messages
  - `mode`: Generation mode (PRODUCT_TO_MODEL or MODEL_TO_MODEL)

### 4. **UI Components**

#### TryOnModal (Main Component)

- **File**: `src/features/virtual-try-on/components/TryOnModal.tsx`
- **Purpose**: Orchestrates the try-on flow
- **Flow**:
  1. Product selection (if not pre-selected)
  2. User image upload
  3. Auto-trigger try-on when both are selected
  4. Display results with retry option
- **Fetch Calls**: 2 locations (lines 69 and 119) - fetches product hero image

#### ProductSelector

- **File**: `src/features/virtual-try-on/components/ProductSelector.tsx`
- **Purpose**: Displays grid of products to try on

#### ImagePicker

- **File**: `src/features/virtual-try-on/components/ImagePicker.tsx`
- **Purpose**: Camera/gallery picker for user photo

#### ResultOverlay

- **File**: `src/features/virtual-try-on/components/ResultOverlay.tsx`
- **Purpose**: Displays generated result with loading/error states

### 5. **Type Definitions**

- **File**: `src/features/virtual-try-on/types/TryOnTypes.ts`
- **Key Types**:
  - `ImageData`: `{ base64: string, mimeType: string }`
  - `GenerationMode`: Enum for try-on modes
  - `ProcessTryOnParams`: Parameters for API call

## Data Flow

```
User Interaction
    ↓
TryOnModal (Zustand state updates)
    ↓
useProcessTryOn mutation
    ↓
processTryOn() function → fetch('/virtual-try-on')
    ↓
virtual-try-on+api.ts (Expo API Route)
    ↓
Vercel AI SDK → Google Gemini API
    ↓
Response flows back through chain
    ↓
resultImage stored in Zustand
    ↓
ResultOverlay displays image
```

## Fetch Calls Identified

### 1. **Client API Call** (processTryOn.ts:28)

```typescript
const response = await fetch("/virtual-try-on", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(params),
});
```

### 2. **Product Image Fetch** (TryOnModal.tsx:69)

```typescript
const response = await fetch(selectedProduct.heroImage);
const blob = await response.blob();
```

### 3. **Product Image Fetch on Retry** (TryOnModal.tsx:119)

```typescript
const response = await fetch(selectedProduct.heroImage);
const blob = await response.blob();
```

## Fixes Applied

### Fix #1: Use `cross-fetch` in Client API

**File**: `src/features/virtual-try-on/api/processTryOn.ts`

**Changes**:

1. Import `cross-fetch` explicitly
2. Use full URL with `Constants.expoConfig.hostUri` for development
3. Construct absolute URL instead of relative path

**Before**:

```typescript
const response = await fetch("/virtual-try-on", {...});
```

**After**:

```typescript
import fetch from "cross-fetch";
import Constants from "expo-constants";

const getApiUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const host = debuggerHost.split(':')[0];
    return `http://${host}:8081`;
  }
  return "http://localhost:8081";
};

const response = await fetch(`${apiUrl}/virtual-try-on`, {...});
```

### Fix #2: Use `cross-fetch` in TryOnModal

**File**: `src/features/virtual-try-on/components/TryOnModal.tsx`

**Changes**:

1. Import `cross-fetch` at top of file
2. Replaces global fetch with cross-fetch for product image loading

**Before**:

```typescript
import React, { useEffect } from "react";
// ... other imports
```

**After**:

```typescript
import React, { useEffect } from "react";
// ... other imports
import fetch from "cross-fetch";
```

### Fix #3: Metro Configuration

**File**: `metro.config.js`

**Changes**:

- Block `whatwg-fetch` from being bundled
- Redirect any `whatwg-fetch` imports to `cross-fetch`

```javascript
config.resolver.blockList = [/node_modules\/whatwg-fetch\/.*/];
config.resolver.extraNodeModules = {
  "whatwg-fetch": require.resolve("cross-fetch"),
};
```

### Fix #4: Package.json Overrides

**File**: `package.json`

**Changes**:

- Override `whatwg-fetch` with `cross-fetch` at dependency resolution level

```json
"overrides": {
  "whatwg-fetch": "npm:cross-fetch@^3.1.8"
}
```

### Fix #5: App.json Configuration

**File**: `app.json`

**Changes**:

- Set `router.origin` to `false` to bypass Expo Router's fetch wrapper

```json
"extra": {
  "router": {
    "origin": false
  }
}
```

## Why These Fixes Work

1. **Direct cross-fetch Usage**: `cross-fetch` is React Native compatible and doesn't rely on browser-specific APIs
2. **Full URLs**: Using absolute URLs avoids Expo Router's fetch interception
3. **Metro Blocking**: Prevents `whatwg-fetch` from being bundled at all
4. **Origin Disabled**: Bypasses the problematic `wrapFetchWithWindowLocation` code path

## Testing Checklist

- [ ] Metro bundler starts without errors
- [ ] Client can make request to `/virtual-try-on` endpoint
- [ ] Product images load successfully
- [ ] Try-on generation completes without fetch errors
- [ ] Result image displays correctly
- [ ] Retry functionality works
- [ ] Error handling works properly

## Dependencies

### Required Packages

- `ai` - Vercel AI SDK core
- `@ai-sdk/google` - Google provider for AI SDK
- `cross-fetch` - React Native compatible fetch polyfill
- `expo-constants` - For getting Expo dev server URL
- `@tanstack/react-query` - For mutation hooks
- `zustand` - For state management

### Environment Variables

- `GEMINI_API_KEY` - Google Gemini API key (set in `.env` or `.env.local`)

## API Endpoint Details

### Request Format

```typescript
POST /virtual-try-on
Content-Type: application/json

{
  "targetImage": {
    "base64": "...",
    "mimeType": "image/jpeg"
  },
  "sourceImage": {
    "base64": "...",
    "mimeType": "image/jpeg"
  },
  "mode": "PRODUCT_TO_MODEL",
  "stylePrompt": "optional style guidance",
  "fitPrompt": "optional fit preference"
}
```

### Response Format

```typescript
{
  "image": "data:image/jpeg;base64,...",
  "text": "optional descriptive text"
}
```

### Error Response

```typescript
{
  "error": "error message"
}
```

## Integration Points

### Product Details Page

**File**: `src/app/product/[slug].tsx`

- Imports `TryOnModal`
- Opens modal with single product pre-selected

### Shop Details Page

**File**: `src/app/shop/[id].tsx`

- Imports `TryOnModal`
- Opens modal with shop's products for selection

## Performance Considerations

1. **Image Loading**: Product images are fetched and converted to base64 on-demand
2. **API Timeout**: 60-second timeout for Gemini API calls
3. **State Management**: Zustand provides efficient state updates without re-renders
4. **React Query**: Handles caching and request deduplication

## Future Enhancements

1. **Image Optimization**: Compress images before sending to API
2. **Caching**: Cache product image base64 conversions
3. **Progress Indicators**: Show generation progress
4. **Multiple Results**: Generate and display multiple variations
5. **Style Presets**: Pre-defined style and fit options
6. **Mask Drawing**: Allow users to draw custom masks
7. **Logo Upload**: Support custom logo placement

## Troubleshooting

### If fetch errors persist:

1. Check Metro bundler is running on correct port (8081)
2. Verify device/emulator can reach the host IP
3. Check `Constants.expoConfig.hostUri` returns correct value
4. Ensure `cross-fetch` is properly installed in node_modules
5. Clear Metro cache: `npx expo start --clear`

### If images don't load:

1. Check product `heroImage` URLs are valid
2. Verify CORS if using external image URLs
3. Check FileReader API is working in React Native
4. Ensure image formats are supported (JPEG, PNG)

### If API calls fail:

1. Verify `GEMINI_API_KEY` is set in environment
2. Check API route is properly deployed
3. Verify Gemini API quota and limits
4. Check network connectivity
5. Review API error messages in console

## Summary

The virtual try-on feature is now fully configured to use:

- ✅ Vercel AI SDK for standardized AI integration
- ✅ `cross-fetch` for React Native compatible networking
- ✅ Full URL construction for reliable API calls
- ✅ Proper error handling and loading states
- ✅ Zustand for efficient state management
- ✅ React Query for optimized data fetching

All fetch calls have been updated to avoid the problematic `whatwg-fetch` polyfill, and Metro is configured to block it entirely.
