import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";

//Controller functions for courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate("instructor", "name email")
      .select("-lessons");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get single course with instructor and lessons populated
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("lessons");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Create course function, only accessible to instructors
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user.id,
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update course function, only accessible to the instructor who created it
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete course function, only accessible to the instructor who created it
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};