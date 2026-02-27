import { HttpError } from "../../src/utils/httpError.js";
const rank = {
    user: 1,
    manager: 2,
    admin: 3,
};
export function requireRole(minRole) {
    return (req, _res, next) => {
        const role = req.user?.role;
        if (!role)
            return next(new HttpError(401, "Unauthorized"));
        const roleRank = rank[role];
        const minRank = rank[minRole];
        // Extra safety (keeps TS + runtime happy)
        if (roleRank === undefined || minRank === undefined) {
            return next(new HttpError(403, "Forbidden"));
        }
        if (roleRank < minRank)
            return next(new HttpError(403, "Forbidden"));
        return next();
    };
}
//# sourceMappingURL=rbac.js.map