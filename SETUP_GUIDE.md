# Quick Setup Guide

## Fix for Auto-logout Issue

The automatic logout issue is typically caused by missing environment variables. Follow these steps:

### 1. Backend Environment Setup

Create a `.env` file in the `backend` folder with these variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/TypeFace

# JWT Secrets (IMPORTANT: Use strong secrets)
ACCESS_TOKEN_SECRET=your-very-long-secret-key-for-access-tokens-make-it-at-least-32-characters
REFRESH_TOKEN_SECRET=your-very-long-secret-key-for-refresh-tokens-make-it-different-and-longer

# Token Expiry
ACCESS_TOKEN_SECRET_EXPIRY=15m
REFRESH_TOKEN_SECRET_EXPIRY=7d

# CORS Configuration  
CORS_ORIGIN=http://localhost:5173

# Server Port
PORT=8000

# Environment
NODE_ENV=development
```

### 2. Frontend Environment Setup

Create a `.env` file in the `frontend` folder:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 3. Start the Applications

1. **Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Frontend** (in new terminal):
   ```bash
   cd frontend  
   npm run dev
   ```

### 4. Debug Steps

If still having issues:

1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Look for these specific error patterns:
   - "Token refresh failed"
   - "Auth check failed" 
   - "401 Unauthorized"

### 5. Common Issues & Solutions

**Issue**: Auto-logout after few seconds
**Solution**: Check if ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET are set in backend .env

**Issue**: CORS errors
**Solution**: Ensure CORS_ORIGIN in backend .env matches frontend URL

**Issue**: Database connection errors
**Solution**: Start MongoDB service and check MONGODB_URI

### 6. Test the Fix

1. Register a new user
2. Login successfully
3. Navigate to dashboard
4. Wait 30 seconds to see if you stay logged in
5. Refresh the page to test session persistence

The console logs will now show detailed auth flow information to help debug any remaining issues.
