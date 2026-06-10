import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth.store.js";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Welcome to CoreLab</h1>
      <p className={styles.subtitle}>Learn anything, anywhere.</p>

      <div className={styles.actions}>
        {user ? (
          <Link to="/dashboard" className={styles.btnPrimary}>Go to Dashboard</Link>
        ) : (
          <>
            <Link to="/register" className={styles.btnPrimary}>Get Started</Link>
            <Link to="/login" className={styles.btnSecondary}>Login</Link>
          </>
        )}
        <Link to="/courses" className={styles.btnSecondary}>Browse Courses</Link>
      </div>
    </div>
  );
}