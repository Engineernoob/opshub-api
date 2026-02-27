import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../src/config/env.js";
import { HttpError } from "../../src/utils/httpError.js";

export type AuthUser = { id: string; role: "admin" | "manager" | "user"; email: string };

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Missing Authorization Bearer token"));
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, env.jwtAccessSecret) as AuthUser;
    req.user = payload;
    return next();
  } catch {
    return next(new HttpError(401, "Invalid or expired token"));
  }
}