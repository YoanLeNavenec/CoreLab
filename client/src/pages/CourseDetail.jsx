import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourse, enrollInCourse, getCourseLessons, updateProgress } from "../api/course.api";
import { useAuthStore } from "../store/auth.store.js";
import LessonList from "../components/course/LessonList";
import styles from "../styles/Lesson.module.css";
import dashStyles from "../styles/Dashboard.module.css";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, lessonData] = await Promise.all([
          getCourse(id),
          getCourseLessons(id),
        ]);
        setCourse(courseData);
        setLessons(lessonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) return navigate("/login");
    try {
      setEnrolling(true);
      await enrollInCourse(id);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  const handleLessonComplete = async (lessonId) => {
    try {
      await updateProgress(id, lessonId);
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <p className="text-muted">Loading...</p>;
  if (error) return <p style={{ color: 'var(--p-red)' }}>Error: {error}</p>;
  if (!course) return <p className="text-muted">Course not found.</p>;

  return (
    <div className={styles.page}>

      {/* Course header */}
      <div className={styles.header}>
        <p className={styles.breadcrumb}>
          <Link to="/courses" className={styles.breadcrumbLink}>Courses</Link>
          <span className={styles.breadcrumbSep}>/</span>
          {course.title}
        </p>

        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt={course.title}
            style={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: 24 }}
          />
        )}

        <p className={styles.courseName}>{course.instructor.name}</p>
        <h1 className={styles.title}>{course.title}</h1>
        <p style={{ color: 'var(--p-charcoal)', marginBottom: 16 }}>{course.description}</p>

        <div className={styles.meta}>
          <span>{lessons.length} lessons</span>
          <span>{course.price === 0 ? "Free" : `$${course.price}`}</span>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            style={{
              padding: '10px 24px',
              background: 'var(--p-charcoal)',
              color: 'var(--p-cream)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 500,
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            {enrolling ? "Enrolling..." : "Enroll in this course"}
          </button>

          {user && (
            <Link
              to={`/courses/${id}/quiz`}
              style={{
                padding: '10px 24px',
                border: 'var(--border-strong)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 500,
                fontSize: 14,
                color: 'var(--p-charcoal)'
              }}
            >
              Take the Quiz
            </Link>
          )}
        </div>

        {error && <p style={{ color: 'var(--p-red)', marginTop: 12 }}>{error}</p>}
      </div>

      {/* Lessons */}
      <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Lessons</h2>
      <LessonList lessons={lessons} onComplete={handleLessonComplete} />

    </div>
  );
}