import { Request, Response, NextFunction } from "express";
export type AuthUser = {
    id: string;
    role: "admin" | "manager" | "user";
    email: string;
};
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
export declare function requireAuth(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map