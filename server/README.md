# AgriGuard Backend Server

Secure authentication server for AgriGuard application built with Express.js

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
cd server
npm install
```

### Configuration

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

**Important Variables:**
- `JWT_SECRET`: Change to a strong random string in production
- `CORS_ORIGIN`: Set to your frontend URL (localhost:5173 for dev)
- `PORT`: Server port (default 5000)

### Generate Strong JWT Secret (Production)

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Running the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will start on `http://localhost:5000`

## 📋 API Endpoints

### Authentication Routes

#### POST `/api/auth/login`
Login with credentials
```json
{
  "email": "farmer@agri.com",
  "password": "AgriGuard123!"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

#### POST `/api/auth/signup`
Create new account
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "09123456789",
  "location": "Nueva Ecija",
  "farmSize": "3 hectares",
  "primaryCrop": "Rice"
}
```

#### POST `/api/auth/verify`
Verify JWT token (requires Authorization header)
```
Authorization: Bearer <token>
```

#### POST `/api/auth/logout`
Logout user (requires token)

#### PUT `/api/auth/profile`
Update user profile (requires token)
```json
{
  "name": "Updated Name",
  "phone": "09987654321",
  "location": "Bulacan",
  "farmSize": "5 hectares"
}
```

#### PUT `/api/auth/password`
Change password (requires token)
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

## 🔒 Security Features

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

Example valid password: `AgriGuard123!`

### Rate Limiting
- Login: 5 attempts per 15 minutes
- Signup: 3 attempts per hour
- General API: 30 requests per minute

### Token Management
- JWT tokens expire after 7 days
- Tokens include user ID, email, and name
- Invalid tokens are automatically rejected

## 🗄️ Database

Currently uses in-memory storage for development. For production, migrate to:
- PostgreSQL
- MongoDB
- MySQL
- Any persistent database

Update `server/utils/db.js` to implement database operations.

## 🧪 Test Credentials

After running `npm run dev`, the following test account is available:

- **Email:** `farmer@agri.com`
- **Password:** `AgriGuard123!`

Create additional test accounts using the signup endpoint.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=3001

# Or kill process on port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000    # Windows
```

### CORS Errors
Ensure `CORS_ORIGIN` in `.env` matches your frontend URL.

### Token Expired
Frontend will automatically request re-login when token expires.

## 📚 Dependencies

- `express`: Web framework
- `cors`: CORS middleware
- `dotenv`: Environment variables
- `jsonwebtoken`: JWT token generation
- `bcryptjs`: Password hashing
- `express-rate-limit`: Rate limiting
- `express-validator`: Input validation

## 🚢 Production Deployment

1. **Update Environment Variables**
   - Change `JWT_SECRET` to a strong random value
   - Set `NODE_ENV=production`
   - Update `CORS_ORIGIN` to production domain

2. **Use HTTPS**
   - All production traffic must be encrypted
   - Use nginx/Apache as reverse proxy

3. **Migrate Database**
   - Move from in-memory to persistent database
   - Implement connection pooling

4. **Add Monitoring**
   - Use error tracking (Sentry)
   - Add performance monitoring
   - Set up logging

5. **Security Headers**
   ```bash
   npm install helmet
   ```
   Add helmet middleware for security headers

6. **Environment Secrets**
   - Store JWT_SECRET in environment variables
   - Never commit .env to version control
   - Use secrets management service (AWS Secrets Manager, etc.)

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)
- [OWASP Security Guidelines](https://owasp.org/)
