import { describe, it, expect } from "vitest";
import { createQuizSchema, submitQuizSchema } from "./quiz.schema.js";

const validQuiz = {
  title: "React Fundamentals Quiz",
  passingScore: 70,
  questions: [
    {
      question: "What is JSX?",
      options: ["A database", "A syntax extension", "A CSS framework", "A test runner"],
      correctIndex: 1,
    },
  ],
};

describe("createQuizSchema", () => {
  it("accepts valid input", () => {
    const result = createQuizSchema.safeParse(validQuiz);
    expect(result.success).toBe(true);
  });

  it("defaults passingScore to 70 if not provided", () => {
    const { passingScore, ...rest } = validQuiz;
    const result = createQuizSchema.safeParse(rest);
    expect(result.success).toBe(true);
    expect(result.data.passingScore).toBe(70);
  });

  it("rejects a title shorter than 3 characters", () => {
    const result = createQuizSchema.safeParse({ ...validQuiz, title: "Hi" });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.title).toBeDefined();
  });

  it("rejects passingScore above 100", () => {
    const result = createQuizSchema.safeParse({ ...validQuiz, passingScore: 110 });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.passingScore).toBeDefined();
  });

  it("rejects an empty questions array", () => {
    const result = createQuizSchema.safeParse({ ...validQuiz, questions: [] });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.questions).toBeDefined();
  });

  it("rejects a question with fewer than 2 options", () => {
    const result = createQuizSchema.safeParse({
      ...validQuiz,
      questions: [
        {
          question: "What is JSX?",
          options: ["A database"],
          correctIndex: 0,
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a correctIndex out of range", () => {
    const result = createQuizSchema.safeParse({
      ...validQuiz,
      questions: [
        {
          question: "What is JSX?",
          options: ["A database", "A syntax extension"],
          correctIndex: 5,
        },
      ],
    });
    expect(result.success).toBe(false);
  });
});

describe("submitQuizSchema", () => {
  it("accepts a valid answers array", () => {
    const result = submitQuizSchema.safeParse({ answers: [0, 1, 2, 3] });
    expect(result.success).toBe(true);
  });

  it("rejects an answer index out of range", () => {
    const result = submitQuizSchema.safeParse({ answers: [0, 5] });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer answers", () => {
    const result = submitQuizSchema.safeParse({ answers: [0.5, 1] });
    expect(result.success).toBe(false);
  });
});