import { Router } from "express";
import { prisma } from "../../db/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/rbac.js";
const router = Router();
router.get("/me", requireAuth, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, email: true, role: true, createdAt: true },
    });
    res.json({ user });
});
// Admin only: list users (demo RBAC)
router.get("/", requireAuth, requireRole("admin"), async (_req, res) => {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
    });
    res.json({ users });
});
export default router;
//# sourceMappingURL=users.routes.js.map