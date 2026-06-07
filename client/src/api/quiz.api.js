import { apiFetch } from "./client";

//Quiz-related API calls
export const getQuiz = (courseId) =>
  apiFetch(`/courses/${courseId}/quiz`);

//Submit quiz answers, grade the attempt server-side, and record the attempt in the database
export const submitQuiz = (courseId, answers) =>
  apiFetch(`/courses/${courseId}/quiz/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });

//Get all quiz attempts for the logged-in student for a specific course, sorted by most recent first
export const getMyAttempts = (courseId) =>
  apiFetch(`/courses/${courseId}/quiz/attempts`);