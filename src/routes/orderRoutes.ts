import { Router } from "express";
import handler from "../handlers/orderHandler";
import { jwtAuthenticate, adminOnly } from "../middlewares/auth";

const router = Router();

router.use(jwtAuthenticate);

router.get("/", handler.get);

router.get("/:id", handler.getById);

router.post("/", jwtAuthenticate, adminOnly, handler.post);

export default router;