import { useState, useEffect } from "react";
import { getMyEnrollments } from "../api/course.api";
import { useAuthStore } from "../store/auth.store.js";
import { Link } from "react-router-dom";
import styles from "../styles/Dashboard.module.css";

export default function Dashboard() {
  const { user } = useAuthStore();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await getMyEnrollments();
        setEnrollments(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) return <p className="text-muted">Loading...</p>;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.greeting}>Welcome back, {user.name}</h1>
        <p className={styles.greetingDate}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className={styles.statsRow}>
        <div className={`${styles.statCard} ${styles.statCardAccent}`}>
          <p className={styles.statLabel}>Enrolled courses</p>
          <p className={styles.statValue}>{enrollments.length}</p>
          <p className={styles.statSub}>Total</p>
        </div>
        <div className={`${styles.statCard} ${styles.statCardAccent}`}>
          <p className={styles.statLabel}>In progress</p>
          <p className={styles.statValue}>{enrollments.filter(e => e.progress > 0 && e.progress < 100).length}</p>
          <p className={styles.statSub}>Active</p>
        </div>
        <div className={`${styles.statCard} ${styles.statCardAccent}`}>
          <p className={styles.statLabel}>Completed</p>
          <p className={styles.statValue}>{enrollments.filter(e => e.progress === 100).length}</p>
          <p className={styles.statSub}>Done</p>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>My Courses</h2>
        <Link to="/courses" className={styles.sectionLink}>Browse all →</Link>
      </div>

      {enrollments.length === 0 ? (
        <p className={styles.emptyState}>
          You haven't enrolled in any courses yet. <Link to="/courses">Browse courses</Link>
        </p>
      ) : (
        <div className={styles.courseGrid}>
          {enrollments.map((enrollment) => (
            <div key={enrollment._id} className={styles.notifItem}>
              <div style={{ flex: 1 }}>
                <Link to={`/courses/${enrollment.course._id}`} style={{ fontWeight: 500, color: 'var(--p-darkest)' }}>
                  {enrollment.course.title}
                </Link>
                <p className={styles.statSub} style={{ marginTop: 6, marginBottom: 6 }}>Progress: {enrollment.progress}%</p>
                <div className="progress-track" style={{ height: 6, background: 'var(--p-cream)', borderRadius: 20, overflow: 'hidden' }}>
                  <div style={{
                    width: `${enrollment.progress}%`,
                    background: enrollment.progress < 30 ? 'var(--p-red)' : 'var(--p-charcoal)',
                    height: '100%',
                    borderRadius: 20,
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {user.role === "instructor" && (
        <div style={{ marginTop: '40px' }}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Instructor</h2>
          </div>
          <Link to="/courses/new" style={{
            display: 'inline-block',
            padding: '10px 24px',
            background: 'var(--p-charcoal)',
            color: 'var(--p-cream)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 500,
            fontSize: 14
          }}>
            Create a new course
          </Link>
        </div>
      )}
    </div>
  );
}