import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

//Checks for authentication and optional role-based access control
export default function ProtectedRoute({ roles }) {
  const { user } = useAuthStore();

  //If no user is logged in, redirect to login page
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  //If user is authenticated and has required role (if specified), render the protected component
  return <Outlet />;
}