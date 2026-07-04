import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { generalRateLimiter } from './middleware/rateLimit.middleware';

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Allow external resources
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

// ─── CORS Configuration ────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true, // Allow cookies to be sent cross-origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Logging ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ─── General Rate Limiting ─────────────────────────────────────────────────────
app.use('/api', generalRateLimiter);

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'PRODIGY_FS_01 API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── Error Handling (must be last) ────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
