import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response.utils';

// ─── Register Validation Rules ─────────────────────────────────────────────────
export const registerValidation = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('Full name can only contain letters, spaces, hyphens, and apostrophes'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

// ─── Login Validation Rules ────────────────────────────────────────────────────
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

// ─── Profile Update Validation Rules ──────────────────────────────────────────
export const updateProfileValidation = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('Full name can only contain letters, spaces, hyphens, and apostrophes'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
];

// ─── Validation Result Handler ─────────────────────────────────────────────────
/**
 * Middleware to check validation results from express-validator.
 * Returns 422 Unprocessable Entity with structured error messages if validation fails.
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg as string);
    errorResponse(res, 'Validation failed', 422, errorMessages);
    return;
  }

  next();
};
