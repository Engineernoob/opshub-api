import { z } from "zod";
import { prisma } from "../../db/prisma.js";
import { HttpError } from "../../utils/httpError.js";

export const createTicketSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(2000).optional(),
  assigneeId: z.string().optional(),
});

export const updateTicketSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  description: z.string().max(2000).optional(),
  assigneeId: z.string().nullable().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed"]),
});

const allowedTransitions: Record<string, string[]> = {
  open: ["in_progress", "closed"],
  in_progress: ["resolved", "open"],
  resolved: ["closed", "in_progress"],
  closed: [],
};

export function assertTransition(from: string, to: string) {
  const allowed = allowedTransitions[from] ?? [];
  if (!allowed.includes(to)) {
    throw new HttpError(400, `Invalid status transition: ${from} -> ${to}`);
  }
}

export async function listTickets(params: {
  q?: string;
  status?: any;
  assigneeId?: string;
  page: number;
  limit: number;
}) {
  const { q, status, assigneeId, page, limit } = params;
  const where: any = {};

  if (status) where.status = status;
  if (assigneeId) where.assigneeId = assigneeId;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        createdBy: { select: { id: true, email: true, role: true } },
        assignee: { select: { id: true, email: true, role: true } },
      },
    }),
    prisma.ticket.count({ where }),
  ]);

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}