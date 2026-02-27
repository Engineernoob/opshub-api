import { Request, Response, NextFunction } from "express";
type Role = "user" | "manager" | "admin";
export declare function requireRole(minRole: Role): (req: Request, _res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=rbac.d.ts.map