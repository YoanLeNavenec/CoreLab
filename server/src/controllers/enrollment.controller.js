import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

//Controller functions for enrollments
export const enroll = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const alreadyEnrolled = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.id,
    });
    if (alreadyEnrolled) return res.status(400).json({ message: "Already enrolled" });

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: req.params.id,
    });
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get current user's enrollments with course info populated
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate("course", "title thumbnail instructor");
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update enrollment progress when a lesson is completed
export const updateProgress = async (req, res) => {
  try {
    const { lessonId } = req.body;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.id,
    });
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

//Calculate progress percentage based on completed lessons and total lessons in the course
    const course = await Course.findById(req.params.id).populate("lessons");
    enrollment.progress = Math.round(
      (enrollment.completedLessons.length / course.lessons.length) * 100
    );

    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};