import { Link } from "react-router-dom";
import styles from "../../styles/CourseCard.module.css";

export default function CourseCard({ course }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}>📚</div>
        <div className={styles.headerText}>
          <p className={styles.title}>{course.title}</p>
          <p className={styles.meta}>{course.instructor.name} · {course.price === 0 ? "Free" : `$${course.price}`}</p>
        </div>
      </div>

      <div className={styles.body}>
        <p style={{ fontSize: 13, color: 'var(--p-mid)', lineHeight: 1.6 }}>
          {course.description}
        </p>

        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt={course.title}
            style={{ width: '100%', borderRadius: 'var(--radius-sm)', marginTop: 8 }}
          />
        )}

        <Link to={`/courses/${course._id}`} className={styles.button}>
          View Course →
        </Link>
      </div>
    </div>
  );
}
