import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import multer from 'multer';
import { HttpError } from './httpError.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (res.headersSent) return;
  let status = 500;
  let message = 'The request could not be completed.';
  if (error instanceof ZodError) {
    status = 400;
    message = error.issues.map(issue => `${issue.path.join('.') || 'request'}: ${issue.message}`).join('; ');
  } else if (error instanceof HttpError) {
    status = error.status;
    message = error.message;
  } else if (error?.code === 11000) {
    status = 409;
    message = 'A record with that unique value already exists.';
  } else if (error instanceof SyntaxError) {
    status = 400;
    message = 'Invalid JSON request.';
  } else if (error instanceof multer.MulterError) {
    status = 400;
    message = error.code === 'LIMIT_FILE_SIZE' ? 'Image must be smaller than 8 MB.' : 'Image upload exceeded the allowed limits.';
  }
  if (status === 500) console.error('API request failed', { type: error?.name ?? 'Error' });
  res.status(status).json({ error: message });
};
