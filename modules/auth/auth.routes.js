import { Router } from "express";
import { register, login, refresh } from "../auth/auth.service.js";
const router = Router();
router.post("/register", async (req, res, next) => {
    try {
        const result = await register(req.body);
        res.status(201).json(result);
    }
    catch (e) {
        next(e);
    }
});
router.post("/login", async (req, res, next) => {
    try {
        const result = await login(req.body);
        res.json(result);
    }
    catch (e) {
        next(e);
    }
});
router.post("/refresh", async (req, res, next) => {
    try {
        const result = await refresh(req.body);
        res.json(result);
    }
    catch (e) {
        next(e);
    }
});
export default router;
//# sourceMappingURL=auth.routes.js.map