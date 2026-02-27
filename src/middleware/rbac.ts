import { Request, Response, NextFunction } from "express";
import { HttpError } from "../../src/utils/httpError.js";

type Role = "user" | "manager" | "admin";

const rank: Record<Role, number> = {
  user: 1,
  manager: 2,
  admin: 3,
};

export function requireRole(minRole: Role) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = req.user?.role as Role | undefined;
    if (!role) return next(new HttpError(401, "Unauthorized"));

    const roleRank = rank[role];
    const minRank = rank[minRole];

    // Extra safety (keeps TS + runtime happy)
    if (roleRank === undefined || minRank === undefined) {
      return next(new HttpError(403, "Forbidden"));
    }

    if (roleRank < minRank) return next(new HttpError(403, "Forbidden"));

    return next();
  };
}
