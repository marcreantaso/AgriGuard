# AgriGuard Frontend - Security Updates

This document outlines the security improvements made to the frontend.

## 🔒 Changes Made

### 1. Secure Token Storage (`src/utils/tokenStorage.js`)
- JWT tokens stored in `sessionStorage` (cleared when browser closes)
- Backup copy in `localStorage` for page refresh
- User data stored separately without sensitive info
- Automatic token validation

**Usage:**
```javascript
import { tokenStorage } from './utils/tokenStorage';

// Set token after login
tokenStorage.setToken(token);
tokenStorage.setUser(user);

// Get token for API calls (done automatically by API layer)
const token = tokenStorage.getToken();

// Clear on logout
tokenStorage.clear();
```

### 2. API Service Layer (`src/utils/api.js`)
- Centralized API communication
- Automatic token injection in requests
- Error handling
- Support for authenticated endpoints

**Usage:**
```javascript
import { authApi } from './utils/api';

// Login
const response = await authApi.login(email, password);

// Update profile
await authApi.updateProfile({ name, phone, location });

// Change password
await authApi.changePassword(oldPassword, newPassword);
```

### 3. Updated AuthContext (`src/context/AuthContext.jsx`)
- Uses backend API instead of localStorage
- JWT token validation on app startup
- Proper error handling
- New `changePassword` method
- Error state management

**New Properties:**
```javascript
const { user, loading, error, isAuthenticated } = useAuth();
```

### 4. Environment Configuration
Create `.env` file in root:
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=AgriGuard
```

## 🚀 Setup Instructions

### Step 1: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 2: Start Backend Server
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

### Step 3: Install Frontend Dependencies
```bash
npm install
```

### Step 4: Start Frontend Development Server
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## ✅ Testing Security Features

### Test Login
1. Navigate to login page
2. Enter credentials:
   - Email: `farmer@agri.com`
   - Password: `AgriGuard123!`
3. Should successfully login and redirect to home

### Test Sign Up
1. Click "Sign Up"
2. Enter details with a strong password (min 8 chars, uppercase, number, special char)
3. Account created with hashed password

### Test Rate Limiting
1. Try logging in 6 times quickly
2. 6th attempt should be blocked with rate limit message
3. Wait 15 minutes or restart server to reset

### Test Token Expiry
1. Login successfully
2. Wait 7 days (or modify JWT_EXPIRY in `.env`)
3. App should automatically log out and request re-login

### Test Profile Update
1. Login to Profile page
2. Update name, phone, location
3. Changes saved securely via API

### Test Password Change
1. In profile settings, change password
2. Old password must be verified
3. New password must meet requirements
4. After change, can login with new password

## 🔄 API Error Handling

The frontend automatically handles:
- **401 Unauthorized**: Token invalid/expired - redirects to login
- **400 Bad Request**: Validation errors - shows detailed error messages
- **429 Too Many Requests**: Rate limited - shows wait message
- **500 Server Error**: Shows generic error to user

## 📱 Components Using Auth

### Pages Requiring Authentication
- Home
- Scan
- Result
- History
- FieldVisits
- Marketplace
- Wallet
- Analytics
- Profile
- More

### Public Pages
- Login (before authentication)

## 🛠️ Developer Notes

### API Base URL
Configured via `VITE_API_URL` environment variable. For different environments:

**.env (Development)**
```
VITE_API_URL=http://localhost:5000
```

**.env.production (Production)**
```
VITE_API_URL=https://api.agriguard.com
```

### Adding New Protected Endpoints

1. Create endpoint in backend (`server/routes/*.js`)
2. Add middleware: `authMiddleware`
3. Use API service in frontend:
   ```javascript
   const response = await api.post('/api/endpoint', data);
   ```

### Debugging Authentication Issues

```javascript
// Check stored token
import { tokenStorage } from './utils/tokenStorage';
console.log(tokenStorage.getToken());

// Check auth context
const { user, error, isAuthenticated } = useAuth();
console.log({ user, error, isAuthenticated });
```

## 🚨 Known Limitations

### Development Mode
- In-memory database resets on server restart
- Passwords not persisted between restarts
- No real database

### Production Requirements
1. Use HTTPS/TLS
2. Implement httpOnly cookies
3. Add database persistence
4. Implement CSRF protection
5. Add security headers
6. Set up monitoring/logging
7. Configure WAF (Web Application Firewall)

## 📚 Files Modified

- `src/context/AuthContext.jsx` - Updated to use API
- `src/utils/api.js` - **NEW** - API service layer
- `src/utils/tokenStorage.js` - **NEW** - Secure token storage
- `.env` - **NEW** - Environment configuration
- `src/main.jsx` - Uses updated AuthContext

## 🔐 Security Checklist

- [x] Password hashing (bcrypt)
- [x] JWT token authentication
- [x] Rate limiting
- [x] Secure token storage
- [x] CORS protection
- [x] Input validation
- [x] Error handling
- [x] Token expiration
- [ ] HTTPS (production)
- [ ] httpOnly cookies (production)
- [ ] Database encryption (production)

## 📞 Support

For security issues or concerns:
1. Review [SECURITY.md](./SECURITY.md)
2. Check backend [README.md](./server/README.md)
3. Consult [OWASP Guidelines](https://owasp.org/)
