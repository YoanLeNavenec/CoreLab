import { z } from "zod";

//Validation Schemas for Course with price conversion (string > number)
export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price cannot be negative").default(0),
  thumbnail: z.string().url("Invalid thumbnail URL").optional(),
});