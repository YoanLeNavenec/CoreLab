import { Router } from "express";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createLessonSchema } from "../schemas/course.schema.js";

//make the router a const to export at the end for cleaner code and better readability with mergeParams to access courseId from parent route
const router = Router({ mergeParams: true });

//Get all lessons for a course using a protected route for enrolled students and instructors
router.get("/", verifyToken, async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId }).sort("order");
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Create lesson function, only accessible to the instructor who created the course
router.post("/", verifyToken, requireRole("instructor", "admin"), validate(createLessonSchema), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const lesson = await Lesson.create({ ...req.body, course: req.params.courseId });

    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete lesson function, only accessible to the instructor who created the course
router.delete("/:lessonId", verifyToken, requireRole("instructor", "admin"), async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    await lesson.deleteOne();

    await Course.findByIdAndUpdate(req.params.courseId, {
      $pull: { lessons: req.params.lessonId },
    });

    res.json({ message: "Lesson deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;