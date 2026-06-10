import { useState, useEffect } from "react";
import { getCourses } from "../api/course.api";
import CourseCard from "../components/course/CourseCard";
import styles from "../styles/Dashboard.module.css";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <p className="text-muted">Loading courses...</p>;
  if (error) return <p style={{ color: 'var(--p-red)' }}>Error: {error}</p>;
  if (courses.length === 0) return <p className={styles.emptyState}>No courses available yet.</p>;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.greeting}>All Courses</h1>
        <p className={styles.greetingDate}>{courses.length} course{courses.length !== 1 ? 's' : ''} available</p>
      </div>

      <div className={styles.courseGrid}>
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}