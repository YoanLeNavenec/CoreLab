import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store.js";
import styles from "../../styles/Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <span className={styles.logo}>Corelab</span>
      <div className={styles.navLinks}>
        <Link to="/" className={styles.navLink}>Home</Link>
        <Link to="/courses" className={styles.navLink}>Courses</Link>
        {user && <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>}
      </div>
      <div className={styles.navRight}>
        {user ? (
          <>
            <span className={styles.adminBadge}>{user.name}</span>
            <button className={styles.avatar} onClick={handleLogout}>
              {user.name?.charAt(0).toUpperCase()}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.navLink}>Login</Link>
            <Link to="/register" className={styles.navLink}>Courses</Link>
          </>
        )}
      </div>
    </nav>
  );
}