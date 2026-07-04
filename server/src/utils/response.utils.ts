import { Response } from 'express';
import { ApiResponse } from '../types/auth.types';

/**
 * Send a standardized success response
 */
export const successResponse = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

/**
 * Send a standardized error response
 */
export const errorResponse = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: string[]
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  return res.status(statusCode).json(response);
};
