import { Router } from "express";
import { prisma } from "../../db/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/rbac.js";
import { HttpError } from "../../utils/httpError.js";
import { createTicketSchema, updateTicketSchema, updateStatusSchema, assertTransition, listTickets, } from "./tickets.service.js";
const router = Router();
function getIdParam(req) {
    const id = req.params?.id;
    if (typeof id !== "string" || !id)
        throw new HttpError(400, "Missing ticket id");
    return id;
}
// List tickets (any authenticated user)
router.get("/", requireAuth, async (req, res, next) => {
    try {
        const page = Math.max(1, Number(req.query.page ?? 1));
        const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 20)));
        const q = typeof req.query.q === "string" ? req.query.q : undefined;
        const status = typeof req.query.status === "string" ? req.query.status : undefined;
        const assigneeId = typeof req.query.assigneeId === "string" ? req.query.assigneeId : undefined;
        const params = { page, limit };
        if (q)
            params.q = q;
        if (status)
            params.status = status;
        if (assigneeId)
            params.assigneeId = assigneeId;
        const data = await listTickets(params);
        res.json(data);
    }
    catch (e) {
        next(e);
    }
});
// Create ticket
router.post("/", requireAuth, async (req, res, next) => {
    try {
        const data = createTicketSchema.parse(req.body);
        // ✅ Only include optional fields if they exist
        const createData = {
            title: data.title,
            createdById: req.user.id,
        };
        if (data.description !== undefined)
            createData.description = data.description ?? null;
        if (data.assigneeId !== undefined)
            createData.assigneeId = data.assigneeId ?? null;
        const ticket = await prisma.ticket.create({
            data: createData,
        });
        res.status(201).json({ ticket });
    }
    catch (e) {
        next(e);
    }
});
// Get by id
router.get("/:id", requireAuth, async (req, res, next) => {
    try {
        const id = getIdParam(req);
        const ticket = await prisma.ticket.findUnique({
            where: { id },
            include: {
                createdBy: { select: { id: true, email: true, role: true } },
                assignee: { select: { id: true, email: true, role: true } },
            },
        });
        if (!ticket)
            throw new HttpError(404, "Ticket not found");
        res.json({ ticket });
    }
    catch (e) {
        next(e);
    }
});
// Update fields (manager+)
router.patch("/:id", requireAuth, requireRole("manager"), async (req, res, next) => {
    try {
        const id = getIdParam(req);
        const data = updateTicketSchema.parse(req.body);
        const existing = await prisma.ticket.findUnique({ where: { id } });
        if (!existing)
            throw new HttpError(404, "Ticket not found");
        // ✅ Build update payload without undefined
        const updateData = {};
        if (data.title !== undefined)
            updateData.title = data.title;
        if (data.description !== undefined)
            updateData.description = data.description ?? null;
        // Assignee: allow null to unassign
        if (data.assigneeId !== undefined)
            updateData.assigneeId = data.assigneeId;
        const ticket = await prisma.ticket.update({
            where: { id },
            data: updateData,
        });
        res.json({ ticket });
    }
    catch (e) {
        next(e);
    }
});
// Update status (manager+)
router.patch("/:id/status", requireAuth, requireRole("manager"), async (req, res, next) => {
    try {
        const id = getIdParam(req);
        const { status } = updateStatusSchema.parse(req.body);
        const existing = await prisma.ticket.findUnique({ where: { id } });
        if (!existing)
            throw new HttpError(404, "Ticket not found");
        assertTransition(existing.status, status);
        const ticket = await prisma.ticket.update({
            where: { id },
            data: { status },
        });
        res.json({ ticket });
    }
    catch (e) {
        next(e);
    }
});
// Delete (admin only)
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
    try {
        const id = getIdParam(req);
        const existing = await prisma.ticket.findUnique({ where: { id } });
        if (!existing)
            throw new HttpError(404, "Ticket not found");
        await prisma.ticket.delete({ where: { id } });
        res.status(204).send();
    }
    catch (e) {
        next(e);
    }
});
export default router;
//# sourceMappingURL=tickets.routes.js.map