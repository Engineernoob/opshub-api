import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../../db/prisma.js";
import { env } from "../../config/env.js";
import { HttpError } from "../../utils/httpError.js";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "manager", "user"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function signAccessToken(user: { id: string; email: string; role: any }) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtAccessSecret,
    { expiresIn: env.accessTtlSeconds }
  );
}

function signRefreshToken(user: { id: string; email: string; role: any }) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtRefreshSecret,
    { expiresIn: env.refreshTtlSeconds }
  );
}

export async function register(input: unknown) {
  const data = registerSchema.parse(input);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new HttpError(409, "Email already in use");

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role ?? "user",
    },
    select: { id: true, email: true, role: true },
  });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  const tokenHash = await bcrypt.hash(refreshToken, 12);
  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + env.refreshTtlSeconds * 1000),
    },
  });

  return { user, accessToken, refreshToken };
}

export async function login(input: unknown) {
  const data = loginSchema.parse(input);

  const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (!user) throw new HttpError(401, "Invalid email or password");

  const ok = await bcrypt.compare(data.password, user.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid email or password");

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  const tokenHash = await bcrypt.hash(refreshToken, 12);
  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + env.refreshTtlSeconds * 1000),
    },
  });

  return { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken };
}

export const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export async function refresh(input: unknown) {
  const { refreshToken } = refreshSchema.parse(input);

  let payload: any;
  try {
    payload = jwt.verify(refreshToken, env.jwtRefreshSecret) as any;
  } catch {
    throw new HttpError(401, "Invalid refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) throw new HttpError(401, "Invalid refresh token");

  const tokens = await prisma.refreshToken.findMany({
    where: { userId: user.id, revokedAt: null },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const matches = await Promise.all(tokens.map((t: { tokenHash: string; }) => bcrypt.compare(refreshToken, t.tokenHash)));
  const anyMatch = matches.some(Boolean);
  if (!anyMatch) throw new HttpError(401, "Refresh token revoked or unknown");

  const accessToken = signAccessToken(user);
  return { accessToken };
}