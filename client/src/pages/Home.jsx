import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Home() {
  const { user } = useAuthStore();

  //Render welcome message and links to dashboard, registration, login, and courses based on authentication state
  return (
    <div>
      <h1>Welcome to CoreLab</h1>
      <p>Learn anything, anywhere.</p>
      {user ? (
        <Link to="/dashboard">Go to Dashboard</Link>
      ) : (
        <>
          <Link to="/register">Get Started</Link>
          <Link to="/login">Login</Link>
        </>
      )}
      <Link to="/courses">Browse Courses</Link>
    </div>
  );
}