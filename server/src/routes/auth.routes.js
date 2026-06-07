import { Router } from "express";
import { register, login, refresh, logout, getMe } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

//make the router a const to export at the end for cleaner code and better readability
const router = Router();

//Authentication routes with validation middleware
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);

export default router;