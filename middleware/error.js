import { HttpError } from "../utils/httpError.js";
import { logger } from "../config/logger.js";
export function errorHandler(err, _req, res, _next) {
    if (err instanceof HttpError) {
        return res.status(err.status).json({
            error: err.message,
            details: err.details ?? null,
        });
    }
    logger.error({ err }, "Unhandled error");
    return res.status(500).json({ error: "Internal Server Error" });
}
//# sourceMappingURL=error.js.map