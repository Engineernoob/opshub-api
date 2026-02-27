import { buildApp } from "./app.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
process.on("uncaughtException", (err) => {
    console.error("❌ uncaughtException:", err);
    if (err?.stack)
        console.error(err.stack);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.error("❌ unhandledRejection:", reason);
    if (reason?.stack)
        console.error(reason.stack);
    process.exit(1);
});
try {
    const app = buildApp();
    app.listen(env.port, () => {
        logger.info(`OpsHub API listening on http://localhost:${env.port}`);
    });
}
catch (err) {
    console.error("❌ Startup error:", err);
    if (err?.stack)
        console.error(err.stack);
    process.exit(1);
}
//# sourceMappingURL=server.js.map