import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourse, enrollInCourse, getCourseLessons, updateProgress } from "../api/course.api";
import { useAuthStore } from "../store/authStore";
import LessonList from "../components/course/LessonList";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  //State variables for course data, lessons, loading state, error messages, and enrollment state
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  //Fetch course details and lessons from API on component mount, with error handling and loading state management
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

    //Call the fetchData function to load course details and lessons when the component mounts
    fetchData();
  }, [id]);

  //Handles enrolling the user in the course, checks if user is logged in, calls enrollInCourse API, and sends to dashboard on success
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

  //Handles marking a lesson as complete by calling the updateProgress API with the course ID and lesson ID, with error handling
  const handleLessonComplete = async (lessonId) => {
    try {
      await updateProgress(id, lessonId);
    } catch (err) {
      console.error(err.message);
    }
  };

  //Render loading message, error message, or course details based on current state
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!course) return <p>Course not found.</p>;

  //Render course thumbnail, title, description, instructor name, price, enroll button, quiz link for logged-in users, and list of lessons with completion handling
  return (
    <div>
      {course.thumbnail && <img src={course.thumbnail} alt={course.title} />}
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>Instructor: {course.instructor.name}</p>
      <p>{course.price === 0 ? "Free" : `$${course.price}`}</p>

      <button onClick={handleEnroll} disabled={enrolling}>
        {enrolling ? "Enrolling..." : "Enroll in this course"}
      </button>

      {/* quiz link — only shown to logged in users */}
      {user && (
        <Link to={`/courses/${id}/quiz`}>Take the Quiz</Link>
      )}

      {/* Lessons section with a LessonList component that displays the list of lessons and allows marking them as complete */}
      <h2>Lessons</h2>
      <LessonList lessons={lessons} onComplete={handleLessonComplete} />
    </div>
  );
}