import { Request, Response, NextFunction } from "express";
import { HttpError } from "../../src/utils/httpError.js";
import { logger } from "../../src/config/logger.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.message,
      details: err.details ?? null,
    });
  }

  logger.error({ err }, "Unhandled error");
  return res.status(500).json({ error: "Internal Server Error" });
}
