import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

//Navbar component that shows different links based on authentication state
export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  //Handles user logout and redirects to login page
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  //Renders navigation links conditionally based on whether the user is logged in or not
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/courses">Courses</Link>

      {/* If user is logged in, show dashboard link, user name, and logout button. Otherwise, show login and register links. */}
      {user ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <span>{user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}