import { z } from "zod";

//Schema for creating a quiz with title, passing score, and an array of questions, each with its own validation rules
export const createQuizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  passingScore: z.coerce.number().min(1).max(100).default(70),
  questions: z.array(
    z.object({
      question: z.string().min(5, "Question must be at least 5 characters"),
      options: z.array(z.string().min(1)).min(2).max(4),
      correctIndex: z.coerce.number().int().min(0).max(3),
    })
  ).min(1, "At least one question required"),
});