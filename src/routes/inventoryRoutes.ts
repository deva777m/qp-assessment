import { Router } from "express";
import handler from "../handlers/inventoryHandler";
import { jwtAuthenticate, adminOnly } from "../middlewares/auth";

const router = Router();

router.get("/", handler.get);

router.get("/:id", handler.getById);

router.post("/", jwtAuthenticate, adminOnly, handler.post);

router.patch("/", jwtAuthenticate, adminOnly, handler.patch);

export default router;