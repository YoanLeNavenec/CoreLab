import { Router } from "express";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createCourseSchema, updateCourseSchema } from "../schemas/course.schema.js";
import { enroll, getMyEnrollments, updateProgress } from "../controllers/enrollment.controller.js";

//make the router a const to export at the end for cleaner code and better readability
const router = Router();

//Public routes to get courses and course details
router.get("/", getCourses);
router.get("/:id", getCourse);

//Student routes for enrollment and progress tracking
router.post("/:id/enroll", verifyToken, enroll);
router.get("/enrollments/me", verifyToken, getMyEnrollments);
router.patch("/:id/progress", verifyToken, updateProgress);

//Instructor routes for course management, protected by role middleware
router.post("/", verifyToken, requireRole("instructor", "admin"), validate(createCourseSchema), createCourse);
router.put("/:id", verifyToken, requireRole("instructor", "admin"), validate(updateCourseSchema), updateCourse);
router.delete("/:id", verifyToken, requireRole("instructor", "admin"), deleteCourse);

export default router;