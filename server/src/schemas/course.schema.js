import { z } from "zod";

//Validation Schemas for Course
export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price cannot be negative").default(0),
  thumbnail: z.string().url("Invalid thumbnail URL").optional(),
});

// For updating, all fields are optional
export const updateCourseSchema = createCourseSchema.partial();

//Validation Schemas for Lesson
export const createLessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().optional(),
  videoUrl: z.string().url("Invalid video URL").optional(),
  order: z.number().int().min(1),
  duration: z.number().min(0).optional(),
});