import { Router } from "express";
import { createQuiz, getQuiz, submitQuiz, getMyAttempts } from "../controllers/quiz.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createQuizSchema, submitQuizSchema } from "../schemas/quiz.schema.js";

const router = Router({ mergeParams: true });

// get the quiz for a course (any logged in user)
router.get("/", verifyToken, getQuiz);

// submit an attempt (students only)
router.post("/submit", verifyToken, requireRole("student"), validate(submitQuizSchema), submitQuiz);

// get my attempts for this course
router.get("/attempts", verifyToken, getMyAttempts);

// create a quiz (instructors only)
router.post("/", verifyToken, requireRole("instructor", "admin"), validate(createQuizSchema), createQuiz);

export default router;