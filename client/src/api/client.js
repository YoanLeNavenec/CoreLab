//Vite reading the API URL from environment variables, with a fallback to localhost for development
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4242/api";

//Helper function to make API calls with automatic token handling and refresh logic
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("accessToken");

//Make the API request with the access token if available
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: "include",  // sends cookies automatically (refresh token)
    ...options,
  });

// If the access token is expired, the server will respond with 401 — try to refresh it
  //refresh attempt if unauthorized, then retry original request with new token
  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const newToken = localStorage.getItem("accessToken");
      return apiFetch(endpoint, {
        ...options,
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });
    }
  }

// If the response is not ok, throw an error with the message from the server
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

//Helper function to attempt refreshing the access token using the refresh token cookie
async function tryRefresh() {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
    return true;
  } catch {
    return false;
  }
}