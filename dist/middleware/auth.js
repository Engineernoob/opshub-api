import jwt from "jsonwebtoken";
import { env } from "../../src/config/env.js";
import { HttpError } from "../../src/utils/httpError.js";
export function requireAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return next(new HttpError(401, "Missing Authorization Bearer token"));
    }
    const token = header.slice("Bearer ".length);
    try {
        const payload = jwt.verify(token, env.jwtAccessSecret);
        req.user = payload;
        return next();
    }
    catch {
        return next(new HttpError(401, "Invalid or expired token"));
    }
}
//# sourceMappingURL=auth.js.map