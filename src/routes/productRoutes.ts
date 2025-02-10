import { Router } from "express";
import handler from "../handlers/productHandler";
import { jwtAuthenticate, adminOnly } from "../middlewares/auth";

const router = Router();

// admin protected routes
router.use(jwtAuthenticate);
router.use(adminOnly);

router.get("/", handler.get);

router.get("/:id", handler.getById);

router.post("/", handler.post);

router.patch("/", handler.patch);

router.delete("/", handler.delete);

export default router;