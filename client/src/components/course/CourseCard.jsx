import { Link } from "react-router-dom";
import styles from "../../styles/CourseCard.module.css";

//Displays basic information about a course in a card format with link
export default function CourseCard({ course }) {
  return (
    <div>
      {course.thumbnail && (
        <img src={course.thumbnail} alt={course.title} />
      )}
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p>Instructor: {course.instructor.name}</p>
      <p>{course.price === 0 ? "Free" : `$${course.price}`}</p>
      <Link to={`/courses/${course._id}`}>View Course</Link>
    </div>
  );
}
