# 🌾 AgriGuard - Getting Started Guide

Complete setup instructions for running AgriGuard with secure authentication.

## 📋 Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional, for version control)

## 🚀 Quick Start (5 minutes)

### Option 1: Automated Setup (Recommended)

#### On macOS/Linux:
```bash
# Clone or navigate to project
cd /path/to/AgriGuard

# Run setup script
chmod +x setup.sh
./setup.sh
```

#### On Windows:
```bash
cd C:\path\to\AgriGuard
setup.bat
```

### Option 2: Manual Setup

#### Step 1: Install Backend Dependencies
```bash
cd server
npm install
```

#### Step 2: Configure Backend
```bash
cd server
# Copy .env.example to .env
cp .env.example .env

# The .env file is already configured with defaults
# No changes needed for local development
```

#### Step 3: Start Backend Server
```bash
cd server
npm run dev
```

Expected output:
```
🌾 AgriGuard Server running on http://localhost:5000
Environment: development
✅ Test user initialized - Email: farmer@agri.com, Password: AgriGuard123!
```

#### Step 4: Install Frontend Dependencies (New Terminal)
```bash
cd /path/to/AgriGuard
npm install
```

#### Step 5: Configure Frontend
```bash
# .env file should already exist with correct values
# If not, create it:
cat > .env << EOF
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=AgriGuard
EOF
```

#### Step 6: Start Frontend Server
```bash
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## 🔓 Login Credentials

After successful startup, use these credentials:

- **Email:** `farmer@agri.com`
- **Password:** `AgriGuard123!`

## ✨ Features to Test

### 1. Authentication
- [ ] Login with test credentials
- [ ] Stay logged in after page refresh
- [ ] Automatic logout after 7 days
- [ ] Error message on invalid credentials

### 2. Sign Up
- [ ] Create new account
- [ ] Password must meet requirements (8+ chars, uppercase, number, special char)
- [ ] Cannot register with existing email
- [ ] Auto-login after signup

### 3. Security
- [ ] Tokens in browser storage (check DevTools → Application)
- [ ] Rate limiting (try 6+ logins in 15 min)
- [ ] Password hashing (passwords never visible in network tab)
- [ ] Secure logout (token removed from storage)

### 4. Profile Management
- [ ] Update name, phone, location
- [ ] Changes persist after page refresh
- [ ] Change password (requires current password)

## 📁 Project Structure

```
AgriGuard/
├── server/                    # Express.js backend
│   ├── server.js             # Main server file
│   ├── routes/               # API routes
│   │   └── auth.js          # Authentication endpoints
│   ├── middleware/           # Express middleware
│   │   ├── auth.js          # JWT verification
│   │   ├── rateLimiter.js   # Rate limiting
│   │   └── errorHandler.js  # Error handling
│   ├── utils/               # Utilities
│   │   ├── db.js            # In-memory database
│   │   ├── passwordUtils.js # Password hashing
│   │   └── tokenUtils.js    # JWT utilities
│   ├── .env                 # Environment variables
│   ├── package.json         # Backend dependencies
│   └── README.md            # Backend documentation
│
├── src/                     # React frontend
│   ├── context/
│   │   ├── AuthContext.jsx  # Authentication state (UPDATED)
│   │   ├── LanguageContext.jsx
│   │   └── LocationContext.jsx
│   ├── utils/
│   │   ├── api.js           # API service (NEW)
│   │   ├── tokenStorage.js  # Token storage (NEW)
│   │   ├── ai.js
│   │   └── db.js
│   ├── pages/               # Page components
│   ├── components/          # Reusable components
│   ├── constants/           # Constants
│   ├── App.jsx              # Main component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
│
├── .env                     # Frontend environment (NEW)
├── .gitignore              # Git ignore rules (UPDATED)
├── package.json            # Frontend dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── SECURITY.md             # Security overview (NEW)
├── FRONTEND_SECURITY.md    # Frontend security guide (NEW)
└── GETTING_STARTED.md      # This file
```

## 🔐 Security Architecture

### Frontend
```
React App
    ↓
API Service Layer (src/utils/api.js)
    ↓
Token Storage (src/utils/tokenStorage.js)
    ↓
AuthContext (src/context/AuthContext.jsx)
```

### Backend
```
Express Server
    ↓
Middleware (Auth, Rate Limit, CORS)
    ↓
Routes (Auth endpoints)
    ↓
Database (In-memory for dev, persistent for prod)
    ↓
Password Hashing (bcrypt)
Token Generation (JWT)
```

## 🛠️ Development Tools

### Browser DevTools
Check authentication implementation:

1. **Application/Storage Tab:**
   - `sessionStorage` → `agriguard_auth_token` (JWT)
   - `localStorage` → `agriguard_user_data` (user info)

2. **Network Tab:**
   - Headers include `Authorization: Bearer <token>`
   - No passwords in request/response bodies
   - Responses don't include hashed passwords

3. **Console:**
   ```javascript
   // Check token
   sessionStorage.getItem('agriguard_auth_token')
   
   // Check auth state
   // In any component using useAuth()
   ```

### Backend Logs
Check server logs for:
- Test user initialization
- Request rate limiting
- Authentication events
- Password validation

## ⚠️ Troubleshooting

### Port Already in Use
```bash
# Linux/macOS - Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Windows - Find process using port 5000
netstat -ano | findstr :5000
# Then kill: taskkill /PID <PID> /F

# Alternative - Use different port
cd server
PORT=3001 npm run dev
```

### CORS Error in Console
```
Access to XMLHttpRequest blocked by CORS
```
**Solution:** Ensure backend is running and VITE_API_URL is correct in `.env`

### Cannot Login
1. Check backend server is running (`npm run dev` in server folder)
2. Verify `.env` has correct `VITE_API_URL`
3. Check browser console for error messages
4. Confirm credentials: `farmer@agri.com` / `AgriGuard123!`

### Token Issues
```
"Token expired" or "Unauthorized" errors
```
**Solution:**
1. Clear browser storage: DevTools → Application → Storage → Clear All
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (macOS)
3. Re-login

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 📊 API Endpoints Reference

All endpoints documented in [server/README.md](./server/README.md)

**Quick Reference:**
- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Create account
- `POST /api/auth/verify` - Verify token
- `POST /api/auth/logout` - Logout
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

## 🚢 Preparing for Production

### Security Checklist
- [ ] Change `JWT_SECRET` in server `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL
- [ ] Move to real database
- [ ] Update `CORS_ORIGIN` to production domain
- [ ] Add security headers (helmet.js)
- [ ] Set up error monitoring (Sentry)
- [ ] Enable logging and auditing
- [ ] Review SECURITY.md guidelines

### Deployment Steps
1. Set production environment variables
2. Build frontend: `npm run build`
3. Deploy frontend (Vercel, Netlify, AWS, etc.)
4. Deploy backend (Heroku, AWS, DigitalOcean, etc.)
5. Configure HTTPS certificates
6. Set up database backups
7. Monitor and log errors

## 📚 Documentation

- **[SECURITY.md](./SECURITY.md)** - Security overview and best practices
- **[FRONTEND_SECURITY.md](./FRONTEND_SECURITY.md)** - Frontend security implementation
- **[server/README.md](./server/README.md)** - Backend API documentation
- **[OWASP Top 10](https://owasp.org/www-project-top-ten/)** - Web security guidelines

## 🆘 Need Help?

### Common Issues
1. Backend won't start → Check Node version (`node -v` requires 16+)
2. Frontend won't connect → Check `VITE_API_URL` in `.env`
3. Login fails → Verify backend test user initialization in logs

### Debug Mode
```bash
# Backend with detailed logs
DEBUG=* npm run dev

# Frontend with React DevTools
# Install React Developer Tools browser extension
```

### Report Issues
1. Check error messages in console
2. Review [server logs](./server/README.md#troubleshooting)
3. Verify prerequisites are installed
4. Try clearing cache and reinstalling dependencies

## ✅ Next Steps

1. **Test All Features:**
   - [ ] Login/Logout
   - [ ] Sign up new account
   - [ ] Update profile
   - [ ] Change password
   - [ ] Navigate all pages
   - [ ] Test rate limiting

2. **Customize:**
   - [ ] Update branding/logo
   - [ ] Modify colors in tailwind.config.js
   - [ ] Add your own pages/features
   - [ ] Configure AI models

3. **Deploy:**
   - [ ] Choose hosting platform
   - [ ] Set up CI/CD pipeline
   - [ ] Configure production database
   - [ ] Enable monitoring

## 🎓 Learning Resources

- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Hooks Documentation](https://react.dev/reference/react)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Vite User Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Happy Coding! 🚀**

Questions? Check the documentation files or review the code comments for detailed explanations.
