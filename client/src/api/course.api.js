import { apiFetch } from "./client";

//Defining APIs for Fetch/Post for courses CRUD/enrollment/progress
export const getCourses = () =>
  apiFetch("/courses");

export const getCourse = (id) =>
  apiFetch(`/courses/${id}`);

export const createCourse = (body) =>
  apiFetch("/courses", { method: "POST", body: JSON.stringify(body) });

export const updateCourse = (id, body) =>
  apiFetch(`/courses/${id}`, { method: "PUT", body: JSON.stringify(body) });

export const deleteCourse = (id) =>
  apiFetch(`/courses/${id}`, { method: "DELETE" });

export const enrollInCourse = (id) =>
  apiFetch(`/courses/${id}/enroll`, { method: "POST" });

export const getMyEnrollments = () =>
  apiFetch("/courses/enrollments/me");

export const updateProgress = (courseId, lessonId) =>
  apiFetch(`/courses/${courseId}/progress`, {
    method: "PATCH",
    body: JSON.stringify({ lessonId }),
  });

export const getCourseLessons = (courseId) =>
  apiFetch(`/courses/${courseId}/lessons`);