import { z } from "zod";

//Zod schemas for validating quiz creation and data
export const createQuizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  passingScore: z.number().min(1).max(100).default(70),
  questions: z.array(
    z.object({
      question: z.string().min(5, "Question must be at least 5 characters"),
      options: z.array(z.string().min(1)).min(2, "At least 2 options required").max(4),
      correctIndex: z.number().int().min(0).max(3),
    })
  ).min(1, "At least one question required"),
});

export const submitQuizSchema = z.object({
  answers: z.array(z.number().int().min(0).max(3)),
});