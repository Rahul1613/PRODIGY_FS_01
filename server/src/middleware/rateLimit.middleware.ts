import rateLimit from 'express-rate-limit';

/**
 * Auth Rate Limiter
 * Restricts authentication endpoints to 10 requests per 15 minutes per IP.
 * Protects against brute-force and credential stuffing attacks.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,   // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,     // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  skipSuccessfulRequests: false,
});

/**
 * General API Rate Limiter
 * Restricts general API endpoints to 100 requests per 15 minutes per IP.
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
});
