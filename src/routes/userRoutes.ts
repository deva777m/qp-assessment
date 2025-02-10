import { Router } from "express";
import { jwtAuthenticate } from "../middlewares/auth";
import handler from "../handlers/userHandler";

const router = Router();

router.get("/", jwtAuthenticate, handler.get);

router.post("/", handler.post);

router.get("/login", handler.login);

export default router;