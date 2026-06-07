export default function LessonList({ lessons, onComplete }) {
  if (!lessons.length) return <p>No lessons yet.</p>;

  //Render a list of lessons with title, video, content, duration, and completion button
  return (
    <ul>
      {lessons.map((lesson) => (
        <li key={lesson._id}>
          <h3>{lesson.order}. {lesson.title}</h3>
          {lesson.videoUrl && (
            <video controls src={lesson.videoUrl} width="600" />
          )}
          {lesson.content && <p>{lesson.content}</p>}
          {lesson.duration && <p>Duration: {lesson.duration} min</p>}
          {onComplete && (
            <button onClick={() => onComplete(lesson._id)}>
              Mark as complete
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}