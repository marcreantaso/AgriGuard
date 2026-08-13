# Security Best Practices Guide

## 🔒 Authentication & Authorization

### 1. Token Management
- JWT tokens are stored in `sessionStorage` for better security (cleared when browser closes)
- A backup copy is kept in `localStorage` for page refresh persistence
- Tokens are automatically included in API request headers
- **IMPORTANT**: In production, migrate to httpOnly cookies handled by the backend

### 2. Password Security
- All passwords are hashed using bcrypt (10 salt rounds)
- Passwords are never stored or transmitted in plain text
- Password strength validation enforces:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one number
  - At least one special character (!@#$%^&*)

### 3. API Authentication
- All protected endpoints require a valid JWT token
- Tokens expire after 7 days (configurable via `JWT_EXPIRY` env var)
- Expired tokens are automatically detected and cleared

## 🛡️ Rate Limiting

### Login Protection
- Maximum 5 login attempts per 15 minutes
- Prevents brute force attacks
- IP-based rate limiting (via express-rate-limit)

### Signup Protection
- Maximum 3 signup attempts per hour
- Prevents spam registration

### General API
- 30 requests per minute per IP
- Prevents API abuse

## 🚀 Environment Configuration

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=AgriGuard
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
```

**CRITICAL**: Change `JWT_SECRET` in production! Use a strong, random string.

## 📋 Security Checklist

- [x] Password hashing with bcrypt
- [x] JWT token-based authentication
- [x] Rate limiting on auth endpoints
- [x] Secure token storage
- [x] CORS protection
- [x] Input validation
- [x] Error handling without info leakage
- [ ] HTTPS in production (configure in deployment)
- [ ] httpOnly cookies (implement in production)
- [ ] CSRF tokens (add if using cookie-based sessions)
- [ ] Content Security Policy headers
- [ ] Database encryption for sensitive data

## 🔑 Production Deployment Notes

1. **Update JWT_SECRET**: Generate a cryptographically secure random string
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Use HTTPS**: All production traffic must be encrypted
   
3. **Move to httpOnly Cookies**: Replace sessionStorage/localStorage with httpOnly cookies
   ```javascript
   // Backend should set cookies with:
   // res.cookie('authToken', token, {
   //   httpOnly: true,
   //   secure: true,  // HTTPS only
   //   sameSite: 'strict'
   // });
   ```

4. **Use Real Database**: Replace in-memory db with PostgreSQL/MongoDB

5. **Add Database Encryption**: Encrypt sensitive fields at rest

6. **Enable HTTPS/TLS**: Configure SSL certificates

7. **Add CSP Headers**: Prevent XSS attacks
   ```javascript
   app.use(helmet());
   ```

8. **Implement Logging**: Use Winston or similar for audit logs

9. **Add API Key Management**: For external API access

10. **Monitor & Alert**: Set up error tracking (Sentry) and performance monitoring

## 🧪 Testing Security

### Login Test Credentials
- Email: `farmer@agri.com`
- Password: Will be auto-hashed during server startup

### Create New Account
- Sign up with a strong password meeting all requirements
- New accounts cannot reuse existing emails

### Rate Limit Testing
- Try logging in 6+ times quickly to trigger rate limiting
- Wait 15 minutes or restart server to reset

## 📚 Additional Resources

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)
