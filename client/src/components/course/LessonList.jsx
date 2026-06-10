import styles from "../../styles/Lesson.module.css";

export default function LessonList({ lessons, onComplete }) {
  if (!lessons.length) return <p className="text-muted">No lessons yet.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {lessons.map((lesson) => (
        <div key={lesson._id} style={{
          background: 'var(--p-offwhite)',
          border: 'var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: 'var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p className={styles.courseName}>Lesson {lesson.order}</p>
              <h3 className={styles.title} style={{ fontSize: 16 }}>{lesson.title}</h3>
            </div>
            {lesson.duration && (
              <span className="text-caption">{lesson.duration} min</span>
            )}
          </div>

          <div className={styles.lessonContent} style={{ padding: '16px 20px' }}>
            {lesson.videoUrl && (
              <video
                controls
                src={lesson.videoUrl}
                style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: 16 }}
              />
            )}
            {lesson.content && <p>{lesson.content}</p>}
          </div>

          {onComplete && (
            <div style={{ padding: '12px 20px', borderTop: 'var(--border)' }}>
              <button
                onClick={() => onComplete(lesson._id)}
                className={styles.navBtnNext}
                style={{ padding: '8px 20px', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
              >
                Mark as complete ✓
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}