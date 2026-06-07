import { apiFetch } from "./client";

//Defining APIs for Fetch/Post for login/registration/logout/getMe
export const registerUser = (body) =>
  apiFetch("/auth/register", { method: "POST", body: JSON.stringify(body) });

export const loginUser = (body) =>
  apiFetch("/auth/login", { method: "POST", body: JSON.stringify(body) });

export const logoutUser = () =>
  apiFetch("/auth/logout", { method: "POST" });

export const getMe = () =>
  apiFetch("/auth/me");