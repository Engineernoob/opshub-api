import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { fileURLToPath } from "url";

import pinoHttpPkg from "pino-http";
const pinoHttp = (pinoHttpPkg as any).default ?? (pinoHttpPkg as any);

import { logger } from "./config/logger.js";
import { errorHandler } from "./middleware/error.js";

import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import ticketsRoutes from "./modules/tickets/tickets.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function buildApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(pinoHttp({ logger }));

  // ✅ Friendly root
  app.get("/", (_req, res) => {
    res.status(200).json({
      name: "OpsHub API",
      status: "ok",
      health: "/health",
      docs: "/docs",
    });
  });

  app.get("/health", (_req, res) => res.json({ ok: true }));

  // ✅ Swagger/OpenAPI (ESM-safe). If it fails, don't crash the server.
  try {
    const specPath = path.join(__dirname, "openapi.yaml");
    const openapiText = fs.readFileSync(specPath, "utf8");
    const openapiDoc = YAML.parse(openapiText);
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDoc));
  } catch (err) {
    logger.warn({ err }, "Swagger docs disabled (openapi.yaml missing or invalid)");
  }

  app.use("/auth", authRoutes);
  app.use("/users", usersRoutes);
  app.use("/tickets", ticketsRoutes);

  app.use(errorHandler);
  return app;
}