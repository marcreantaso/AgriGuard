# 🌾 AgriGuard - Agricultural Disease Detection Platform

Secure, AI-powered agricultural disease detection system with comprehensive authentication.

## ✨ Features

- 🔍 **AI-Powered Disease Detection** - Real-time crop disease analysis using TensorFlow
- 📱 **Mobile-First UI** - Responsive design optimized for field use
- 🌍 **Multi-Language Support** - Support for multiple local languages
- 📍 **Location Tracking** - Track field visits and scans by location
- 💰 **Marketplace** - Buy and sell agricultural products
- 📊 **Analytics** - Detailed crop health analytics and history
- 🔐 **Secure Authentication** - JWT-based authentication with password hashing
- ⚡ **Rate Limiting** - Protection against brute force attacks
- 🚀 **Performance** - Built with Vite for optimal development and build times

## 🚀 Quick Start

### Automated Setup (Recommended)

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```bash
setup.bat
```

### Manual Setup

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

### Login
- **Email:** `farmer@agri.com`
- **Password:** `AgriGuard123!`

## 📖 Documentation

### Getting Started
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Complete setup guide with troubleshooting
- **[SECURITY_IMPLEMENTATION.md](./SECURITY_IMPLEMENTATION.md)** - Overview of all security improvements

### Security
- **[SECURITY.md](./SECURITY.md)** - Security architecture and best practices
- **[FRONTEND_SECURITY.md](./FRONTEND_SECURITY.md)** - Frontend security implementation details
- **[server/README.md](./server/README.md)** - Backend API documentation

## 🏗️ Project Structure

```
AgriGuard/
├── server/                 # Express.js backend (NEW)
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication & rate limiting
│   ├── utils/             # Password hashing, token generation
│   └── README.md          # Backend documentation
├── src/
│   ├── context/           # React context (AuthContext UPDATED)
│   ├── utils/             # API service & token storage (NEW)
│   ├── pages/             # Page components
│   ├── components/        # Reusable components
│   └── constants/         # Constants & translations
├── GETTING_STARTED.md     # Setup instructions (NEW)
├── SECURITY.md            # Security overview (NEW)
├── SECURITY_IMPLEMENTATION.md  # Implementation details (NEW)
└── FRONTEND_SECURITY.md   # Frontend security (NEW)
```

## 🔐 Security Improvements

### ✅ Implemented

| Feature | Details |
|---------|---------|
| **Password Hashing** | bcrypt with 10 salt rounds |
| **JWT Authentication** | 7-day token expiry |
| **Rate Limiting** | 5 login attempts per 15 minutes |
| **Secure Token Storage** | sessionStorage + localStorage backup |
| **CORS Protection** | Whitelisted origins |
| **Input Validation** | Server-side validation on all endpoints |
| **Error Handling** | Generic error messages prevent info leakage |

### 🆕 New Components

- **Express.js Backend** - Centralized authentication server
- **API Service Layer** - Automatic token injection & error handling
- **Token Storage Manager** - Secure sessionStorage/localStorage handling
- **Rate Limiting Middleware** - Brute force protection
- **Password Validation** - Strength requirements enforcement

## 🛠️ Technology Stack

### Frontend
- React 18.2
- Vite 5
- React Router 6
- Tailwind CSS 3.4
- Framer Motion
- React Webcam
- TensorFlow.js
- Lucide Icons

### Backend
- Express.js 4
- jsonwebtoken (JWT)
- bcryptjs (Password hashing)
- express-rate-limit
- express-validator
- CORS

### Development Tools
- ESLint
- PostCSS & Autoprefixer
- Nodemon

## 📋 Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Git** (optional)

## 🧪 Test Credentials

After setup, login with:
```
Email:    farmer@agri.com
Password: AgriGuard123!
```

Create additional test accounts via signup.

## 🔑 Environment Configuration

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=AgriGuard
```

### Backend (server/.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=agriguard-dev-secret-change-in-production-12345
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
```

**⚠️ WARNING:** Change `JWT_SECRET` in production!

## 📊 API Documentation

See [server/README.md](./server/README.md) for complete API documentation.

### Key Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - Create account
- `POST /api/auth/verify` - Verify token
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

## 🚀 Development

### Available Scripts

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend:**
```bash
cd server
npm run dev      # Start with auto-reload (nodemon)
npm start        # Production start
```

## 🐛 Troubleshooting

### Backend won't start
- Check Node.js version: `node -v` (requires 16+)
- Ensure port 5000 is free
- Check .env configuration

### Frontend won't connect
- Verify backend is running on port 5000
- Check VITE_API_URL in .env
- Check browser console for errors

### Login fails
- Use correct credentials: `farmer@agri.com` / `AgriGuard123!`
- Check backend logs for errors
- Clear browser storage: DevTools → Application → Clear All

See [GETTING_STARTED.md](./GETTING_STARTED.md) for more troubleshooting.

## 🚢 Production Deployment

### Security Checklist
- [ ] Change JWT_SECRET to random value
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/SSL
- [ ] Migrate to persistent database
- [ ] Implement httpOnly cookies
- [ ] Add security headers (helmet.js)
- [ ] Set up monitoring & logging
- [ ] Configure WAF & rate limiting at CDN level

See [SECURITY.md](./SECURITY.md) for complete production checklist.

## 📚 Learning Resources

- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Security Guidelines](https://owasp.org/)

## 🤝 Contributing

1. Review security guidelines in [SECURITY.md](./SECURITY.md)
2. Follow existing code style
3. Test all authentication flows
4. Document changes

## 📝 License

MIT License - See LICENSE file for details

## 🆘 Support

- 📖 Check [GETTING_STARTED.md](./GETTING_STARTED.md)
- 🔐 Review [SECURITY.md](./SECURITY.md)
- 🔧 See [SECURITY_IMPLEMENTATION.md](./SECURITY_IMPLEMENTATION.md)
- 🌐 Backend docs in [server/README.md](./server/README.md)

## 🎯 Next Steps

1. **Setup** - Run `setup.sh` or `setup.bat`
2. **Read** - Review [GETTING_STARTED.md](./GETTING_STARTED.md)
3. **Test** - Try all authentication flows
4. **Develop** - Customize for your needs
5. **Deploy** - Follow [SECURITY.md](./SECURITY.md) production checklist

---

**Version:** 0.2.0 (With Security Updates)  
**Last Updated:** August 13, 2026  
**Status:** 🟢 Ready for Development

🌾 **Happy Farming with AgriGuard!** 🌾
