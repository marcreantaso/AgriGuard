import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { initializeUsers } from './utils/db.js';
import { responseCache } from './middleware/caching.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database with test user
initializeUsers();

// Security & Performance Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"]
        }
    }
}));

// Compression middleware - gzip responses
app.use(compression({
    level: 6, // Balance between compression ratio and speed
    threshold: 1024 // Only compress responses larger than 1KB
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Add cache headers middleware
app.use((req, res, next) => {
    // Add cache-control headers for static assets
    if (req.path.match(/\.(js|css|img|font)$/)) {
        res.set('Cache-Control', 'public, max-age=31536000'); // 1 year for versioned assets
    } else if (req.method === 'GET') {
        res.set('Cache-Control', 'public, max-age=300'); // 5 minutes for API responses
    } else {
        res.set('Cache-Control', 'no-store'); // No cache for POST/PUT/DELETE
    }
    next();
});

// Apply rate limiting to API
app.use('/api/', apiLimiter);

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime().toFixed(2) + 's'
    });
});

// Routes
app.use('/api/auth', authRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server with graceful shutdown
const server = app.listen(PORT, () => {
    console.log(`🌾 AgriGuard Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`✅ Compression: Enabled`);
    console.log(`✅ Security Headers: Enabled`);
    console.log(`✅ CORS: Configured`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});


